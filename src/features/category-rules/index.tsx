'use client'

import { useEffect, useRef, useState } from 'react'
import { ErrorState } from '@/components/error-state'
import { ListSkeleton } from '@/components/skeleton/list-skeleton'
import { CATEGORY_COLORS } from '@/constants/categories'
import { cn } from '@/utils/cn'
import { useCategoryRules } from './use-category-rules'

const ACCOUNT_SCOPE = 'account'

const CATEGORIES = Object.keys(CATEGORY_COLORS)
const colorFor = (category: string) =>
  (CATEGORY_COLORS as Record<string, string>)[category] ?? CATEGORY_COLORS.Uncategorized

const CategorySelect = ({ value, onChange }: { value: string, onChange: (category: string) => void }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (open)
      itemRefs.current[Math.max(0, CATEGORIES.indexOf(value))]?.focus()
  }, [open, value])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const moveFocus = (currentIndex: number, delta: number) => {
    const next = (currentIndex + delta + CATEGORIES.length) % CATEGORIES.length
    itemRefs.current[next]?.focus()
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-[8px] border border-edge bg-chip px-[11px] py-1.5 text-[12.5px] transition-colors hover:border-pulse-soft"
      >
        <span className="h-2 w-2 rounded-[3px]" style={{ background: colorFor(value) }} />
        {value}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2.4" className="ml-0.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div role="listbox" className="absolute left-0 z-20 mt-1 max-h-[240px] min-w-[170px] overflow-auto rounded-[10px] border border-edge bg-surface py-1 shadow-[0_12px_32px_rgba(15,23,42,.12)]">
          {CATEGORIES.map((category, i) => (
            <button
              key={category}
              ref={(el) => { itemRefs.current[i] = el }}
              type="button"
              role="option"
              aria-selected={category === value}
              onClick={() => {
                onChange(category)
                close()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  close()
                }
                else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  moveFocus(i, 1)
                }
                else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  moveFocus(i, -1)
                }
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] transition-colors hover:bg-tint focus:bg-tint focus:outline-none',
                category === value ? 'text-ink' : 'text-ink-2',
              )}
            >
              <span className="h-2 w-2 rounded-[3px]" style={{ background: colorFor(category) }} />
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const CategoryRules = () => {
  const [scope, setScope] = useState(ACCOUNT_SCOPE)
  const [search, setSearch] = useState('')
  const { rulesQuery, devices, override } = useCategoryRules(scope === ACCOUNT_SCOPE ? null : scope)
  const rules = rulesQuery.data ?? []
  const visibleRules = search.trim()
    ? rules.filter(rule => rule.domain.toLowerCase().includes(search.trim().toLowerCase()))
    : rules

  return (
    <>
      <div className="mb-4 rounded-[10px] border border-edge bg-chip px-4 py-3 text-[12.5px] leading-normal text-ink-2">
        Account overrides apply everywhere. Per-device overrides only affect that device. Changes apply to new activity from now on.
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span className="text-[12.5px] text-ink-2">Scope</span>
        <select
          value={scope}
          onChange={e => setScope(e.target.value)}
          className="rounded-[9px] border border-edge bg-chip px-3 py-2 text-[13px] text-ink outline-none focus:border-pulse"
        >
          <option value={ACCOUNT_SCOPE}>Account (all devices)</option>
          {devices.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search domains…"
          className="ml-auto w-[220px] rounded-[9px] border border-edge bg-chip px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-pulse"
        />
      </div>

      <div className="overflow-hidden rounded-[14px] border border-edge bg-surface shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <div className="flex border-b border-hairline px-5 py-[13px] text-[11px] font-semibold uppercase tracking-[.06em] text-ink-3">
          <span className="flex-1">Domain</span>
          <span className="w-[180px]">Category</span>
          <span className="w-20 text-right">Source</span>
        </div>

        {rulesQuery.isError && (
          <div className="p-5">
            <ErrorState message="Couldn’t load categories. Check your connection and try again." onRetry={() => rulesQuery.refetch()} />
          </div>
        )}

        {rulesQuery.isLoading && (
          <div className="px-5 py-4">
            <ListSkeleton rows={5} />
          </div>
        )}

        {!rulesQuery.isLoading && !rulesQuery.isError && rules.length === 0 && (
          <div className="px-5 py-8 text-center text-[13px] text-ink-3">
            No domains yet — categories appear once activity is tracked.
          </div>
        )}

        {!rulesQuery.isLoading && !rulesQuery.isError && rules.length > 0 && visibleRules.length === 0 && (
          <div className="px-5 py-8 text-center text-[13px] text-ink-3">
            No domains match “
            {search}
            ”.
          </div>
        )}

        {visibleRules.map(rule => (
          <div
            key={rule.domain}
            className="flex items-center border-b border-[#eceef0] px-5 py-[13px] transition-colors last:border-b-0 hover:bg-chip"
          >
            <span className="mono flex-1 text-[13.5px]">{rule.domain}</span>
            <div className="w-[180px]">
              <CategorySelect
                value={rule.category}
                onChange={category => override.mutate({ domain: rule.domain, category })}
              />
            </div>
            <span className="w-20 text-right text-[11px]">
              {rule.overridden
                ? <span className="text-pulse">override</span>
                : <span className="text-ink-3">built-in</span>}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-3">
        Your overrides always win over the built-in map, and apply to activity captured from now on.
      </p>
    </>
  )
}
