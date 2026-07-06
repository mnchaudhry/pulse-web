import { describe, expect, it } from 'vitest'
import { normalizePageUrl } from './normalize-page-url'

describe('normalizePageUrl', () => {
  it('strips utm_* params but keeps meaningful ones like YouTube\'s v= (spec §6.4/decision #14)', () => {
    const direct = normalizePageUrl('https://youtube.com/watch?v=abc123')
    const fromEmail = normalizePageUrl('https://youtube.com/watch?v=abc123&utm_source=newsletter&utm_medium=email')

    expect(direct).toBe(fromEmail)
    expect(direct).toContain('v=abc123')
  })

  it('strips known click-id tracking params', () => {
    expect(normalizePageUrl('https://example.com/post?fbclid=xyz')).toBe('https://example.com/post')
    expect(normalizePageUrl('https://example.com/post?gclid=xyz')).toBe('https://example.com/post')
  })

  it('leaves non-tracking params untouched', () => {
    expect(normalizePageUrl('https://github.com/pulls?q=is%3Aopen')).toBe('https://github.com/pulls?q=is%3Aopen')
  })

  it('preserves the hash fragment (e.g. hash-routed SPA pages)', () => {
    expect(normalizePageUrl('https://app.example.com/#/settings?utm_source=x')).toBe('https://app.example.com/#/settings?utm_source=x')
    // note: params after a `#` are part of the fragment, not the query string,
    // so they are intentionally left alone — only real query params are stripped
  })

  it('returns the input unchanged for a malformed URL', () => {
    expect(normalizePageUrl('not a url')).toBe('not a url')
  })
})
