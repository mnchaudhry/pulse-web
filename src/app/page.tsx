import { redirect } from 'next/navigation'

// TODO: read session — redirect to /overview when authed, /login otherwise
const RootPage = () => {
  redirect('/overview')
}

export default RootPage
