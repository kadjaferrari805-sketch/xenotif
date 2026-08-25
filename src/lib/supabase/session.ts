import { cache } from 'react'
import { headers } from 'next/headers'
import { createClient } from './server'

// Mémoïsé par requête (React cache) : un seul aller-retour `auth.getUser()`
// même s'il est demandé depuis le layout, la page ET getAccess dans le même rendu.
//
// REPLI SUR UN JETON `Authorization: Bearer` — pour l'application mobile.
// Le site s'authentifie par cookie ; l'app native n'en a pas et envoie le
// jeton d'accès Supabase en en-tête. Sans ce repli, /api/coach répondait 401
// à chaque appel de l'app, quelle que soit l'URL configurée.
//
// Le cookie reste prioritaire : le repli ne s'applique que s'il n'y a aucune
// session. Il n'affaiblit donc pas l'authentification existante, et ne crée
// pas de surface CSRF — un navigateur n'envoie jamais cet en-tête tout seul,
// contrairement aux cookies.
//
// Pas d'incidence sur le rendu statique : `createClient()` appelle déjà
// `cookies()`, qui rend la requête dynamique de toute façon.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user

  const authHeader = (await headers()).get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) return null

  // `getUser(token)` valide le jeton auprès de Supabase — on ne se contente
  // jamais de le décoder côté serveur.
  const { data: { user: bearerUser } } = await supabase.auth.getUser(token)
  return bearerUser ?? null
})

// Nom complet du profil, mémoïsé par requête (partagé layout ↔ page).
export const getProfileName = cache(async (): Promise<string | null> => {
  const user = await getCurrentUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()
  return data?.full_name ?? null
})
