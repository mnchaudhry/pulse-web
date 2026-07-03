import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server-client'
import { botMessageSchema } from '@/schemas/bot-message.schema'
import { runBotTurn } from '@/services/bot/run-bot-turn'

// US-52..59: bot chat endpoint. Auth via the dashboard session (RLS-scoped),
// runs a Gemini tool-calling turn over the user's aggregates.
const bodySchema = z.object({
  messages: z.array(botMessageSchema).min(1),
  deviceId: z.string().default('combined'),
})

export const POST = async (request: Request) => {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  try {
    const result = await runBotTurn(parsed.data.messages, {
      supabase,
      deviceId: parsed.data.deviceId,
    })
    return NextResponse.json(result)
  }
  catch (error) {
    return NextResponse.json({ error: 'Bot error', detail: String(error) }, { status: 500 })
  }
}
