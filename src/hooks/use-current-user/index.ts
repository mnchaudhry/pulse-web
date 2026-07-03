'use client'

import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// Current Supabase user for client components (sidebar, account). Stays in sync
// via onAuthStateChange so logout/login reflect immediately.
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setIsLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
