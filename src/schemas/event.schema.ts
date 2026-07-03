import { z } from 'zod'

// Contract for what the extension POSTs to /api/events — hand-kept identical in pulse-extension (tech-stack §5)
export const eventSchema = z.object({
  url: z.string().url(),
  domain: z.string(),
  title: z.string(),
  referrerDomain: z.string().nullable(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime(),
})

export type ActivityEvent = z.infer<typeof eventSchema>
