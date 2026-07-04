'use client'

import type { LoginFormValues } from './login-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { routes } from '@/constants/routes'
import { createBrowserClient } from '@/lib/supabase/browser-client'
import { loginFormSchema } from './login-form.schema'

export const useLoginForm = () => {
  const router = useRouter()
  const params = useSearchParams()
  // Surface a failed OAuth / email-link callback (redirected here with ?error).
  const [authError, setAuthError] = useState<string | null>(
    params.get('error') === 'auth' ? 'That sign-in link expired or was invalid. Please try again.' : null,
  )

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError(null)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithPassword(values)

    if (error) {
      setAuthError(error.message)
      return
    }

    // Login started from the extension → route into the consent/handoff screen.
    const destination = params.get('source') === 'extension'
      ? routes.connectExtension
      : routes.overview

    router.replace(destination)
    router.refresh()
  })

  return { form, onSubmit, authError, isSubmitting: form.formState.isSubmitting }
}
