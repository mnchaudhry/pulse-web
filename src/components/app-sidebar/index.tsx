'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { routes } from '@/constants/routes'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createBrowserClient } from '@/lib/supabase/browser-client'
import { cn } from '@/utils/cn'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  match: (pathname: string) => boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const icon = (paths: ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {paths}
  </svg>
)

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [
      {
        label: 'Overview',
        href: routes.overview,
        match: p => p === routes.overview,
        icon: icon(<>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </>),
      },
      {
        label: 'Insights',
        href: routes.insights,
        match: p => p === routes.insights,
        icon: icon(<>
          <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2V17h6v-1.5c0-.8.3-1.3 1-2A6 6 0 0 0 12 3Z" />
          <path d="M9.5 20h5" />
        </>),
      },
      {
        label: 'Bot',
        href: routes.bot,
        match: p => p === routes.bot,
        icon: icon(<>
          <rect x="4" y="8" width="16" height="11" rx="3" />
          <path d="M12 8V5M9 3.5h6M9 13h.01M15 13h.01M9.5 16.5h5" />
        </>),
      },
      {
        label: 'Devices',
        href: routes.devices,
        match: p => p === routes.devices,
        icon: icon(<>
          <rect x="2" y="4" width="14" height="10" rx="1.5" />
          <path d="M5 18h8" />
          <rect x="17" y="9" width="5" height="11" rx="1.5" />
        </>),
      },
      {
        label: 'Settings',
        href: routes.settingsPrivacy,
        match: p => p.startsWith('/settings'),
        icon: icon(<>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 2h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1c.6.5 1.3.9 2 1.2L10 22h4l.5-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
        </>),
      },
    ],
  },
]

export const AppSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useCurrentUser()

  const email = user?.email ?? ''
  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? (email ? email.split('@')[0] : 'Account')
  const initial = (displayName || 'A').charAt(0).toUpperCase()

  const signOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.replace(routes.login)
    router.refresh()
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[236px] flex-none flex-col gap-1 overflow-y-auto border-r border-hairline bg-surface px-3.5 py-[22px]">
      <div className="flex items-center gap-[11px] px-2 pb-5 pt-1">
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#e8f2fb" />
          <path d="M6 20h6.5l3-8 5 18 4-13 2.5 5H34" stroke="#005ea4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-[-.2px]">Pulse</span>
          <span className="mt-[3px] text-[10.5px] text-ink-3">Attention, honestly</span>
        </div>
      </div>

      {NAV_GROUPS.map(group => (
        <div key={group.label}>
          <div className="px-2 pb-1.5 pt-3.5 text-[10px] font-semibold uppercase tracking-[.12em] text-ink-3">
            {group.label}
          </div>
          {group.items.map((item) => {
            const active = item.match(pathname)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'group relative flex w-full items-center gap-[11px] rounded-[9px] px-2.5 py-[9px] text-[13.5px] transition-colors',
                  active ? 'text-ink' : 'text-ink-2 hover:bg-tint hover:text-ink',
                )}
              >
                {active && (
                  <>
                    <span className="absolute inset-0 rounded-[9px] bg-tint" />
                    <span className="absolute bottom-[7px] left-0 top-[7px] w-[3px] rounded-[3px] bg-pulse" />
                  </>
                )}
                <span className="relative flex h-4 w-4 flex-none items-center justify-center">{item.icon}</span>
                <span className="relative flex-1 text-left">{item.label}</span>
                {active && (
                  <span className="relative h-[5px] w-[5px] rounded-full bg-pulse shadow-[0_0_8px_#005ea4]" />
                )}
              </Link>
            )
          })}
        </div>
      ))}

      <div className="mt-auto flex items-center gap-2.5 border-t border-hairline px-2 pb-0.5 pt-3.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#d5e3fc,#b9c7df)] text-xs font-semibold text-[#5B6B87]">
          {initial}
        </div>
        <div className="min-w-0 leading-[1.3]">
          <div className="truncate text-[12.5px] font-medium">{displayName}</div>
          <div className="truncate text-[10.5px] text-ink-3">{email || 'Not signed in'}</div>
        </div>
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          className="ml-auto flex h-7 w-7 flex-none items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-tint hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
