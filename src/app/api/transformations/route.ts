import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { validateImage, extFromType } from '@/lib/transformations'
import {
  clientIp,
  enforceRateLimit,
  retryAfterHeaders,
  tooManyRequestsBody,
} from '@/lib/security/rate-limit'
import { getRateLimitStore } from '@/lib/security/rate-limit-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const BUCKET = 'transformations'

/**
 * Limitation (05-K.7). Chaque POST accepte DEUX images de 5 Mo et les ecrit dans
 * le Storage avant toute verification de moderation. Sans borne, un compte
 * authentifie unique peut remplir le bucket : le cout est direct (stockage,
 * bande passante) et la file de moderation devient inexploitable.
 *
 * La dimension principale est l'ID utilisateur, PAS l'IP : la route exige deja
 * une session, et l'identite du compte est l'axe que l'appelant ne peut pas
 * faire varier — changer d'IP ne coute rien, creer des comptes verifies si.
 * L'IP reste une borne secondaire, non requise : elle freine un abus reparti sur
 * plusieurs comptes depuis une meme origine, mais son absence ne doit pas
 * refuser un envoi legitime puisque la borne par compte tient deja.
 *
 * Calibrage : un utilisateur legitime envoie une transformation, rarement deux.
 * 5 envois par heure et par compte sont tres au-dessus de l'usage reel.
 *
 * fail-closed : l'action ecrit dans le Storage ET en base. On ne laisse pas
 * passer une ecriture couteuse a l'aveugle si le compteur est injoignable.
 */
const USER_RULE = { limit: 5, windowSeconds: 3600 }
const IP_RULE = { limit: 20, windowSeconds: 3600 }

/**
 * GET : transformations approuvees (public).
 *
 * Une table vide et une base injoignable sont deux situations DIFFERENTES et
 * doivent le rester. La version precedente renvoyait `200 { items: [] }` dans
 * les deux cas : une panne se presentait comme « aucune transformation », la
 * galerie disparaissait silencieusement et rien n'etait trace. On distingue
 * desormais 200 (liste eventuellement vide, etat legitime) et 503 (erreur
 * d'infrastructure, journalisee).
 *
 * 503 plutot que 500 : l'echec porte sur une dependance, pas sur la requete du
 * visiteur. Le corps reste generique — ni message Postgres, ni nom de table.
 */
export async function GET() {
  try {
    const service = await createServiceClient()
    const { data, error } = await service.from('transformations')
      .select('id, display_name, before_path, after_path, caption, weeks')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) {
      console.error('[GET /api/transformations] lecture impossible', error)
      return NextResponse.json({ error: 'unavailable' }, { status: 503 })
    }

    const items = (data ?? []).map(r => ({
      id: r.id, displayName: r.display_name, caption: r.caption, weeks: r.weeks,
      beforeUrl: service.storage.from(BUCKET).getPublicUrl(r.before_path).data.publicUrl,
      afterUrl: service.storage.from(BUCKET).getPublicUrl(r.after_path).data.publicUrl,
    }))
    return NextResponse.json({ items })
  } catch (e) {
    // Client Supabase indisponible (variables absentes, garde d'environnement).
    console.error('[GET /api/transformations]', e)
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }
}

/**
 * Supprime des fichiers que CETTE requete vient de televerser, apres un echec
 * survenu plus loin dans la sequence. Sans cela, le Storage accumule des images
 * orphelines qu'aucune ligne ne reference et que rien ne viendra purger.
 *
 * Best effort et silencieux vis-a-vis de l'appelant : un nettoyage rate est
 * journalise mais ne doit JAMAIS remplacer ni masquer l'erreur d'origine — le
 * client doit apprendre que son envoi a echoue, pas que le menage a echoue.
 *
 * Les chemins passes ici sont toujours ceux construits juste au-dessus a partir
 * de l'ID du compte et d'un UUID fraichement tire : aucun fichier appartenant a
 * une autre transformation ne peut etre atteint.
 */
async function cleanupUploads(service: SupabaseClient, paths: string[]): Promise<void> {
  if (paths.length === 0) return
  try {
    const { error } = await service.storage.from(BUCKET).remove(paths)
    if (error) console.error('[transformations] nettoyage incomplet', paths, error)
  } catch (e) {
    console.error('[transformations] nettoyage impossible', paths, e)
  }
}

// POST : envoi d'une transformation (connecte, multipart).
export async function POST(req: NextRequest) {
  try {
    // 1. Authentification.
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'guest' }, { status: 401 })

    // 2. Limitation de debit — avant meme la lecture du corps multipart, donc
    //    avant tout televersement : un appelant bride ne fait pas transiter
    //    10 Mo d'images ni n'occupe le Storage.
    const verdict = await enforceRateLimit({
      store: getRateLimitStore(),
      failClosed: true,
      dimensions: [
        { scope: 'transformations:user', value: user.id, rule: USER_RULE, required: true },
        { scope: 'transformations:ip', value: clientIp(req), rule: IP_RULE },
      ],
    })
    if (!verdict.allowed) {
      return NextResponse.json(tooManyRequestsBody(), {
        status: 429,
        headers: retryAfterHeaders(verdict.retryAfterSeconds),
      })
    }

    // 3. Validation.
    const form = await req.formData()
    const before = form.get('before') as File | null
    const after = form.get('after') as File | null
    const consent = form.get('consent') === 'true'
    const caption = ((form.get('caption') as string) ?? '').trim().slice(0, 280) || null
    const displayName = ((form.get('displayName') as string) ?? '').trim().slice(0, 40) || null
    const weeks = Math.min(520, Math.max(0, parseInt((form.get('weeks') as string) ?? '0') || 0)) || null

    if (!consent) return NextResponse.json({ error: 'consent' }, { status: 400 })
    if (!validateImage(before).ok || !validateImage(after).ok) return NextResponse.json({ error: 'image' }, { status: 400 })

    const service = await createServiceClient()
    const id = crypto.randomUUID()
    const beforePath = `${user.id}/${id}-before.${extFromType(before!.type)}`
    const afterPath = `${user.id}/${id}-after.${extFromType(after!.type)}`

    // 4. Televersement « avant ». Rien n'a encore ete ecrit : aucun nettoyage.
    const ub = await service.storage.from(BUCKET).upload(beforePath, Buffer.from(await before!.arrayBuffer()), { contentType: before!.type })
    if (ub.error) {
      console.error('[POST /api/transformations] televersement « avant » echoue', ub.error)
      return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
    }

    // 5. Televersement « apres ». En cas d'echec, le fichier « avant » est deja
    //    en place et n'aura jamais de ligne : on le reprend.
    const ua = await service.storage.from(BUCKET).upload(afterPath, Buffer.from(await after!.arrayBuffer()), { contentType: after!.type })
    if (ua.error) {
      console.error('[POST /api/transformations] televersement « apres » echoue', ua.error)
      await cleanupUploads(service, [beforePath])
      return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
    }

    // 6. Insertion. Si elle echoue, les deux fichiers sont orphelins.
    const { error } = await service.from('transformations').insert({
      user_id: user.id, display_name: displayName, before_path: beforePath, after_path: afterPath,
      caption, weeks, consent: true, status: 'pending',
    })
    if (error) {
      console.error('[POST /api/transformations] insertion echouee', error)
      await cleanupUploads(service, [beforePath, afterPath])
      return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/transformations]', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
