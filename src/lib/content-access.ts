import type { Access } from './access'

// Règles d'accès au contenu (palier unique gratuit + PRO).
// Source = constantes pour l'instant ; sera rebranché sur la base lors de B2.
export const FREE_DISCIPLINE = 'musculation'
export const FREE_VIDEO_COUNT = 1
export const PRO_ONLY_SERVICES = ['coach', 'smartwatch'] as const

// PRO/admin : accès total. Free : tout sauf les services PRO-only. Guest : rien.
export function canUseService(access: Access, key: string): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return !(PRO_ONLY_SERVICES as readonly string[]).includes(key)
}

export function canAccessDiscipline(access: Access, slug: string): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return slug === FREE_DISCIPLINE
}

export function canAccessVideo(access: Access, slug: string, index: number): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return slug === FREE_DISCIPLINE && index < FREE_VIDEO_COUNT
}
