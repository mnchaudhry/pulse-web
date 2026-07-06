// Daily rollup: raw_events → daily_aggregates, then prune raw_events older than
// ~90 days (US-60). Schedule once/day (Supabase Dashboard → Database → Cron, or
// pg_cron). Runs with the service-role key injected into the function runtime.
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { splitAcrossDays } from '../_shared/day-length.ts'

const RETENTION_DAYS = 90
const DEFAULT_TIMEZONE = 'UTC'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async () => {
  // Aggregate the last 2 days so late-arriving events are captured.
  const since = new Date(Date.now() - 2 * 86_400_000)
  const { data: events, error } = await supabase
    .from('raw_events')
    .select('user_id, device_id, category, active_seconds, started_at')
    .gte('started_at', since.toISOString())

  if (error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const userIds = [...new Set((events ?? []).map((e: any) => e.user_id))]
  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, home_timezone').in('id', userIds)
    : { data: [] as any[] }
  const timezoneByUser = new Map((users ?? []).map((u: any) => [u.id, u.home_timezone || DEFAULT_TIMEZONE]))

  // key: user|device|day|category → seconds. `day` is the account's home-TZ
  // calendar day; a visit crossing home-TZ midnight is split proportionally
  // across both days (spec §11.7, decision #16) instead of landing 100% on
  // whichever UTC date it happened to start in.
  const buckets = new Map<string, { user_id: string, device_id: string, day: string, category: string, active_seconds: number }>()
  for (const e of events ?? [] as any[]) {
    const timezone = timezoneByUser.get(e.user_id) ?? DEFAULT_TIMEZONE
    const startedAtMs = new Date(e.started_at).getTime()
    for (const { day, seconds } of splitAcrossDays(startedAtMs, e.active_seconds, timezone)) {
      const key = `${e.user_id}|${e.device_id}|${day}|${e.category}`
      const existing = buckets.get(key)
      if (existing)
        existing.active_seconds += seconds
      else
        buckets.set(key, { user_id: e.user_id, device_id: e.device_id, day, category: e.category, active_seconds: seconds })
    }
  }

  const rows = [...buckets.values()]
  if (rows.length) {
    const { error: upsertError } = await supabase
      .from('daily_aggregates')
      .upsert(rows, { onConflict: 'user_id,device_id,day,category' })
    if (upsertError)
      return new Response(JSON.stringify({ error: upsertError.message }), { status: 500 })
  }

  // Prune raw events past retention (aggregates already hold the history).
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString()
  await supabase.from('raw_events').delete().lt('started_at', cutoff)

  return new Response(JSON.stringify({ aggregated: rows.length }), {
    headers: { 'content-type': 'application/json' },
  })
})
