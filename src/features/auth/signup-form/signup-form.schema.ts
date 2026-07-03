import { z } from 'zod'

export const signupFormSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

export type SignupFormValues = z.infer<typeof signupFormSchema>
