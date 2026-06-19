// Séquence d'onboarding des nouveaux comptes en essai gratuit 7 jours.
// 3 emails calés sur l'essai : J+1 (prise en main), J+3 (tirer le max),
// J+6 (l'essai se termine → passage PRO). Pure & testable.

export type OnboardingStep = 1 | 2 | 3

// Renvoie l'étape à envoyer pour un compte donné, ou null si rien à faire.
//   ageDays      : âge du compte en jours (depuis auth.users.created_at)
//   currentStep  : dernière étape déjà envoyée (0 = aucune), lue dans profiles.onboarding_step
// Fenêtres par jour : garantit un seul email à la fois et évite de « backfiller »
// d'anciens comptes au lancement (un compte de 5 j entre directement en étape 2).
export function nextOnboardingStep(ageDays: number, currentStep: number): OnboardingStep | null {
  if (ageDays >= 6 && ageDays < 8 && currentStep < 3) return 3
  if (ageDays >= 3 && ageDays < 6 && currentStep < 2) return 2
  if (ageDays >= 1 && ageDays < 3 && currentStep < 1) return 1
  return null
}

// Âge d'un compte en jours entiers révolus, à partir de sa date de création.
export function accountAgeDays(createdAt: string | Date, now: Date = new Date()): number {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt
  return Math.floor((now.getTime() - created.getTime()) / 86_400_000)
}
