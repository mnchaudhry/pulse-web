import { cn } from '@/utils/cn'

export interface Citation {
  k: string
  v: string
}

export interface ChatMessageData {
  id: string
  role: 'user' | 'bot'
  text: string
  cites?: Citation[]
}

export const ChatMessage = ({ message }: { message: ChatMessageData }) => {
  const isBot = message.role === 'bot'

  return (
    <div className={cn('flex items-start gap-3', !isBot && 'flex-row-reverse')}>
      {isBot && (
        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-[8px] border border-edge bg-brand-tint">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#005ea4" strokeWidth="1.8">
            <rect x="4" y="8" width="16" height="11" rx="3" />
            <path d="M12 8V5M9 13h.01M15 13h.01M9.5 16.5h5" />
          </svg>
        </div>
      )}

      <div
        className={cn(
          isBot
            ? 'flex-1 rounded-[4px_14px_14px_14px] border border-edge bg-surface px-4 py-3.5'
            : 'max-w-[78%] rounded-[14px_4px_14px_14px] border border-edge-strong bg-brand-tint px-[15px] py-3',
        )}
      >
        <p className="text-sm leading-[1.6]">{message.text}</p>

        {isBot && message.cites && message.cites.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-[7px] border-t border-edge pt-3">
            {message.cites.map(cite => (
              <span
                key={cite.k}
                className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-chip px-2 py-1 text-[11px] text-ink-3"
              >
                <span>{cite.k}</span>
                <span className="mono text-ink-2">{cite.v}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
