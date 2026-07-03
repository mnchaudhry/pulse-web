import { createBrowserClient } from '@/lib/supabase/browser-client'

export interface CategoryRule {
  domain: string
  category: string
  overridden: boolean
}

// US-32/35: domains seen (+ override domains) with the category resolved for the
// selected scope. deviceId null = account scope; otherwise a device's view,
// where a device override beats the account override beats the built-in map.
export const listCategoryRules = async (deviceId: string | null = null): Promise<CategoryRule[]> => {
  const supabase = createBrowserClient()

  const deviceOverridesQuery = deviceId
    ? supabase.from('category_overrides').select('domain, category').eq('device_id', deviceId)
    : Promise.resolve({ data: [] as { domain: string, category: string }[] })

  const [{ data: accountOverrides }, { data: deviceOverrides }, { data: events }] = await Promise.all([
    supabase.from('category_overrides').select('domain, category').is('device_id', null),
    deviceOverridesQuery,
    supabase.from('raw_events').select('domain, category').order('started_at', { ascending: false }).limit(3000),
  ])

  const accountMap = new Map((accountOverrides ?? []).map(o => [o.domain, o.category]))
  const deviceMap = new Map((deviceOverrides ?? []).map(o => [o.domain, o.category]))

  const builtin = new Map<string, string>()
  for (const e of events ?? []) {
    if (!builtin.has(e.domain))
      builtin.set(e.domain, e.category)
  }
  for (const domain of accountMap.keys())
    if (!builtin.has(domain))
      builtin.set(domain, accountMap.get(domain)!)
  for (const domain of deviceMap.keys())
    if (!builtin.has(domain))
      builtin.set(domain, deviceMap.get(domain)!)

  return [...builtin.keys()]
    .map((domain) => {
      const scopedOverride = deviceId ? deviceMap.get(domain) : accountMap.get(domain)
      const resolved = deviceMap.get(domain) ?? accountMap.get(domain) ?? builtin.get(domain)!
      return { domain, category: resolved, overridden: !!scopedOverride }
    })
    .sort((a, b) => a.domain.localeCompare(b.domain))
}
