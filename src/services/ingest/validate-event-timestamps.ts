import type { ActivityEvent } from '@/schemas/event.schema'

// US-63: reject implausible timestamps (clock skew / stale). Pure so /api/events
// can filter a batch and it stays unit-testable.
const MAX_FUTURE_SKEW_MS = 5 * 60_000
const RETENTION_MS = 90 * 86_400_000

export const isPlausibleEvent = (event: ActivityEvent, now: number = Date.now()): boolean => {
  const started = Date.parse(event.startedAt)
  const ended = Date.parse(event.endedAt)

  if (Number.isNaN(started) || Number.isNaN(ended) || ended < started)
    return false
  if (started > now + MAX_FUTURE_SKEW_MS)
    return false
  if (started < now - RETENTION_MS)
    return false
  return true
}
