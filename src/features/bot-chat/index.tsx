'use client'

import { ChatInput } from './components/chat-input'
import { ChatMessage } from './components/chat-message'
import { useBotChat } from './use-bot-chat'

const SUGGESTIONS = [
  'Compare Dev this week vs last',
  'Top domains this month',
  'How much time on Social this week?',
]

export const BotChat = () => {
  const { messages, draft, setDraft, send, isSending } = useBotChat()

  return (
    <div className="mx-auto flex h-full w-full max-w-[1180px] flex-col">
      <div className="flex items-center gap-3 border-b border-hairline px-[34px] py-[22px]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005ea4" strokeWidth="1.7">
          <rect x="4" y="8" width="16" height="11" rx="3" />
          <path d="M12 8V5M9 3.5h6M9 13h.01M15 13h.01M9.5 16.5h5" />
        </svg>
        <div>
          <h1 className="text-[17px] font-semibold">Bot</h1>
          <p className="mt-0.5 text-xs text-ink-3">Read-only over your aggregates.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[34px] py-7">
        <div className="mx-auto flex max-w-[720px] flex-col gap-[22px]">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isSending && (
            <div className="mono px-1 text-[12px] text-ink-3">Pulse is reading your aggregates…</div>
          )}
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
