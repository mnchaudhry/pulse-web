import type { FunctionDeclaration } from '@google/genai'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'
import type { RangeKey } from '@/utils/date-range'
import { Type } from '@google/genai'
import { subDays } from 'date-fns'
import { formatDurationFromMinutes as fmt } from '@/utils/format-duration'
import { rangeStart } from '@/utils/date-range'

export interface ToolContext {
  supabase: SupabaseClient<Database>
  deviceId: string | 'combined'
}

export interface ToolOutcome {
  result: unknown
  citations: { k: string, v: string }[]
}

// US-56: read-only, aggregates-only tools. No tool can read page content, URLs
// beyond domain, or anything excluded — they only sum active_seconds.
export const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'get_time_by_category',
    description: 'Total active time per category over a range (Today, Week, or Month).',
    parameters: {
      type: Type.OBJECT,
      properties: { range: { type: Type.STRING, enum: ['Today', 'Week', 'Month'] } },
      required: ['range'],
    },
  },
  {
    name: 'get_top_domains',
    description: 'Top domains by active time over a range.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        range: { type: Type.STRING, enum: ['Today', 'Week', 'Month'] },
        limit: { type: Type.NUMBER },
      },
      required: ['range'],
    },
  },
  {
    name: 'compare_category_weeks',
    description: 'Compare a category\'s active time this week vs the previous week.',
    parameters: {
      type: Type.OBJECT,
      properties: { category: { type: Type.STRING } },
      required: ['category'],
    },
  },
]

const fetchEvents = async (ctx: ToolContext, from: Date) => {
  let query = ctx.supabase
    .from('raw_events')
    .select('domain, category, active_seconds, started_at')
    .gte('started_at', from.toISOString())
    .limit(20000)
  if (ctx.deviceId !== 'combined')
    query = query.eq('device_id', ctx.deviceId)
  const { data } = await query
  return data ?? []
}

const toMinutes = (seconds: number) => Math.round(seconds / 60)

export const executeTool = async (name: string, args: Record<string, unknown>, ctx: ToolContext): Promise<ToolOutcome> => {
  if (name === 'get_time_by_category') {
    const range = (args.range as RangeKey) ?? 'Week'
    const rows = await fetchEvents(ctx, rangeStart(range))
    const byCat = new Map<string, number>()
    for (const r of rows)
      byCat.set(r.category, (byCat.get(r.category) ?? 0) + r.active_seconds)
    const result = [...byCat.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, sec]) => ({ category, minutes: toMinutes(sec) }))
    return {
      result: { range, categories: result },
      citations: result.slice(0, 3).map(c => ({ k: `${c.category} · ${range.toLowerCase()}`, v: fmt(c.minutes) })),
    }
  }

  if (name === 'get_top_domains') {
    const range = (args.range as RangeKey) ?? 'Week'
    const limit = Math.min(Number(args.limit ?? 5), 15)
    const rows = await fetchEvents(ctx, rangeStart(range))
    const byDomain = new Map<string, number>()
    for (const r of rows)
      byDomain.set(r.domain, (byDomain.get(r.domain) ?? 0) + r.active_seconds)
    const result = [...byDomain.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([domain, sec]) => ({ domain, minutes: toMinutes(sec) }))
    return {
      result: { range, domains: result },
      citations: result.slice(0, 3).map(d => ({ k: d.domain, v: fmt(d.minutes) })),
    }
  }

  if (name === 'compare_category_weeks') {
    const category = String(args.category ?? '')
    const rows = await fetchEvents(ctx, subDays(new Date(), 14))
    const now = Date.now()
    const weekAgo = now - 7 * 86_400_000
    let current = 0
    let previous = 0
    for (const r of rows) {
      if (r.category.toLowerCase() !== category.toLowerCase())
        continue
      const t = new Date(r.started_at).getTime()
      if (t >= weekAgo)
        current += r.active_seconds
      else
        previous += r.active_seconds
    }
    const curMin = toMinutes(current)
    const prevMin = toMinutes(previous)
    const changePct = previous ? Math.round(((current - previous) / previous) * 100) : null
    return {
      result: { category, current_minutes: curMin, previous_minutes: prevMin, change_pct: changePct },
      citations: [
        { k: `${category} · this week`, v: fmt(curMin) },
        { k: 'last week', v: fmt(prevMin) },
      ],
    }
  }

  return { result: { error: `Unknown tool: ${name}` }, citations: [] }
}
