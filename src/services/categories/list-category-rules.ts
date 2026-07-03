import { createBrowserClient } from '@/lib/supabase/browser-client'

export interface CategoryRule {
  domain: string
  category: string
  overridden: boolean
}

// US-32: every domain seen (from raw_events) plus any override domains, with the
// resolved category and whether it comes from a user override (US-34).
export const listCategoryRules = async (): Promise<CategoryRule[]> => {
  const supabase = createBrowserClient()

  const [{ data: overrides }, { data: events }] = await Promise.all([
    supabase.from('category_overrides').select('domain, category').is('device_id', null),
    supabase.from('raw_events').select('domain, category').order('started_at', { ascending: false }).limit(3000),
  ])

  const overrideMap = new Map((overrides ?? []).map(o => [o.domain, o.category]))
  const domainCategory = new Map<string, string>()
  for (const e of events ?? []) {
    if (!domainCategory.has(e.domain))
      domainCategory.set(e.domain, e.category)
  }
  for (const [domain, category] of overrideMap) {
    if (!domainCategory.has(domain))
      domainCategory.set(domain, category)
  }

  return [...domainCategory.keys()]
    .map(domain => ({
      domain,
      category: overrideMap.get(domain) ?? domainCategory.get(domain)!,
      overridden: overrideMap.has(domain),
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain))
}
