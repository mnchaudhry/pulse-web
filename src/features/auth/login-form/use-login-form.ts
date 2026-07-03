'use client'

import type { LoginFormValues } from './login-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginFormSchema } from './login-form.schema'

export const useLoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async (_values) => {
    // TODO (US-01): supabase.auth.signInWithPassword, then redirect to
    // /overview — or /connect-extension when ?source=extension
  })

  return { form, onSubmit }
}
