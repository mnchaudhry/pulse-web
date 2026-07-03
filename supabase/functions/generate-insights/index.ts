// Proactive insights (US-45/46/51): per user, detect a week-over-week category
// anomaly and today's longest focus block, and write them to `insights`.
// Schedule daily. Runs with the service-role key from the function runtime.
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const fmt = (seconds: number) => {
  const m = Math.round(seconds / 60)
  const h = Math.floor(m / 60)
  return h ? `${h}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`
}

interface Ev { user_id: string, device_id: string, category: string, domain: string, active_seconds: number, started_at: string, ended_at: string }

Deno.serve(async () => {
  const now = Date.now()
  const since = new Date(now - 14 * 86_400_000).toISOString()
  const { data, error } = await supabase
    .from('raw_events')
    .select('user_id, device_id, category, domain, active_seconds, started_at, ended_at')
    .gte('started_at', since)

  if (error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const events = (data ?? []) as Ev[]
  const byUser = new Map<string, Ev[]>()
  for (const e of events)
    byUser.set(e.user_id, [...(byUser.get(e.user_id) ?? []), e])

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const weekAgo = now - 7 * 86_400_000
  const twoWeeksAgo = now - 14 * 86_400_000

  const insights: any[] = []

  for (const [userId, rows] of byUser) {
    // --- week-over-week category anomaly ---
    const thisWeek = new Map<string, number>()
    const lastWeek = new Map<string, number>()
    for (const e of rows) {
      const t = new Date(e.started_at).getTime()
      const target = t >= weekAgo ? thisWeek : t >= twoWeeksAgo ? lastWeek : null
      if (target)
        target.set(e.category, (target.get(e.category) ?? 0) + e.active_seconds)
    }

    let topDelta: { category: string, cur: number, prev: number, pct: number } | null = null
    for (const [category, cur] of thisWeek) {
      const prev = lastWeek.get(category) ?? 0
      if (prev < 600)
        continue // ignore noise under 10 min
      const pct = Math.round(((cur - prev) / prev) * 100)
      if (pct >= 40 && (!topDelta || pct > topDelta.pct))
        topDelta = { category, cur, prev, pct }
    }
    if (topDelta) {
      insights.push({
        user_id: userId,
        kind: 'anomaly',
        title: `${topDelta.category} is up sharply this week`,
        body: `${fmt(topDelta.cur)} on ${topDelta.category} this week, up from ${fmt(topDelta.prev)} last week — a notable increase worth a glance.`,
        payload: [
          { k: 'this week', v: fmt(topDelta.cur) },
          { k: 'last week', v: fmt(topDelta.prev) },
          { k: 'change', v: `+${topDelta.pct}%` },
        ],
      })
    }

    // --- today's longest focus block ---
    const todays = rows.filter(e => new Date(e.started_at) >= startOfToday)
    const longest = todays.sort((a, b) => b.active_seconds - a.active_seconds)[0]
    if (longest && longest.active_seconds >= 1200) {
      const s = new Date(longest.started_at)
      const en = new Date(longest.ended_at)
      const hhmm = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
      insights.push({
        user_id: userId,
        kind: 'focus',
        title: 'Longest focus block today',
        body: `${hhmm(s)} – ${hhmm(en)} on ${longest.domain} — ${fmt(longest.active_seconds)} of focused time.`,
        payload: [
          { k: 'duration', v: fmt(longest.active_seconds) },
          { k: 'domain', v: longest.domain },
        ],
      })
    }

    // --- per-device insight (US-51): busiest device today, if >1 device ---
    const perDevice = new Map<string, Ev[]>()
    for (const e of todays) {
      if (!e.device_id)
        continue
      perDevice.set(e.device_id, [...(perDevice.get(e.device_id) ?? []), e])
    }
    if (perDevice.size >= 2) {
      const totals = [...perDevice.entries()]
        .map(([deviceId, evs]) => ({ deviceId, evs, total: evs.reduce((a, e) => a + e.active_seconds, 0) }))
        .sort((a, b) => b.total - a.total)
      const busiest = totals[0]
      if (busiest && busiest.total >= 1200) {
        const byDomain = new Map<string, number>()
        for (const e of busiest.evs)
          byDomain.set(e.domain, (byDomain.get(e.domain) ?? 0) + e.active_seconds)
        const [domain, sec] = [...byDomain.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['', 0]
        insights.push({
          user_id: userId,
          device_id: busiest.deviceId,
          kind: 'device',
          title: 'Most active device today',
          body: `This device logged ${fmt(busiest.total)} today${domain ? `, led by ${domain} (${fmt(sec)})` : ''} — clearer as a per-device figure than blended.`,
          payload: [
            { k: 'device time', v: fmt(busiest.total) },
            ...(domain ? [{ k: 'top domain', v: domain }] : []),
          ],
        })
      }
    }
  }

  if (insights.length) {
    const { error: insertError } = await supabase.from('insights').insert(insights)
    if (insertError)
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ generated: insights.length }), {
    headers: { 'content-type': 'application/json' },
  })
})
