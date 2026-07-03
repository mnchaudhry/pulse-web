import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'
import { createServerClient } from '@/lib/supabase/server-client'

// Session → /overview, otherwise → /login (tech-stack §8.1 redirect-only root).
const RootPage = async () => {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  redirect(user ? routes.overview : routes.login)
}

export default RootPage
