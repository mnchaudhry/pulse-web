import { NextResponse } from 'next/server'

// TODO: extension ingest endpoint — validate against schemas/event.schema.ts,
// timestamp plausibility check (US-63), insert via Supabase server client
export const POST = async () => {
  return NextResponse.json({ error: 'not implemented' }, { status: 501 })
}
