'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PageContainer } from '@/components/page-container'
import { routes } from '@/constants/routes'

const TABS = [
  { label: 'Privacy', href: routes.settingsPrivacy },
  { label: 'Categories', href: routes.settingsCategories },
  { label: 'Notifications', href: routes.settingsNotifications },
  { label: 'Account', href: routes.settingsAccount },
]

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  return (
    <PageContainer size="default">
      <h1 className="mb-1 text-2xl font-semibold tracking-[-.4px]">Settings</h1>
      <p className="mb-[22px] text-[13.5px] text-ink-2">Privacy, categories, notifications and your account.</p>

      <div className="mb-[26px] flex gap-1 border-b border-hairline">
        {TABS.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative px-3.5 py-[11px] text-[13.5px]"
            >
              <span className={active ? 'font-semibold text-ink' : 'text-ink-2'}>{tab.label}</span>
              {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-[2px] bg-pulse" />}
            </Link>
          )
        })}
      </div>

      {children}
    </PageContainer>
  )
}

export default SettingsLayout
