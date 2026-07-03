'use client'

import Link from 'next/link'
import { routes } from '@/constants/routes'
import { GoogleButton } from '@/features/auth/components/google-button'
import { cn } from '@/utils/cn'
import { useLoginForm } from './use-login-form'

const inputClass = (hasError: boolean) =>
  cn(
    'w-full rounded-[10px] border bg-surface px-[13px] py-3 text-[13.5px] text-ink outline-none transition-shadow',
    'focus:border-pulse focus:shadow-[0_0_0_3px_rgba(0,94,164,.12)]',
    { 'border-edge-strong': !hasError, 'border-danger': hasError },
  )

export const LoginForm = () => {
  const { form, onSubmit } = useLoginForm()
  const { errors } = form.formState

  return (
    <div className="w-full max-w-[368px]">
      <h1 className="mb-1.5 text-[26px] font-bold tracking-[-.5px]">Welcome back</h1>
      <p className="mb-7 text-[13.5px] text-ink-3">Log in to pick up where your attention left off.</p>

      <GoogleButton />

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

        <div className="mb-[7px] flex justify-between">
          <label htmlFor="password" className="text-xs font-medium text-ink-2">Password</label>
          <Link href={routes.resetPassword} className="text-xs text-pulse">Forgot?</Link>
        </div>
        <input
          id="password"
          type="password"
          className={cn(inputClass(!!errors.password), 'mb-6')}
          {...form.register('password')}
        />

        <button
          type="submit"
          className="w-full rounded-[10px] bg-pulse p-[13px] text-sm font-semibold text-white shadow-[0_6px_16px_rgba(0,94,164,.24)] transition-colors hover:bg-pulse-bright"
        >
          Log in
        </button>
      </form>

      <p className="mt-[22px] text-center text-[13px] text-ink-3">
        New here?
        {' '}
        <Link href={routes.signup} className="font-semibold text-pulse">Create an account</Link>
      </p>
    </div>
  )
}
