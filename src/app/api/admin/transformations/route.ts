import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const BUCKET = 'transformations'

async function adminService() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const service = await createServiceClient()
  const { data: admin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  return admin ? service : null
}

export async function GET() {
  const service = await adminService()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { data } = await service.from('transformations')
    .select('id, display_name, before_path, after_path, caption, weeks, created_at')
    .eq('status', 'pending').order('created_at', { ascending: false })
  const items = (data ?? []).map(r => ({
    id: r.id, displayName: r.display_name, caption: r.caption, weeks: r.weeks, createdAt: r.created_at,
    beforeUrl: service.storage.from(BUCKET).getPublicUrl(r.before_path).data.publicUrl,
    afterUrl: service.storage.from(BUCKET).getPublicUrl(r.after_path).data.publicUrl,
  }))
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const service = await adminService()
  if (!service) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json().catch(() => null) as { id?: string; status?: string } | null
  const status = body?.status === 'approved' || body?.status === 'rejected' ? body.status : null
  if (!body?.id || !status) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const { error } = await service.from('transformations').update({ status }).eq('id', body.id)
  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
