import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ⚠️ ENDPOINT DE DIAGNOSTIC TEMPORAIRE — à retirer après usage.
const TOKEN = 'xeno-repair-k7Q2mZ9p'

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const email = req.nextUrl.searchParams.get('email')
  const service = await createServiceClient()
  const out: Record<string, unknown> = {}

  // 1. Insertion test avec un user_id ALÉATOIRE (révèle RLS / colonne manquante / check).
  const randomId = crypto.randomUUID()
  {
    const { data, error } = await service.from('reviews').insert({
      type: 'platform', product_id: null, user_id: randomId,
      author_name: 'Diag', rating: 5, comment: 'Diagnostic avis xenotif (sera supprimé).', locale: 'fr',
    }).select('id').single()
    out.randomInsert = error
      ? { message: error.message, code: error.code, details: error.details, hint: error.hint }
      : 'OK'
    if (data?.id) await service.from('reviews').delete().eq('id', data.id)
  }

  // 2. Insertion test avec le VRAI user_id (par email) → reproduit exactement le flux.
  if (email) {
    const { data: list, error: listErr } = await service.auth.admin.listUsers({ perPage: 200 })
    if (listErr) out.listUsersError = listErr.message
    const userId = list?.users.find(u => (u.email ?? '').toLowerCase() === email.toLowerCase())?.id ?? null
    out.userIdFound = userId
    if (userId) {
      const { data, error } = await service.from('reviews').insert({
        type: 'platform', product_id: null, user_id: userId,
        author_name: 'Diag', rating: 5, comment: 'Diagnostic avis xenotif (sera supprimé).', locale: 'fr',
      }).select('id').single()
      out.realInsert = error
        ? { message: error.message, code: error.code, details: error.details, hint: error.hint }
        : 'OK'
      if (data?.id) await service.from('reviews').delete().eq('id', data.id)
    }
  }

  return NextResponse.json(out)
}
