'use client'

import Link from 'next/link'
import { routes } from '@/constants/routes'
import { GoogleButton } from '@/features/auth/components/google-button'
import { cn } from '@/utils/cn'
import { useSignupForm } from './use-signup-form'

const inputClass = (hasError: boolean) =>
  cn(
    'w-full rounded-[10px] border bg-surface px-[13px] py-3 text-[13.5px] text-ink outline-none transition-shadow',
    'focus:border-pulse focus:shadow-[0_0_0_3px_rgba(0,94,164,.12)]',
    { 'border-edge-strong': !hasError, 'border-danger': hasError },
  )

export const SignupForm = () => {
  const { form, onSubmit, timezone, authError, needsConfirmation, isSubmitting } = useSignupForm()
  const { errors } = form.formState

  if (needsConfirmation) {
    return (
      <div className="w-full max-w-[368px] text-center">
        <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.5px]">Confirm your email</h1>
        <p className="mb-7 text-[13.5px] leading-[1.6] text-ink-3">
          We sent a confirmation link to your inbox. Click it to finish setting up your account.
        </p>
        <Link href={routes.login} className="text-[13px] font-semibold text-pulse">Back to log in</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[368px]">
      <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.5px]">Create your account</h1>
      <p className="mb-7 text-[13.5px] text-ink-3">Private by default. Just for you.</p>

      <GoogleButton onboard />

      <div className="mb-5 flex items-center gap-3 text-[11px] text-ink-3">
        <span className="h-px flex-1 bg-edge" />
        OR
        <span className="h-px flex-1 bg-edge" />
      </div>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email" className="mb-[7px] block text-xs font-medium text-ink-2">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={cn(inputClass(!!errors.email), 'mono mb-4')}
          {...form.register('email')}
        />

        <label htmlFor="password" className="mb-[7px] block text-xs font-medium text-ink-2">Password</label>
        <input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          className={cn(inputClass(!!errors.password), 'mb-4')}
          {...form.register('password')}
        />

        <div className="mb-6 flex items-center gap-[9px] rounded-[9px] border border-[#cfe0f5] bg-tint px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005ea4" strokeWidth="1.8" className="flex-none">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 2" />
          </svg>
          <span className="text-[11.5px] text-ink-2">
            Home timezone detected:
            {' '}
            <span className="mono font-semibold text-ink">{timezone || '…'}</span>
            {' '}
            — editable later.
          </span>
        </div>

        {authError && (
          <p className="mb-4 text-[12.5px] text-danger">{authError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[10px] bg-pulse p-[13px] text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,94,164,.24)] transition-colors hover:bg-pulse-bright disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-[18px] text-center text-[11.5px] leading-[1.5] text-ink-3">
        By continuing you agree to our
        {' '}
        <a className="text-pulse">Terms</a>
        {' '}
        and
        {' '}
        <Link href={routes.privacy} className="text-pulse">Privacy policy</Link>
        .
      </p>
      <p className="mt-3.5 text-center text-[13px] text-ink-3">
        Already have an account?
        {' '}
        <Link href={routes.login} className="font-semibold text-pulse">Log in</Link>
      </p>
    </div>
  )
}
