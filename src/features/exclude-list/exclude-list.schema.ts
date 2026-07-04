import { z } from 'zod'

// Add-domain input contract for the exclude-list.
export const excludeListSchema = z.object({
  domain: z.string().min(1),
})
