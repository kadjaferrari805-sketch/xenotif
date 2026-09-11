import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getCurrentUser } from '@/lib/supabase/session'
import { createServiceClient } from '@/lib/supabase/server'
import { requirePro } from '@/lib/access'
import { asCoachLocale, COACH_DAILY_LIMIT, sanitizeCoachMessages, type CoachLocale } from '@/lib/coach/guard'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// La langue suit celle du site : l'ancienne consigne « toujours en français »
// répondait en français aux membres anglophones et germanophones.
const LANGUAGE_RULE: Record<CoachLocale, string> = {
  fr: 'Réponds toujours en français.',
  en: "Réponds toujours en anglais : le membre utilise Xenotif en anglais.",
  de: "Réponds toujours en allemand : le membre utilise Xenotif en allemand.",
}

function systemPrompt(locale: CoachLocale): string {
  return `Tu es le Coach IA de Xenotif®, un assistant sportif expert, motivant et bienveillant.
Tu aides les membres à atteindre leurs objectifs : perte de poids, prise de masse, endurance, performance.
Disciplines disponibles sur Xenotif : Running & Cardio, Musculation, HIIT, Cyclisme, Natation, CrossFit, Yoga, Boxe, Stretching, Nutrition.

Règles :
- ${LANGUAGE_RULE[locale]}
- Sois précis, concret, et actionnable.
- Adapte tes conseils au niveau de l'utilisateur (débutant → expérimenté).
- Propose des plans structurés (jours, séries, répétitions, durées) quand c'est pertinent.
- Reste motivant et positif, mais sans être excessif.
- Ne dépasse pas 400 mots par réponse (sauf si un plan détaillé est demandé).
- Ne donne pas de conseils médicaux ; renvoie vers un professionnel de santé si nécessaire.`
}

const QUOTA_REACHED: Record<CoachLocale, string> = {
  fr: 'Limite quotidienne du coach atteinte, reviens demain.',
  en: 'Daily coach limit reached, come back tomorrow.',
  de: 'Tageslimit des Coachs erreicht, komm morgen wieder.',
}

export async function POST(req: NextRequest) {
  // Passe par getCurrentUser plutôt que par un appel direct : c'est lui qui
  // porte le repli sur l'en-tête Authorization, sans lequel l'app mobile
  // recevait un 401 systématique. requirePro() en dépend déjà.
  const user = await getCurrentUser()
  if (!user) return new Response('Non authentifié', { status: 401 })

  // Le coach IA est réservé aux abonnés (essai ou actif).
  const gate = await requirePro()
  if (gate instanceof Response) return gate

  let body: { messages?: unknown; locale?: unknown } | null
  try {
    body = await req.json()
  } catch {
    return new Response('Requête invalide', { status: 400 })
  }

  // Historique validé et borné : le client l'envoie en entier à chaque message.
  const parsed = sanitizeCoachMessages(body?.messages)
  if (!parsed.ok) return new Response(parsed.error, { status: 400 })

  const service = await createServiceClient()

  // Langue : celle envoyée par le site, sinon celle du profil (app mobile).
  let locale = asCoachLocale(body?.locale)
  if (!locale) {
    const { data: profile } = await service.from('profiles').select('locale').eq('id', user.id).maybeSingle()
    locale = asCoachLocale(profile?.locale) ?? 'fr'
  }

  // Quota quotidien par membre : l'essai Pro s'ouvre sans carte à tout nouveau
  // compte, et chaque message coûte un appel au modèle. Admins exemptés.
  if (!gate.isAdmin) {
    const { data: allowed, error } = await service.rpc('coach_consume_quota', {
      p_user_id: user.id,
      p_limit: COACH_DAILY_LIMIT,
    })
    if (error) {
      // Fermé par défaut : sans compteur, aucun plafond de coût.
      console.error('Quota coach indisponible:', error.message)
      return new Response('Le coach est momentanément indisponible.', { status: 503 })
    }
    if (allowed !== true) return new Response(QUOTA_REACHED[locale], { status: 429 })
  }

  let stream
  try {
    stream = await anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system: systemPrompt(locale),
      messages: parsed.messages,
      stream: true,
    })
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return new Response('Trop de requêtes, réessaie dans un instant.', { status: 429 })
    }
    if (err instanceof Anthropic.APIError) {
      console.error('Erreur API Claude:', err.status, err.message)
      return new Response('Le coach est momentanément indisponible.', { status: 502 })
    }
    console.error('Erreur inattendue côté coach:', err)
    return new Response('Erreur interne.', { status: 500 })
  }

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          } else if (event.type === 'message_delta' && event.delta.stop_reason === 'max_tokens') {
            console.warn('Réponse coach tronquée: max_tokens atteint')
          }
        }
        controller.close()
      } catch (err) {
        console.error('Erreur pendant le streaming du coach:', err)
        controller.error(err)
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
