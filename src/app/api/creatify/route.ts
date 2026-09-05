import { NextResponse } from 'next/server'
import { getAccess } from '@/lib/access'
import { generateAdFromUrl, getAdStatus, isCreatifyConfigured, type AdOptions } from '@/lib/creatify'

// Génération de pubs vidéo Creatify — RÉSERVÉ ADMIN (déclenche des générations payantes).
// POST  /api/creatify        { url?, aspectRatio?, videoLength?, language?, targetPlatform?, ... } → { linkId, videoId }
// GET   /api/creatify?id=...  → statut + résultat (video_output quand status === 'done')

export async function POST(req: Request) {
  const access = await getAccess()
  if (!access.isAdmin) return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
  if (!isCreatifyConfigured()) {
    return NextResponse.json({ error: 'Creatify non configuré (CREATIFY_API_ID / CREATIFY_API_KEY).' }, { status: 500 })
  }

  let body: AdOptions = {}
  try {
    body = (await req.json()) as AdOptions
  } catch {
    // corps vide → valeurs par défaut (site Xenotif)
  }

  try {
    const result = await generateAdFromUrl(body)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur Creatify' }, { status: 502 })
  }
}

export async function GET(req: Request) {
  const access = await getAccess()
  if (!access.isAdmin) return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Paramètre "id" requis' }, { status: 400 })

  try {
    const status = await getAdStatus(id)
    return NextResponse.json(status)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur Creatify' }, { status: 502 })
  }
}
