import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const service = await createServiceClient()
  const { data: admin } = await service.from('admin_users').select('id').eq('id', user.id).maybeSingle()
  return admin ? service : null
}

export async function GET() {
  const service = await requireAdmin()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { data, error } = await service.from('reviews').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const service = await requireAdmin()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { id, hidden } = await req.json().catch(() => ({})) as { id?: string; hidden?: boolean }
  if (!id || typeof hidden !== 'boolean') return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { error } = await service.from('reviews').update({ hidden }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const service = await requireAdmin()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { error } = await service.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
