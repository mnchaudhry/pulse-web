import { z } from 'zod'

// TODO: add-domain form schema
export const excludeListSchema = z.object({
  domain: z.string().min(1),
})
