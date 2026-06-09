import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { checkEligibility } from '@/lib/reviews/eligibility'
import type { ReviewType } from '@/lib/reviews/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function parseType(v: string | null): ReviewType | null {
  return v === 'platform' || v === 'product' ? v : null
}

// GET : liste des avis non masqués pour une cible
export async function GET(req: NextRequest) {
  const type = parseType(req.nextUrl.searchParams.get('type'))
  const productId = req.nextUrl.searchParams.get('productId')
  if (!type) return NextResponse.json({ error: 'bad_type' }, { status: 400 })
  if (type === 'product' && !productId) return NextResponse.json({ error: 'missing_product' }, { status: 400 })

  const service = await createServiceClient()
  let q = service.from('reviews')
    .select('id, type, product_id, author_name, rating, comment, locale, created_at')
    .eq('type', type)
    .eq('hidden', false)
    .order('created_at', { ascending: false })
    .limit(50)
  if (type === 'product') q = q.eq('product_id', productId)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}

// POST : créer/mettre à jour son avis (1 par client/cible)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as
      { type?: string; productId?: string | null; rating?: number; comment?: string } | null
    const type = parseType(body?.type ?? null)
    const productId = type === 'product' ? (body?.productId ?? null) : null
    const rating = Number(body?.rating)
    const comment = (body?.comment ?? '').trim()

    if (!type) return NextResponse.json({ error: 'bad_type' }, { status: 400 })
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'bad_rating' }, { status: 400 })
    if (comment.length < 10) return NextResponse.json({ error: 'comment_too_short' }, { status: 400 })
    if (type === 'product' && !productId) return NextResponse.json({ error: 'missing_product' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'guest' }, { status: 401 })

    const service = await createServiceClient()
    const elig = await checkEligibility(service, user, type, productId)
    if (!elig.eligible) return NextResponse.json({ error: elig.reason }, { status: 403 })

    // Remplace l'avis existant (1 par client/cible) : delete + insert.
    let del = service.from('reviews').delete().eq('user_id', user.id).eq('type', type)
    if (type === 'product' && productId) del = del.eq('product_id', productId)
    await del
    const { data, error } = await service.from('reviews').insert({
      type, product_id: productId, user_id: user.id,
      author_name: elig.authorName ?? 'Client',
      rating, comment,
      locale: req.headers.get('x-next-intl-locale') ?? 'fr',
    }).select('id, type, product_id, author_name, rating, comment, locale, created_at').single()
    if (error) {
      console.error('[POST /api/reviews] insert error:', error)
      return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    }
    return NextResponse.json({ review: data })
  } catch (e) {
    // Garantit une réponse JSON même en cas d'exception inattendue
    // (sinon ReviewForm reçoit un 500 non-JSON et affiche le message générique).
    console.error('[POST /api/reviews] unexpected error:', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
