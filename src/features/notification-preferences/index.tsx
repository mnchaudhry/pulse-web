'use client'

import type { NotificationPrefs } from '@/services/account/update-notification-prefs'
import { cn } from '@/utils/cn'
import { useNotificationPreferences } from './use-notification-preferences'

const ROWS: { key: keyof NotificationPrefs, title: string, desc: string }[] = [
  { key: 'notif_chrome', title: 'Chrome notifications', desc: 'A once-a-day summary and flagged anomalies, delivered in the browser.' },
  { key: 'notif_email_daily', title: 'Daily email digest', desc: 'A short recap of yesterday, sent each morning.' },
  { key: 'notif_email_weekly', title: 'Weekly email digest', desc: 'A wider view of the week every Monday.' },
]

export const NotificationPreferences = () => {
  const { profileQuery, update } = useNotificationPreferences()
  const profile = profileQuery.data

  return (
    <div className="flex flex-col gap-3">
      {ROWS.map((row) => {
        const on = profile ? profile[row.key] : false
        return (
          <div
            key={row.key}
            className="flex items-center gap-4 rounded-[14px] border border-edge bg-surface px-5 py-[18px] shadow-[0_4px_16px_rgba(15,23,42,.05)]"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">{row.title}</div>
              <div className="mt-[3px] text-[12.5px] text-ink-2">{row.desc}</div>
            </div>
            <button
              type="button"
              disabled={!profile}
              onClick={() => update.mutate({ [row.key]: !on })}
              aria-pressed={on}
              className={cn(
                'relative h-[26px] w-[46px] flex-none rounded-[14px] border transition-colors disabled:opacity-50',
                on ? 'border-pulse bg-pulse' : 'border-edge-strong bg-[#e0e3e5]',
              )}
            >
              <span
                className={cn(
                  'absolute top-[3px] h-5 w-5 rounded-full transition-all',
                  on ? 'right-[3px] bg-white' : 'left-[3px] bg-ink-3',
                )}
              />
            </button>
          </div>
        )
      })}

      <p className="mt-2 text-xs text-ink-3">
        Insights are neutral observations, delivered on your terms — never interruptions you didn’t opt into.
      </p>
    </div>
  )
}
