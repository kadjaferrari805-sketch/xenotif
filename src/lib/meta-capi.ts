import crypto from 'crypto'

// API de Conversions Meta (CAPI) — envoi serveur-side des conversions.
// Complète le Pixel (client) : plus fiable (non bloqué par Safari/adblockers).
// La déduplication avec le Pixel se fait via un event_id partagé (on utilise
// l'ID de session Stripe, identique côté client et serveur).

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const CAPI_TOKEN = process.env.META_CAPI_TOKEN
const API_VERSION = 'v21.0'

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

type ConversionInput = {
  eventName: 'Subscribe' | 'Purchase' | 'CompleteRegistration'
  eventId: string                 // partagé avec le Pixel pour la déduplication
  email?: string | null
  value?: number
  currency?: string
  // Signaux de correspondance (Event Match Quality) — NON hachés (Meta les veut bruts).
  // Captés au checkout (cookies _fbp/_fbc + IP/UA) et relayés côté serveur.
  fbp?: string | null
  fbc?: string | null
  clientIpAddress?: string | null
  clientUserAgent?: string | null
}

// N'a aucun effet si le Pixel ID ou le token CAPI ne sont pas configurés.
// N'échoue jamais : les erreurs sont loguées mais ne bloquent pas l'appelant (webhook).
export async function sendMetaConversion(input: ConversionInput): Promise<void> {
  if (!PIXEL_ID || !CAPI_TOKEN) return
  try {
    const userData: Record<string, unknown> = {}
    if (input.email) userData.em = [sha256(input.email)]
    if (input.fbp) userData.fbp = input.fbp
    if (input.fbc) userData.fbc = input.fbc
    if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress
    if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent

    const body = {
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: 'website',
          user_data: userData,
          ...(input.value !== undefined
            ? { custom_data: { value: input.value, currency: input.currency ?? 'EUR' } }
            : {}),
        },
      ],
    }

    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    if (!res.ok) {
      console.error('Meta CAPI non-OK:', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.error('Meta CAPI error:', err)
  }
}
