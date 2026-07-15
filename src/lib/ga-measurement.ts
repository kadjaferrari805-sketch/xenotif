// GA4 Measurement Protocol - envoi d'événements côté serveur.
// Sert à tracer le VRAI paiement d'abonnement (fin d'essai, via webhook Stripe,
// sans page visitée). Nécessite GA4_API_SECRET (GA4 → Admin → Flux de données →
// Protocole de mesure → créer un secret). Sans secret ou sans client_id, no-op.
const GA4_MEASUREMENT_ID = 'G-3H3JTM404V'

// Le _ga cookie a la forme "GA1.1.1234567890.1234567890" → client_id = les 2
// derniers segments ("1234567890.1234567890").
export function parseGaClientId(gaCookie: string | undefined | null): string {
  if (!gaCookie) return ''
  const parts = gaCookie.split('.')
  return parts.length >= 4 ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}` : ''
}

export async function sendGa4Purchase(params: {
  clientId: string
  transactionId: string
  value: number
  currency: string
  items?: { item_id: string; item_name: string }[]
}): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET
  if (!apiSecret || !params.clientId) return
  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: params.clientId,
          events: [
            {
              name: 'purchase',
              params: {
                transaction_id: params.transactionId,
                value: params.value,
                currency: params.currency,
                items: params.items ?? [],
              },
            },
          ],
        }),
      },
    )
  } catch (e) {
    console.error('[ga4-mp] purchase send failed:', e)
  }
}
