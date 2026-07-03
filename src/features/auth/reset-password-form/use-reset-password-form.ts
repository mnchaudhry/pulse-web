'use client'

import type { ResetPasswordFormValues } from './reset-password-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { resetPasswordFormSchema } from './reset-password-form.schema'

export const useResetPasswordForm = () => {
  const [isSent, setIsSent] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (_values) => {
    // TODO (US-06): supabase.auth.resetPasswordForEmail with redirect back to a
    // set-new-password screen
    setIsSent(true)
  })

  return { form, onSubmit, isSent }
}
