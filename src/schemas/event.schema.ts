import { z } from 'zod'

// Contract for what the extension POSTs to /api/events.
// HAND-KEPT IDENTICAL in pulse-extension/src/schemas/event.schema.ts (tech-stack §5).
// activeSeconds is separate from ended-started because idle detection (US-14)
// pauses counting — wall-clock time overstates real attention.
export const eventSchema = z.object({
  url: z.string().url(),
  domain: z.string(),
  title: z.string(),
  referrerDomain: z.string().nullable(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime(),
  activeSeconds: z.number().int().nonnegative(),
})

export type ActivityEvent = z.infer<typeof eventSchema>

// Full ingest payload: identifies the device (clientId) and carries a batch.
export const ingestPayloadSchema = z.object({
  clientId: z.string().min(1),
  platform: z.string().optional(),
  events: z.array(eventSchema).min(1).max(500),
})

export type IngestPayload = z.infer<typeof ingestPayloadSchema>
