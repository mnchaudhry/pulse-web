import type { KeyboardEvent } from 'react'

interface ChatInputProps {
  draft: string
  suggestions: string[]
  onDraftChange: (value: string) => void
  onSend: () => void
  onSuggestion: (value: string) => void
}

export const ChatInput = ({ draft, suggestions, onDraftChange, onSend, onSuggestion }: ChatInputProps) => {
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t border-hairline px-[34px] pb-6 pt-4">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestion(suggestion)}
              className="rounded-[20px] border border-edge bg-surface px-[13px] py-1.5 text-xs text-ink-2 transition-colors hover:border-pulse-soft hover:text-ink"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2.5 rounded-[14px] border border-edge bg-surface py-2 pl-4 pr-2 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
          <textarea
            value={draft}
            onChange={event => onDraftChange(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about your own browsing data…"
            className="max-h-[120px] flex-1 resize-none border-none bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-3"
          />
          <button
            type="button"
            onClick={onSend}
            className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-pulse text-white transition-colors hover:bg-pulse-bright"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <p className="mt-2.5 text-center text-[11px] text-ink-3">
          Answers cite the aggregates behind them. The bot can’t see page content, raw history, or anything excluded.
        </p>
      </div>
    </div>
  )
}
