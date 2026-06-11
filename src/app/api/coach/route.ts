import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { requirePro } from '@/lib/access'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM = `Tu es le Coach IA de Xenotif®, un assistant sportif expert, motivant et bienveillant.
Tu aides les membres à atteindre leurs objectifs : perte de poids, prise de masse, endurance, performance.
Disciplines disponibles sur Xenotif : Running & Cardio, Musculation, HIIT, Cyclisme, Natation, CrossFit, Yoga, Boxe, Stretching, Nutrition.

Règles :
- Réponds toujours en français.
- Sois précis, concret, et actionnable.
- Adapte tes conseils au niveau de l'utilisateur (débutant → expérimenté).
- Propose des plans structurés (jours, séries, répétitions, durées) quand c'est pertinent.
- Reste motivant et positif, mais sans être excessif.
- Ne dépasse pas 400 mots par réponse (sauf si un plan détaillé est demandé).
- Ne donne pas de conseils médicaux ; renvoie vers un professionnel de santé si nécessaire.`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Non authentifié', { status: 401 })

  // Le coach IA est réservé aux abonnés (essai ou actif).
  const gate = await requirePro()
  if (gate instanceof Response) return gate

  const { messages } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!messages?.length) return new Response('Messages requis', { status: 400 })

  let stream
  try {
    stream = await anthropic.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system: SYSTEM,
      messages,
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
