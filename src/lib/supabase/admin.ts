import { createClient } from '@supabase/supabase-js'
import { assertSupabaseEnvironment } from '@/lib/env/deployment'

export function createAdminClient() {
  // Garde : hors production, le projet Supabase de production est refusé.
  assertSupabaseEnvironment({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keys: [process.env.SUPABASE_SERVICE_ROLE_KEY],
  })
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
