import { cache } from 'react'
import { createClient } from './server'

// Mémoïsé par requête (React cache) : un seul aller-retour `auth.getUser()`
// même s'il est demandé depuis le layout, la page ET getAccess dans le même rendu.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
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
