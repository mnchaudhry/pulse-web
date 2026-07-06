// URL normalization for page-level drill-down grouping only (tracking-spec
// §6.4, decision #14) — never applied at capture, only when rolling visits
// up into page rows. Strips known tracking junk (utm_*, fbclid, ...) so the
// same page opened from an email vs a direct link doesn't fork into two
// rows; keeps every other param (e.g. YouTube's `v=`) since only known junk
// is stripped, not query strings in general.
const TRACKING_PARAM_PREFIXES = ['utm_']
const TRACKING_PARAM_NAMES = new Set([
  'fbclid',
  'gclid',
  'gclsrc',
  'msclkid',
  'mc_cid',
  'mc_eid',
  'igshid',
  'ref',
  'ref_src',
])

const isTrackingParam = (key: string): boolean => {
  const lower = key.toLowerCase()
  return TRACKING_PARAM_NAMES.has(lower) || TRACKING_PARAM_PREFIXES.some(prefix => lower.startsWith(prefix))
}

export const normalizePageUrl = (rawUrl: string): string => {
  let url: URL
  try {
    url = new URL(rawUrl)
  }
  catch {
    return rawUrl
  }

  for (const key of [...url.searchParams.keys()]) {
    if (isTrackingParam(key))
      url.searchParams.delete(key)
  }

  return `${url.origin}${url.pathname}${url.search}${url.hash}`
}
