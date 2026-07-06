'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { routes } from '@/constants/routes'
import { clearBotChatStorage } from '@/features/bot-chat/bot-chat-storage'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// P2.1: profile identity + actions, out of the sidebar footer and into the
// top bar (same interaction pattern as the extension's profile menu).
export const ProfileMenu = () => {
  const router = useRouter()
  const { user } = useCurrentUser()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const email = user?.email ?? ''
  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? (email ? email.split('@')[0] : 'Account')
  const initial = (displayName || 'A').charAt(0).toUpperCase()

  const signOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    clearBotChatStorage()
    router.replace(routes.login)
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface py-0.5 pl-0.5 pr-2 transition-colors hover:border-edge-strong"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d5e3fc,#b9c7df)] text-xs font-semibold text-[#5B6B87]">
          {initial}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2.4">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1.5 w-[220px] overflow-hidden rounded-[10px] border border-edge bg-surface shadow-[0_12px_32px_rgba(15,23,42,.12)]"
        >
          <div className="border-b border-hairline px-3.5 py-3">
            <div className="truncate text-[12.5px] font-medium text-ink">{displayName}</div>
            <div className="truncate text-[11px] text-ink-3">{email || 'Not signed in'}</div>
          </div>

          <Link
            href={routes.settingsAccount}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[12.5px] text-ink-2 transition-colors hover:bg-tint hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="3" />
              <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 2h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1c.6.5 1.3.9 2 1.2L10 22h4l.5-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
            </svg>
            Account settings
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 border-t border-hairline px-3.5 py-2.5 text-left text-[12.5px] text-ink-3 transition-colors hover:bg-tint hover:text-danger"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
