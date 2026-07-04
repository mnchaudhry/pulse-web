'use client'

import { useSearchParams } from 'next/navigation'
import { routes } from '@/constants/routes'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-01: Google OAuth. Redirects through /auth/callback, which exchanges the
// code for a session and forwards to `next`. `onboard` (signup) and the
// extension handoff both route into the connect-extension onboarding modal.
export const GoogleButton = ({ onboard = false }: { onboard?: boolean }) => {
  const params = useSearchParams()

  const signIn = async () => {
    const toOnboarding = onboard || params.get('source') === 'extension'
    const next = toOnboarding ? routes.connectExtension : routes.overview
    const supabase = createBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
  }

  return (
    <button
      type="button"
      onClick={signIn}
      className="mb-[18px] flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-edge-strong bg-surface p-3 text-[13.5px] font-semibold shadow-[0_1px_2px_rgba(15,23,42,.04)] transition-colors hover:border-pulse-soft hover:bg-chip"
    >
      <svg width="17" height="17" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22 12c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6Z" />
        <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.5 0-4.7-1.7-5.5-4H3v2.6A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.8V7.6H3a10 10 0 0 0 0 8.8L6.5 14Z" />
        <path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3 7.6l3.5 2.6C7.3 7.5 9.5 5.8 12 5.8Z" />
      </svg>
      Continue with Google
    </button>
  )
}
