import { nextOnboardingStep, accountAgeDays } from './onboarding'

describe('nextOnboardingStep', () => {
  it('renvoie null pour un compte trop récent (< 1 jour)', () => {
    expect(nextOnboardingStep(0, 0)).toBeNull()
    expect(nextOnboardingStep(0.5, 0)).toBeNull()
  })

  it('envoie l’étape 1 entre J+1 et J+3', () => {
    expect(nextOnboardingStep(1, 0)).toBe(1)
    expect(nextOnboardingStep(2, 0)).toBe(1)
  })

  it('envoie l’étape 2 entre J+3 et J+6', () => {
    expect(nextOnboardingStep(3, 1)).toBe(2)
    expect(nextOnboardingStep(5, 1)).toBe(2)
  })

  it('envoie l’étape 3 entre J+6 et J+8', () => {
    expect(nextOnboardingStep(6, 2)).toBe(3)
    expect(nextOnboardingStep(7, 2)).toBe(3)
  })

  it('ne renvoie rien après J+8 (trop tard)', () => {
    expect(nextOnboardingStep(8, 0)).toBeNull()
    expect(nextOnboardingStep(30, 2)).toBeNull()
  })

  it('ne renvoie pas une étape déjà envoyée (dédup)', () => {
    expect(nextOnboardingStep(2, 1)).toBeNull()
    expect(nextOnboardingStep(4, 2)).toBeNull()
    expect(nextOnboardingStep(7, 3)).toBeNull()
  })

  it('un compte de 5 j sans aucun email entre directement en étape 2 (pas de backfill)', () => {
    expect(nextOnboardingStep(5, 0)).toBe(2)
  })

  it('passe directement à l’étape 3 si l’étape 2 a été manquée (fenêtre J+6)', () => {
    expect(nextOnboardingStep(6, 1)).toBe(3)
  })
})

describe('accountAgeDays', () => {
  it('calcule l’âge en jours entiers révolus', () => {
    const now = new Date('2026-01-10T12:00:00Z')
    expect(accountAgeDays('2026-01-09T12:00:00Z', now)).toBe(1)
    expect(accountAgeDays('2026-01-04T12:00:00Z', now)).toBe(6)
    expect(accountAgeDays('2026-01-10T06:00:00Z', now)).toBe(0)
  })
})
