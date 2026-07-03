'use client'

import Link from 'next/link'
import { routes } from '@/constants/routes'
import { cn } from '@/utils/cn'
import { useResetPasswordForm } from './use-reset-password-form'

export const ResetPasswordForm = () => {
  const { form, onSubmit, isSent } = useResetPasswordForm()
  const { errors } = form.formState

  if (isSent) {
    return (
      <div className="w-full max-w-[368px] text-center">
        <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.5px]">Check your inbox</h1>
        <p className="mb-7 text-[13.5px] leading-[1.6] text-ink-3">
          If an account exists for that email, a reset link is on its way.
        </p>
        <Link href={routes.login} className="text-[13px] font-semibold text-pulse">Back to log in</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[368px]">
      <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.5px]">Reset your password</h1>
      <p className="mb-7 text-[13.5px] text-ink-3">We'll email you a link to set a new one.</p>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email" className="mb-[7px] block text-xs font-medium text-ink-2">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={cn(
            'mono mb-6 w-full rounded-[10px] border bg-surface px-[13px] py-3 text-[13.5px] text-ink outline-none transition-shadow',
            'focus:border-pulse focus:shadow-[0_0_0_3px_rgba(0,94,164,.12)]',
            { 'border-edge-strong': !errors.email, 'border-danger': !!errors.email },
          )}
          {...form.register('email')}
        />
        <button
          type="submit"
          className="w-full rounded-[10px] bg-pulse p-[13px] text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,94,164,.24)] transition-colors hover:bg-pulse-bright"
        >
          Send reset link
        </button>
      </form>

      <p className="mt-[22px] text-center text-[13px] text-ink-3">
        Remembered it?
        {' '}
        <Link href={routes.login} className="font-semibold text-pulse">Log in</Link>
      </p>
    </div>
  )
}
