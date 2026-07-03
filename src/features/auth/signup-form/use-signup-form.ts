'use client'

import type { SignupFormValues } from './signup-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { routes } from '@/constants/routes'
import { createBrowserClient } from '@/lib/supabase/browser-client'
import { signupFormSchema } from './signup-form.schema'

// US-62: browser timezone captured at creation, editable later in settings.
// Read once at module load (client-only) to avoid a setState-in-effect.
const detectedTimezone
  = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'

export const useSignupForm = () => {
  const router = useRouter()
  const params = useSearchParams()
  const [authError, setAuthError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError(null)
    const supabase = createBrowserClient()
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { home_timezone: detectedTimezone } },
    })

    if (error) {
      setAuthError(error.message)
      return
    }

    // No session means email confirmation is on — tell the user to check inbox.
    if (!data.session) {
      setNeedsConfirmation(true)
      return
    }

    const destination = params.get('source') === 'extension'
      ? routes.connectExtension
      : routes.overview
    router.replace(destination)
    router.refresh()
  })

  return {
    form,
    onSubmit,
    timezone: detectedTimezone,
    authError,
    needsConfirmation,
    isSubmitting: form.formState.isSubmitting,
  }
}
