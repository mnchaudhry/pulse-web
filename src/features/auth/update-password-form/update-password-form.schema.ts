import { z } from 'zod'

export const updatePasswordFormSchema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
})

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordFormSchema>
