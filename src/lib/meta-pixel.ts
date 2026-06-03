// Helper d'événements Meta Pixel (côté client uniquement).
// N'a aucun effet si le pixel n'est pas chargé (ID non configuré, ou bloqueur).

type MetaParams = {
  value?: number
  currency?: string
  content_name?: string
  content_ids?: string[]
  content_type?: string
  [key: string]: unknown
}

// Événements standards Meta utilisés sur le site.
export type MetaEvent =
  | 'CompleteRegistration'
  | 'InitiateCheckout'
  | 'Subscribe'
  | 'Purchase'
  | 'Lead'
  | 'ViewContent'
  | 'AddToCart'

// eventId : identifiant partagé avec l'API Conversions (serveur) pour la
// déduplication Meta. On utilise l'ID de session Stripe sur les pages de succès.
export function trackMeta(event: MetaEvent, params?: MetaParams, eventId?: string): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { fbq?: (...args: unknown[]) => void }
  if (eventId) w.fbq?.('track', event, params, { eventID: eventId })
  else w.fbq?.('track', event, params)
}
