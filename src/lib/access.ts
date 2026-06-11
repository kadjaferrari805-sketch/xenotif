import { createClient, createServiceClient } from '@/lib/supabase/server'

export type Role = 'guest' | 'free' | 'pro' | 'admin'

export type Access = {
  role: Role
  isPro: boolean
  isAdmin: boolean
  status: string | null
  plan: string | null
  trialEnd: Date | null
  renewDate: Date | null
  cancelAtPeriodEnd: boolean
}

type SubRow = {
  plan: string | null
  status: string | null
  trial_end: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
} | null

const PRO_STATUSES = new Set(['active', 'trialing'])

// Déduction pure (testable sans I/O) du niveau d'accès.
export function deriveAccess(opts: {
  isAuthenticated: boolean
  isAdmin: boolean
  sub: SubRow
}): Access {
  const { isAuthenticated, isAdmin, sub } = opts
  const status = sub?.status ?? null
  // Plan unique : toute valeur héritée 'elite' est normalisée en 'pro'.
  const plan = sub?.plan ? (sub.plan === 'elite' ? 'pro' : sub.plan) : null
  const isProSub = !!status && PRO_STATUSES.has(status)

  let role: Role = 'guest'
  if (isAuthenticated) role = isAdmin ? 'admin' : isProSub ? 'pro' : 'free'

  return {
    role,
    isPro: isAdmin || isProSub,
    isAdmin,
    status,
    plan,
    trialEnd: sub?.trial_end ? new Date(sub.trial_end) : null,
    renewDate: sub?.current_period_end ? new Date(sub.current_period_end) : null,
    cancelAtPeriodEnd: !!sub?.cancel_at_period_end,
  }
}

// Source de vérité serveur : auth user + subscriptions (service-role) + admin_users.
export async function getAccess(): Promise<Access> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return deriveAccess({ isAuthenticated: false, isAdmin: false, sub: null })

  const service = await createServiceClient()
  const [{ data: sub }, { data: admin }] = await Promise.all([
    service
      .from('subscriptions')
      .select('plan,status,trial_end,current_period_end,cancel_at_period_end')
      .eq('user_id', user.id)
      .maybeSingle(),
    service.from('admin_users').select('id').eq('id', user.id).maybeSingle(),
  ])
  return deriveAccess({ isAuthenticated: true, isAdmin: !!admin, sub: sub as SubRow })
}

/**
 * Garde d'accès pour les route handlers API : renvoie l'`Access` si l'utilisateur
 * est PRO, sinon une réponse 403 à retourner directement.
 *
 * Usage attendu (narrow + early-return) :
 *   const gate = await requirePro()
 *   if (gate instanceof Response) return gate   // 403 → on sort
 *   // ici `gate` est un Access garanti PRO
 */
export async function requirePro(): Promise<Access | import('next/server').NextResponse> {
  // Import dynamique : `next/server` casse l'environnement jsdom de Jest
  // (« Request is not defined »). requirePro n'est appelé que depuis des route
  // handlers (runtime Node.js/Edge) où l'import est résolu normalement.
  const { NextResponse } = await import('next/server')
  const access = await getAccess()
  if (!access.isPro) {
    return NextResponse.json({ error: 'Réservé aux abonnés' }, { status: 403 })
  }
  return access
}
