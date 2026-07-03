'use client'

import type { ChatMessageData } from './components/chat-message'
import { useState } from 'react'
import { useDeviceFilterStore } from '@/stores/device-filter-store'

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
  const [messages, setMessages] = useState<ChatMessageData[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)

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

  return { messages, draft, setDraft, send, isSending }
}
