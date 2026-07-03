import { z } from 'zod'

export const resetPasswordFormSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
