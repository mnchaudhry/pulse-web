// US-65: permanent account deletion. Verifies the caller's JWT, then deletes the
// auth user with service-role privileges — the FK cascade from auth.users removes
// every device/event/aggregate/insight. Runs in the Supabase function runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader)
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user)
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS })

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError)
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500, headers: CORS })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...CORS, 'content-type': 'application/json' },
  })
})
