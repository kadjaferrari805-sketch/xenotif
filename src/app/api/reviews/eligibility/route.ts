import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { checkEligibility } from '@/lib/reviews/eligibility'
import type { ReviewType } from '@/lib/reviews/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  const productId = req.nextUrl.searchParams.get('productId')
  if (type !== 'platform' && type !== 'product') return NextResponse.json({ error: 'bad_type' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ eligible: false, reason: 'guest' })

  const service = await createServiceClient()
  const elig = await checkEligibility(service, user, type as ReviewType, type === 'product' ? productId : null)

  // Avis existant (pour pré-remplir le formulaire)
  let existing = null
  if (elig.eligible) {
    let q = service.from('reviews').select('rating, comment').eq('user_id', user.id).eq('type', type)
    if (type === 'product' && productId) q = q.eq('product_id', productId)
    const { data } = await q.maybeSingle()
    existing = data ?? null
  }
  return NextResponse.json({ ...elig, existing })
}
