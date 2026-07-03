import { z } from 'zod'

export const botMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

export type BotMessage = z.infer<typeof botMessageSchema>
