import { NextResponse } from 'next/server'
import { categoryMap } from '@/constants/category-map'
import { createTokenClient } from '@/lib/supabase/server-client'
import { ingestPayloadSchema } from '@/schemas/event.schema'
import { isPlausibleEvent } from '@/services/ingest/validate-event-timestamps'

// US-19/63: extension ingest. Authenticates the caller's token, validates the
// batch (Zod + timestamp plausibility), lazily registers the device (US-07/08),
// resolves categories (overrides win), and inserts as the user (RLS-scoped).
export const POST = async (request: Request) => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createTokenClient(authHeader.replace('Bearer ', ''))
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = ingestPayloadSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 })

  const { clientId, platform, label, events } = parsed.data

  // Resolve or register the device (idempotent on client_id).
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
      return NextResponse.json({ error: deviceError?.message ?? 'Device registration failed' }, { status: 500 })
    deviceId = created.id
  }
  else {
    await supabase
      .from('devices')
      .update({ last_synced_at: new Date().toISOString(), ...(platform ? { platform } : {}) })
      .eq('id', deviceId)
  }

  // Category resolution: account-level overrides beat the built-in map (US-34).
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
      category: overrideMap.get(e.domain) ?? categoryMap[e.domain] ?? 'Uncategorized',
      started_at: e.startedAt,
      ended_at: e.endedAt,
      active_seconds: e.activeSeconds,
    }))

  if (rows.length) {
    const { error } = await supabase.from('raw_events').insert(rows)
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: rows.length, dropped: events.length - rows.length, deviceId })
}
