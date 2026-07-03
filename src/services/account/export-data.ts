import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-66: download all of the user's data as a JSON file (client-side, RLS-scoped).
export const exportData = async () => {
  const supabase = createBrowserClient()

  const [events, aggregates, insights, devices, excludeRules, overrides] = await Promise.all([
    supabase.from('raw_events').select('*'),
    supabase.from('daily_aggregates').select('*'),
    supabase.from('insights').select('*'),
    supabase.from('devices').select('*'),
    supabase.from('exclude_rules').select('*'),
    supabase.from('category_overrides').select('*'),
  ])

  const payload = {
    exportedAt: new Date().toISOString(),
    raw_events: events.data ?? [],
    daily_aggregates: aggregates.data ?? [],
    insights: insights.data ?? [],
    devices: devices.data ?? [],
    exclude_rules: excludeRules.data ?? [],
    category_overrides: overrides.data ?? [],
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `pulse-export-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
