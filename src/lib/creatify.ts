import { Creatify } from '@tsavo/creatify-api-ts'

// Client Creatify (génération de pubs vidéo). SERVEUR UNIQUEMENT — les clés
// (CREATIFY_API_ID / CREATIFY_API_KEY) sont des secrets, jamais exposés au client.
// Récupère-les sur creatify.ai → Settings → API et mets-les dans .env.local.

let client: Creatify | null = null

export function isCreatifyConfigured(): boolean {
  return !!(process.env.CREATIFY_API_ID && process.env.CREATIFY_API_KEY)
}

export function getCreatify(): Creatify {
  const apiId = process.env.CREATIFY_API_ID
  const apiKey = process.env.CREATIFY_API_KEY
  if (!apiId || !apiKey) {
    throw new Error(
      'Creatify non configuré : définis CREATIFY_API_ID et CREATIFY_API_KEY dans .env.local (creatify.ai → Settings → API).',
    )
  }
  if (!client) client = new Creatify({ apiId, apiKey })
  return client
}

export interface AdOptions {
  /** URL source (par défaut le site Xenotif). */
  url?: string
  name?: string
  aspectRatio?: '9x16' | '16x9' | '1x1'
  /** Durée cible en secondes. */
  videoLength?: number
  language?: string
  /** Ex. "Instagram", "Tiktok", "Facebook". */
  targetPlatform?: string
  targetAudience?: string
  visualStyle?: string
  scriptStyle?: string
}

/**
 * Génère une pub vidéo à partir d'une URL : crée le « link » (Creatify scrape la
 * page) puis lance la génération de la vidéo. Renvoie les identifiants à suivre.
 */
export async function generateAdFromUrl(opts: AdOptions = {}): Promise<{ linkId: string; videoId: string }> {
  const creatify = getCreatify()
  const url = opts.url ?? 'https://xenotif.com'

  const link = await creatify.urlToVideo.createLink({ url })
  const video = await creatify.urlToVideo.createVideoFromLink({
    link: link.id,
    name: opts.name ?? 'Xenotif — Pub',
    aspect_ratio: opts.aspectRatio ?? '9x16',
    video_length: opts.videoLength ?? 30,
    language: opts.language ?? 'fr',
    target_platform: opts.targetPlatform ?? 'Instagram',
    target_audience: opts.targetAudience,
    visual_style: opts.visualStyle,
    script_style: opts.scriptStyle,
  })

  return { linkId: link.id, videoId: video.id }
}

/** Statut + résultat d'une vidéo (poll). `status === 'done'` → `video_output` dispo. */
export async function getAdStatus(videoId: string) {
  return getCreatify().urlToVideo.getVideo(videoId)
}
