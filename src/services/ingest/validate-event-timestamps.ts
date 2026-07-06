import type { ActivityEvent } from '@/schemas/event.schema'

// US-63/tracking-spec §11.1/§11.4: reject implausible events (clock skew,
// stale, sub-second) at ingest — never trust the client alone. Pure so
// /api/events can filter a batch and it stays unit-testable.
const MAX_FUTURE_SKEW_MS = 5 * 60_000
const RETENTION_MS = 90 * 86_400_000
export const MAX_VISIT_SECONDS = 24 * 60 * 60

export const isPlausibleEvent = (event: ActivityEvent, now: number = Date.now()): boolean => {
  const started = Date.parse(event.startedAt)
  const ended = Date.parse(event.endedAt)

  if (Number.isNaN(started) || Number.isNaN(ended) || ended < started)
    return false
  if (started > now + MAX_FUTURE_SKEW_MS)
    return false
  if (started < now - RETENTION_MS)
    return false
  // Sub-second visits are dropped, not clamped — they're noise, not signal.
  if (event.activeSeconds < 1)
    return false
  return true
}

// Clamp active_seconds to the wall-clock span of the visit and to a single
// day (spec §11.1, decision #15) — a server-side backstop independent of
// whatever the client reported, since active time can never exceed either.
export const sanitizeActiveSeconds = (event: ActivityEvent): number => {
  const started = Date.parse(event.startedAt)
  const ended = Date.parse(event.endedAt)
  const wallSpanSeconds = Math.max(0, Math.round((ended - started) / 1000))
  return Math.min(event.activeSeconds, wallSpanSeconds, MAX_VISIT_SECONDS)
}
