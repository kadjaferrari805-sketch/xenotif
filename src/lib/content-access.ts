import type { Access } from './access'

// Services réservés à PRO (les disciplines/vidéos sont gérées par leur min_plan en base).
export const PRO_ONLY_SERVICES = ['coach', 'smartwatch'] as const

// PRO/admin : tous les services. Free : tout sauf les services PRO-only. Guest : rien.
export function canUseService(access: Access, key: string): boolean {
  if (access.isPro) return true
  if (access.role !== 'free') return false
  return !(PRO_ONLY_SERVICES as readonly string[]).includes(key)
}
