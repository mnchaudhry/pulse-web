import { NextResponse } from 'next/server'
import { categoryMap } from '@/constants/category-map'
import { createTokenClient } from '@/lib/supabase/server-client'
import { ingestPayloadSchema } from '@/schemas/event.schema'
import { isPlausibleEvent, sanitizeActiveSeconds } from '@/services/ingest/validate-event-timestamps'

const corsHeaders = (origin: string | null): Record<string, string> => ({
  'Access-Control-Allow-Origin': origin ?? '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin',
})

// New Tab and chrome://* internals group under Browser (US-69, decisions #9/#10)
// unless the user has explicitly overridden that domain's category (US-34).
const isBrowserDestination = (domain: string): boolean =>
  domain === 'New Tab' || domain.startsWith('chrome://') || domain.startsWith('edge://')

const resolveCategory = (domain: string, overrides: Map<string, string>): string => {
  const override = overrides.get(domain)
  if (override)
    return override
  if (isBrowserDestination(domain))
    return 'Browser'
  return categoryMap[domain] ?? categoryMap[domain.split(':')[0]] ?? 'Uncategorized'
}

export const OPTIONS = (request: Request) =>
  new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) })

export const POST = async (request: Request) => {
  const cors = corsHeaders(request.headers.get('origin'))
  const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: cors })

  const authHeader = request.headers.get('Authorization')
  if (!authHeader)
    return json({ error: 'Unauthorized' }, 401)

  const supabase = createTokenClient(authHeader.replace('Bearer ', ''))
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    return json({ error: 'Unauthorized' }, 401)

  const body = await request.json().catch(() => null)
  const parsed = ingestPayloadSchema.safeParse(body)
  if (!parsed.success)
    return json({ error: 'Invalid payload', issues: parsed.error.issues }, 400)

  const { clientId, platform, label, events } = parsed.data

  const { data: existing } = await supabase
    .from('devices')
    .select('id')
    .eq('client_id', clientId)
    .maybeSingle()

  let deviceId = existing?.id
  if (!deviceId) {
    const { data: created, error: deviceError } = await supabase
      .from('devices')
      .insert({ user_id: user.id, client_id: clientId, label: label ?? platform ?? 'New device', platform })
      .select('id')
      .single()
    if (deviceError || !created)
      return json({ error: deviceError?.message ?? 'Device registration failed' }, 500)
    deviceId = created.id
  }
  else {
    await supabase
      .from('devices')
      .update({ last_synced_at: new Date().toISOString(), ...(platform ? { platform } : {}) })
      .eq('id', deviceId)
  }

  const { data: overrides } = await supabase
    .from('category_overrides')
    .select('domain, category')
    .is('device_id', null)
  const overrideMap = new Map((overrides ?? []).map(o => [o.domain, o.category]))

  const now = Date.now()
  const rows = events
    .filter(e => isPlausibleEvent(e, now))
    .map(e => ({
      user_id: user.id,
      device_id: deviceId,
      url: e.url,
      domain: e.domain,
      title: e.title,
      referrer_domain: e.referrerDomain,
      category: resolveCategory(e.domain, overrideMap),
      started_at: e.startedAt,
      ended_at: e.endedAt,
      active_seconds: sanitizeActiveSeconds(e),
    }))

  if (rows.length) {
    const { error } = await supabase.from('raw_events').insert(rows)
    if (error)
      return json({ error: error.message }, 500)
  }

  return json({ inserted: rows.length, dropped: events.length - rows.length, deviceId })
}
