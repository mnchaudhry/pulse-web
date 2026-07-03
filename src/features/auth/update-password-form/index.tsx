'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { routes } from '@/constants/routes'
import { createBrowserClient } from '@/lib/supabase/browser-client'
import { cn } from '@/utils/cn'
import type { UpdatePasswordFormValues } from './update-password-form.schema'
import { updatePasswordFormSchema } from './update-password-form.schema'

// US-06: user lands here from the reset email (session already established by
// /auth/callback); sets a new password via updateUser.
export const UpdatePasswordForm = () => {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: { password: '' },
  })
  const { errors, isSubmitting } = form.formState

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError(null)
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.updateUser({ password: values.password })
    if (error) {
      setAuthError(error.message)
      return
    }
    router.replace(routes.overview)
    router.refresh()
  })

  return (
    <div className="w-full max-w-[368px]">
      <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.5px]">Set a new password</h1>
      <p className="mb-7 text-[13.5px] text-ink-3">Choose a new password for your account.</p>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="password" className="mb-[7px] block text-xs font-medium text-ink-2">New password</label>
        <input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          className={cn(
            'w-full rounded-[10px] border bg-surface px-[13px] py-3 text-[13.5px] text-ink outline-none transition-shadow',
            'focus:border-pulse focus:shadow-[0_0_0_3px_rgba(0,94,164,.12)]',
            errors.password ? 'border-danger' : 'border-edge-strong',
          )}
          {...form.register('password')}
        />
        {errors.password && <p className="mt-2 text-[12.5px] text-danger">{errors.password.message}</p>}
        {authError && <p className="mt-2 text-[12.5px] text-danger">{authError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-[10px] bg-pulse p-[13px] text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,94,164,.24)] transition-colors hover:bg-pulse-bright disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </div>
  )
}
