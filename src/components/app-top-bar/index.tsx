'use client'

import type { RangeKey } from '@/utils/date-range'
import { usePathname } from 'next/navigation'
import { DeviceScopeSelector } from '@/components/device-scope-selector'
import { ProfileMenu } from '@/components/profile-menu'
import { routes } from '@/constants/routes'
import { useDeviceFilter } from '@/features/device-filter/use-device-filter'
import { useRangeParam } from '@/hooks/use-dashboard-params'
import { useSidebarDrawerStore } from '@/stores/sidebar-drawer-store'
import { cn } from '@/utils/cn'

const RANGES: RangeKey[] = ['Today', 'Week', 'Month']

// P2.1/P2.2: persistent top bar — page-contextual scope controls on the
// right, always ending in ProfileMenu; a mobile hamburger on the left opens
// the off-canvas sidebar below `lg`. Sidebar nav itself is unchanged.
export const AppTopBar = () => {
  const pathname = usePathname()
  const [range, setRange] = useRangeParam()
  const { devices, currentLabel } = useDeviceFilter()
  const drawerOpen = useSidebarDrawerStore(s => s.open)
  const toggleDrawer = useSidebarDrawerStore(s => s.toggle)

  const isOverview = pathname === routes.overview
  const isInsights = pathname === routes.insights
  const isBot = pathname === routes.bot

  return (
    <div className="flex h-[60px] flex-none items-center justify-between gap-3 border-b border-hairline px-[26px]">
      <button
        type="button"
        onClick={toggleDrawer}
        aria-label="Toggle navigation"
        aria-expanded={drawerOpen}
        className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-tint hover:text-ink lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex flex-1 items-center justify-end gap-2.5">
        {isOverview && (
          <>
            <div data-tour="range" className="flex rounded-[10px] border border-edge bg-surface p-[3px]">
              {RANGES.map((r) => {
                const active = r === range
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={cn(
                      'rounded-lg px-3.5 py-[7px] text-[12.5px] font-medium transition-colors',
                      active ? 'bg-pulse font-semibold text-white' : 'text-ink-2 hover:text-ink',
                    )}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
            <span data-tour="scope">
              <DeviceScopeSelector />
            </span>
          </>
        )}

        {isInsights && <DeviceScopeSelector />}

        {isBot && (
          <span className="text-xs text-ink-3">
            Scoped to
            {' '}
            <span
              className="mono text-ink-2"
              title={devices.length === 0 ? 'Connect a device to scope bot answers' : undefined}
            >
              {currentLabel}
            </span>
          </span>
        )}

        <ProfileMenu />
      </div>
    </div>
  )
}
