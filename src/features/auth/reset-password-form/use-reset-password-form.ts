'use client'

import type { ResetPasswordFormValues } from './reset-password-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createBrowserClient } from '@/lib/supabase/browser-client'
import { resetPasswordFormSchema } from './reset-password-form.schema'

export const useResetPasswordForm = () => {
  const [isSent, setIsSent] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = createBrowserClient()
    // Link lands on /auth/callback, which sets a session then forwards to the
    // set-new-password screen. Always show success (no account enumeration).
    await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password/update`,
    })
    setIsSent(true)
  })

  return { form, onSubmit, isSent, isSubmitting: form.formState.isSubmitting }
}
