// Consentement RGPD / Google Consent Mode v2 (côté client).
// UE/EEE + UK + Suisse : tracking bridé par défaut tant que l'utilisateur n'a pas
// accepté. Hors de cette zone : tracking inchangé (consentement implicite).

export type Consent = 'granted' | 'denied'

// Clé localStorage du choix utilisateur.
export const CONSENT_KEY = 'xeno_consent'

// EEE (UE27 + IS/LI/NO) + Royaume-Uni + Suisse. Sert au paramètre `region` du
// Consent Mode (Google fait le matching par IP) ET à /api/geo (affichage bandeau).
export const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
] as const

type W = {
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

// Applique un choix : met à jour Google Consent Mode + Meta Pixel. Sur « granted »
// on (re)déclenche le PageView Meta qui était retenu (consent revoke) au chargement.
export function applyConsent(choice: Consent): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as W
  w.gtag?.('consent', 'update', {
    ad_storage: choice,
    analytics_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  })
  w.fbq?.('consent', choice === 'granted' ? 'grant' : 'revoke')
  if (choice === 'granted') w.fbq?.('track', 'PageView')
}

export function storeConsent(choice: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice)
  } catch {
    /* localStorage indisponible : on ignore */
  }
}

export function getStoredConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}
