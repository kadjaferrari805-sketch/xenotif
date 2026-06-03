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

export function trackMeta(event: MetaEvent, params?: MetaParams): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { fbq?: (...args: unknown[]) => void }
  w.fbq?.('track', event, params)
}
