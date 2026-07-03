import type { Content } from '@google/genai'
import type { BotMessage } from '@/schemas/bot-message.schema'
import type { ToolContext } from './gemini-tools'
import { GEMINI_MODEL, getGeminiClient } from '@/lib/gemini/client'
import { executeTool, functionDeclarations } from './gemini-tools'

const SYSTEM_INSTRUCTION = `You are Pulse's assistant. You answer ONLY questions about the user's own aggregated browsing activity, using the provided tools.

Rules:
- Use tools to get real numbers; never invent figures. Every quantitative claim must come from a tool result.
- You can only see aggregated time by category and domain. You CANNOT see page content, full URLs, raw history, or anything the user excluded — say so plainly if asked.
- If a question is outside this scope (general knowledge, opinions, anything not about their activity data), briefly decline and steer back to what you can answer.
- Be concise and neutral — describe, never judge. This is a mirror, not a coach.
- Durations are in minutes from tools; render them naturally (e.g. "2h 12m").`

const MAX_STEPS = 4

export interface BotTurnResult {
  content: string
  citations: { k: string, v: string }[]
}

// US-52..59: one bot turn with a tool-calling loop over the user's aggregates.
export const runBotTurn = async (messages: BotMessage[], ctx: ToolContext): Promise<BotTurnResult> => {
  const ai = getGeminiClient()
  const contents: Content[] = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const citations: { k: string, v: string }[] = []

  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION, tools: [{ functionDeclarations }] },
    })

    const calls = response.functionCalls ?? []
    if (calls.length === 0)
      return { content: response.text ?? '', citations }

    contents.push({ role: 'model', parts: calls.map(call => ({ functionCall: call })) })

    const responseParts = []
    for (const call of calls) {
      const outcome = await executeTool(call.name ?? '', (call.args ?? {}) as Record<string, unknown>, ctx)
      citations.push(...outcome.citations)
      responseParts.push({ functionResponse: { name: call.name ?? '', response: { result: outcome.result } } })
    }
    contents.push({ role: 'user', parts: responseParts })
  }

  return { content: 'I couldn’t finish that one — try rephrasing?', citations }
}
