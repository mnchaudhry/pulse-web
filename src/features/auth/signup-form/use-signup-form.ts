'use client'

import type { SignupFormValues } from './signup-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { signupFormSchema } from './signup-form.schema'

export const useSignupForm = () => {
  // US-62: browser timezone captured at creation, editable later in settings
  const [timezone, setTimezone] = useState('')
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async (_values) => {
    // TODO (US-01): supabase.auth.signUp with { timezone } in user metadata,
    // then redirect to /overview — or /connect-extension when ?source=extension
  })

  return { form, onSubmit, timezone }
}
