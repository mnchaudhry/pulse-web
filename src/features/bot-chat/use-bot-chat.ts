'use client'

import type { ChatMessageData } from './components/chat-message'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDeviceFilterStore } from '@/stores/device-filter-store'
import { loadBotChat, saveBotChat } from './bot-chat-storage'

const INITIAL_MESSAGES: ChatMessageData[] = [
  {
    id: 'intro',
    role: 'bot',
    text: 'Ask me about your own activity — time by category, top domains, or how this week compares to last. I only see the aggregated numbers, never the pages behind them.',
  },
]

// US-52..59: chat state + calls to /api/bot/chat, scoped to the active device.
export const useBotChat = () => {
  const deviceId = useDeviceFilterStore(s => s.deviceId)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<ChatMessageData[]>(() => loadBotChat(deviceId)?.messages ?? INITIAL_MESSAGES)
  const [draft, setDraft] = useState(() => loadBotChat(deviceId)?.draft ?? '')
  const [isSending, setIsSending] = useState(false)
  const consumedPrompt = useRef(false)

  // P3.5: restore this scope's thread when the scope changes. Adjusted
  // synchronously during render (not an effect) per React's guidance for
  // resetting state when a prop changes — avoids an extra commit/flash.
  const [hydratedDeviceId, setHydratedDeviceId] = useState(deviceId)
  if (deviceId !== hydratedDeviceId) {
    setHydratedDeviceId(deviceId)
    const persisted = loadBotChat(deviceId)
    setMessages(persisted?.messages ?? INITIAL_MESSAGES)
    setDraft(persisted?.draft ?? '')
  }

  useEffect(() => {
    saveBotChat(deviceId, { messages, draft })
  }, [deviceId, messages, draft])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isSending)
      return

    const stamp = `${messages.length}-${trimmed.length}`
    const nextMessages: ChatMessageData[] = [...messages, { id: `u-${stamp}`, role: 'user', text: trimmed }]
    setMessages(nextMessages)
    setDraft('')
    setIsSending(true)

    try {
      const response = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          messages: nextMessages.map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
      })
      const data = await response.json()
      setMessages(prev => [
        ...prev,
        {
          id: `b-${stamp}`,
          role: 'bot',
          text: response.ok ? (data.content ?? '') : 'Something went wrong answering that. Try again in a moment.',
          cites: response.ok ? data.citations : undefined,
        },
      ])
    }
    catch {
      setMessages(prev => [
        ...prev,
        { id: `b-${stamp}`, role: 'bot', text: 'I couldn’t reach the server. Check your connection and try again.' },
      ])
    }
    finally {
      setIsSending(false)
    }
  }

  // P0.2: a prefilled prompt arriving via `?prompt=` (e.g. "Ask the bot" on an
  // insight card) is sent immediately, then scrubbed from the URL.
  useEffect(() => {
    const prompt = searchParams.get('prompt')
    if (!prompt || consumedPrompt.current)
      return
    consumedPrompt.current = true
    router.replace(pathname)
    send(prompt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return { messages, draft, setDraft, send, isSending }
}
