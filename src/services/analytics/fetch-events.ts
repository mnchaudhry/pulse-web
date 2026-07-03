import type { RawEventRow } from '@/lib/supabase/database.types'
import { createBrowserClient } from '@/lib/supabase/browser-client'

export interface EventQuery {
  from: Date
  deviceId: string | 'combined'
}

// Raw events since `from`, RLS-scoped to the signed-in user. `combined` spans
// every device; otherwise narrows to one (US-42/43).
export const fetchEventsInRange = async ({ from, deviceId }: EventQuery): Promise<RawEventRow[]> => {
  const supabase = createBrowserClient()
  let query = supabase
    .from('raw_events')
    .select('*')
    .gte('started_at', from.toISOString())
    .order('started_at', { ascending: false })
    .limit(20000)

  if (deviceId !== 'combined')
    query = query.eq('device_id', deviceId)

  const { data, error } = await query
  if (error)
    throw error
  return data ?? []
}
