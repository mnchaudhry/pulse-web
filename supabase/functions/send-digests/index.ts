// US-48: email digests via Resend. Invoke with ?type=daily (each morning) or
// ?type=weekly (Mondays). Sends to users who opted into the matching channel.
// Secrets (function runtime): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// RESEND_API_KEY, and PULSE_EMAIL_FROM (a verified Resend sender).
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM = Deno.env.get('PULSE_EMAIL_FROM') ?? 'Pulse <digest@pulse.app>'

const fmt = (seconds: number) => {
  const m = Math.round(seconds / 60)
  const h = Math.floor(m / 60)
  return h ? `${h}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`
}

const dayString = (d: Date) => d.toISOString().slice(0, 10)

const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  return res.ok
}

Deno.serve(async (req) => {
  const type = new URL(req.url).searchParams.get('type') === 'weekly' ? 'weekly' : 'daily'
  const prefColumn = type === 'weekly' ? 'notif_email_weekly' : 'notif_email_daily'

  const { data: users } = await supabase
    .from('users')
    .select('id, email')
    .eq(prefColumn, true)
    .not('email', 'is', null)

  const days = type === 'weekly' ? 7 : 1
  const from = new Date()
  from.setDate(from.getDate() - days)
  const fromDay = dayString(from)

  let sent = 0
  for (const user of (users ?? []) as any[]) {
    const { data: aggregates } = await supabase
      .from('daily_aggregates')
      .select('category, active_seconds')
      .eq('user_id', user.id)
      .gte('day', fromDay)

    const byCategory = new Map<string, number>()
    for (const a of aggregates ?? [])
      byCategory.set(a.category, (byCategory.get(a.category) ?? 0) + a.active_seconds)
    if (byCategory.size === 0)
      continue

    const total = [...byCategory.values()].reduce((x, y) => x + y, 0)
    const rows = [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([c, s]) => `<tr><td style="padding:4px 0">${c}</td><td style="padding:4px 0;text-align:right;font-variant-numeric:tabular-nums">${fmt(s)}</td></tr>`)
      .join('')

    const period = type === 'weekly' ? 'last week' : 'yesterday'
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:480px;color:#191c1e">
        <h2 style="font-weight:600">Your Pulse — ${period}</h2>
        <p style="color:#404752">You had <strong>${fmt(total)}</strong> of active time.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
        <p style="color:#717783;font-size:12px;margin-top:24px">A quiet mirror, not a scoreboard. Manage digests in Settings → Notifications.</p>
      </div>`

    if (await sendEmail(user.email, `Your Pulse — ${period}`, html))
      sent++
  }

  return new Response(JSON.stringify({ type, sent }), { headers: { 'content-type': 'application/json' } })
})
