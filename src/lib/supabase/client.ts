import { createBrowserClient } from '@supabase/ssr'
import { assertSupabaseEnvironment } from '@/lib/env/deployment'

export function createClient() {
  // Côté navigateur, l'environnement vient de NEXT_PUBLIC_VERCEL_ENV (injecté au build).
  assertSupabaseEnvironment({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keys: [process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  })
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
