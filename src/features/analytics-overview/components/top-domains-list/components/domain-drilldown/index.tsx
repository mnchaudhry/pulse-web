'use client'

import type { DomainSlice, PageSlice } from '../../../../types'
import Link from 'next/link'
import { useState } from 'react'
import { ErrorState } from '@/components/error-state'
import { ListSkeleton } from '@/components/skeleton/list-skeleton'
import { Modal } from '@/components/modal'
import { Toast } from '@/components/toast'
import { cn } from '@/utils/cn'

interface DomainDrilldownProps {
  domain: DomainSlice
  pages: PageSlice[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onClose: () => void
}

// Page-level breakdown within one domain (US-40, tracking-spec §6.4) — answers
// how long, what category, and which pages, without leaving Overview (P1.4).
export const DomainDrilldown = ({ domain, pages, isLoading, isError, onRetry, onClose }: DomainDrilldownProps) => {
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
  }

  return (
    <Modal onClose={onClose} ariaLabel={`${domain.name} details`}>
      <div className="mb-1 flex items-center gap-2.5 pr-8">
        <h2 className="text-[15px] font-semibold">{domain.name}</h2>
        <span
          className="rounded-[6px] px-2 py-0.5 text-[11px] font-medium"
          style={{ color: domain.color, background: `${domain.color}1a` }}
        >
          {domain.cat}
        </span>
      </div>
      <p className="mb-5 text-[12.5px] text-ink-2">
        <span className="mono text-ink">{domain.dur}</span>
        {' '}
        total in this range ·
        {' '}
        <Link href="/settings/categories" className="font-medium text-pulse hover:underline">
          Change category
        </Link>
      </p>

      {isError && <ErrorState message="Couldn’t load pages for this domain." onRetry={onRetry} />}

      {isLoading && <ListSkeleton rows={5} />}

      {!isLoading && !isError && pages.length === 0 && (
        <p className="py-6 text-center text-[13px] text-ink-3">No page-level detail for this range.</p>
      )}

      {!isLoading && !isError && pages.length > 0 && (
        <div className="flex flex-col gap-[11px]">
          {pages.map((page) => {
            const expanded = expandedUrl === page.url
            return (
              <div key={page.url} className="flex items-center gap-3">
                <div className="w-[260px] flex-none overflow-hidden">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px]">{page.title || page.url}</p>
                  <button
                    type="button"
                    onClick={() => setExpandedUrl(expanded ? null : page.url)}
                    title={expanded ? 'Collapse URL' : 'Expand URL'}
                    className={cn(
                      'mono block w-full text-left text-[11px] text-ink-3 transition-colors hover:text-ink-2',
                      expanded ? 'whitespace-normal break-all' : 'overflow-hidden text-ellipsis whitespace-nowrap',
                    )}
                  >
                    {page.url}
                  </button>
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded bg-raised">
                  <div className="h-full rounded bg-pulse" style={{ width: `${page.pct}%` }} />
                </div>
                <span className="mono w-[60px] flex-none text-right text-[12.5px] text-ink-2">{page.dur}</span>
                <button
                  type="button"
                  onClick={() => copyUrl(page.url)}
                  title="Copy URL"
                  aria-label="Copy URL"
                  className="flex-none text-ink-3 transition-colors hover:text-pulse"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {copied && <Toast message="URL copied." onDismiss={() => setCopied(false)} />}
    </Modal>
  )
}
