import { describe, expect, it } from 'vitest'
import { formatDuration, formatDurationFromMinutes } from './format-duration'

describe('formatDurationFromMinutes', () => {
  it('renders minutes under an hour', () => {
    expect(formatDurationFromMinutes(0)).toBe('0m')
    expect(formatDurationFromMinutes(54)).toBe('54m')
  })

  it('renders hours with zero-padded minutes', () => {
    expect(formatDurationFromMinutes(60)).toBe('1h 00m')
    expect(formatDurationFromMinutes(128)).toBe('2h 08m')
  })
})

describe('formatDuration', () => {
  it('converts seconds to the minute-rounded label', () => {
    expect(formatDuration(90)).toBe('2m')
    expect(formatDuration(3600)).toBe('1h 00m')
  })
})
