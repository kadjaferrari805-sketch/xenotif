import { cache } from 'react'
import { createServiceClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/session'

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

// Essai gratuit (sans carte) accordé à tout nouveau compte tant qu'il n'a aucun
// abonnement : accès PRO complet pendant TRIAL_DAYS jours après la création.
export const TRIAL_DAYS = 7

export function appTrialEnd(accountCreatedAt: Date | null): Date | null {
  return accountCreatedAt ? new Date(accountCreatedAt.getTime() + TRIAL_DAYS * 86_400_000) : null
}

export function isInAppTrial(accountCreatedAt: Date | null, now: Date = new Date()): boolean {
  const end = appTrialEnd(accountCreatedAt)
  return !!end && now.getTime() < end.getTime()
}

// Déduction pure (testable sans I/O) du niveau d'accès.
export function deriveAccess(opts: {
  isAuthenticated: boolean
  isAdmin: boolean
  sub: SubRow
  accountCreatedAt?: Date | null
  now?: Date
}): Access {
  const { isAuthenticated, isAdmin, sub, accountCreatedAt = null, now = new Date() } = opts
  const status = sub?.status ?? null
  // Plan unique : toute valeur héritée 'elite' est normalisée en 'pro'.
  const plan = sub?.plan ? (sub.plan === 'elite' ? 'pro' : sub.plan) : null
  const isProSub = !!status && PRO_STATUSES.has(status)

  // Essai 7 jours : compte authentifié, non-admin, SANS aucun abonnement, créé il y
  // a moins de 7 jours → accès PRO complet (sans carte). Ensuite, retombe en free.
  const inTrial = isAuthenticated && !isAdmin && !sub && isInAppTrial(accountCreatedAt, now)
  const trialEndDate = inTrial ? appTrialEnd(accountCreatedAt) : null

  const isPro = isAdmin || isProSub || inTrial

  let role: Role = 'guest'
  if (isAuthenticated) role = isAdmin ? 'admin' : isPro ? 'pro' : 'free'

  return {
    role,
    isPro,
    isAdmin,
    status: status ?? (inTrial ? 'trialing' : null),
    plan: plan ?? (inTrial ? 'pro' : null),
    trialEnd: sub?.trial_end ? new Date(sub.trial_end) : trialEndDate,
    renewDate: sub?.current_period_end ? new Date(sub.current_period_end) : null,
    cancelAtPeriodEnd: !!sub?.cancel_at_period_end,
  }
}

// Source de vérité serveur : auth user + subscriptions (service-role) + admin_users.
// Mémoïsé par requête : plusieurs appels (page + requirePro…) → un seul fetch.
export const getAccess = cache(async (): Promise<Access> => {
  const user = await getCurrentUser()
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
  return deriveAccess({
    isAuthenticated: true,
    isAdmin: !!admin,
    sub: sub as SubRow,
    accountCreatedAt: user.created_at ? new Date(user.created_at) : null,
  })
})

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
