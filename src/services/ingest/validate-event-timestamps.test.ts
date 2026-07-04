import type { ActivityEvent } from '@/schemas/event.schema'
import { describe, expect, it } from 'vitest'
import { isPlausibleEvent } from './validate-event-timestamps'

const NOW = Date.parse('2026-07-02T12:00:00.000Z')

const event = (over: Partial<ActivityEvent>): ActivityEvent => ({
  url: 'https://example.com',
  domain: 'example.com',
  title: '',
  referrerDomain: null,
  activeSeconds: 60,
  startedAt: '2026-07-02T11:00:00.000Z',
  endedAt: '2026-07-02T11:10:00.000Z',
  ...over,
})

describe('isPlausibleEvent', () => {
  it('accepts a normal recent event', () => {
    expect(isPlausibleEvent(event({}), NOW)).toBe(true)
  })

  it('rejects ended-before-started', () => {
    expect(isPlausibleEvent(event({ startedAt: '2026-07-02T11:10:00.000Z', endedAt: '2026-07-02T11:00:00.000Z' }), NOW)).toBe(false)
  })

  it('rejects far-future starts (clock skew)', () => {
    expect(isPlausibleEvent(event({ startedAt: '2026-07-02T13:00:00.000Z', endedAt: '2026-07-02T13:10:00.000Z' }), NOW)).toBe(false)
  })

  it('rejects events older than retention', () => {
    expect(isPlausibleEvent(event({ startedAt: '2026-01-01T00:00:00.000Z', endedAt: '2026-01-01T00:10:00.000Z' }), NOW)).toBe(false)
  })

  it('rejects invalid timestamps', () => {
    expect(isPlausibleEvent(event({ startedAt: 'nope', endedAt: 'nope' }), NOW)).toBe(false)
  })
})
