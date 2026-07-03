'use client'

import { useState } from 'react'
import type { ChatMessageData } from './components/chat-message'
import { ChatInput } from './components/chat-input'
import { ChatMessage } from './components/chat-message'

const INITIAL_MESSAGES: ChatMessageData[] = [
  {
    id: 'm1',
    role: 'user',
    text: 'How much time did I spend on Social this week?',
  },
  {
    id: 'm2',
    role: 'bot',
    text: '3h 12m on Social this week — 18% below your 4-week average of 3h 54m. The biggest single day was Monday at 58m.',
    cites: [
      { k: 'Social · this week', v: '3h 12m' },
      { k: '4-wk avg', v: '3h 54m' },
      { k: 'peak day', v: 'Mon 58m' },
    ],
  },
]

const SUGGESTIONS = [
  'Compare Dev this week vs last',
  'Top domains this month',
  'When was my longest focus block?',
]

// Canned reply until /api/bot/chat is wired (US-52..59).
const cannedReply = (id: string): ChatMessageData => ({
  id,
  role: 'bot',
  text: 'I read your aggregates for that range and answer with the exact figures — this is a static mock, so imagine the cited number here.',
  cites: [{ k: 'source', v: 'daily_aggregates' }],
})

export const BotChat = () => {
  const [messages, setMessages] = useState<ChatMessageData[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed)
      return

    const stamp = `${messages.length}-${trimmed.length}`
    setMessages(prev => [
      ...prev,
      { id: `u-${stamp}`, role: 'user', text: trimmed },
      cannedReply(`b-${stamp}`),
    ])
    setDraft('')
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-3 border-b border-hairline px-[34px] py-[22px]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005ea4" strokeWidth="1.7">
          <rect x="4" y="8" width="16" height="11" rx="3" />
          <path d="M12 8V5M9 3.5h6M9 13h.01M15 13h.01M9.5 16.5h5" />
        </svg>
        <div>
          <h1 className="text-[17px] font-semibold">Bot</h1>
          <p className="mt-0.5 text-xs text-ink-3">
            Read-only over your aggregates · scoped to
            {' '}
            <span className="mono text-ink-2">Combined</span>
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[34px] py-7">
        <div className="mx-auto flex max-w-[720px] flex-col gap-[22px]">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      <ChatInput
        draft={draft}
        suggestions={SUGGESTIONS}
        onDraftChange={setDraft}
        onSend={() => send(draft)}
        onSuggestion={send}
      />
    </div>
  )
}
