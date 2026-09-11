import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { assertSupabaseEnvironment } from '@/lib/env/deployment'

export async function createClient() {
  const cookieStore = await cookies()
  // Garde : hors production, le projet Supabase de production est refusé.
  assertSupabaseEnvironment({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keys: [process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  })
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    },
  )
}

// Client « service_role » : contourne RLS pour les opérations serveur (lecture/écriture
// des tables protégées : reviews, subscriptions, boutique_orders…).
//
// ⚠️ On utilise le client supabase-js BRUT, SANS cookies. Si on passait les cookies
// (comme createServerClient de @supabase/ssr), le JWT de l'utilisateur connecté
// écraserait la clé service_role dans l'en-tête Authorization → les requêtes
// repasseraient sous RLS (écritures refusées avec « 42501 RLS policy »). Sans session,
// la clé service_role s'applique réellement et RLS est bien contourné.
export async function createServiceClient() {
  assertSupabaseEnvironment({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keys: [process.env.SUPABASE_SERVICE_ROLE_KEY],
  })
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
