import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { validateImage, extFromType } from '@/lib/transformations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const BUCKET = 'transformations'

// GET : transformations approuvées (public).
export async function GET() {
  const service = await createServiceClient()
  const { data, error } = await service.from('transformations')
    .select('id, display_name, before_path, after_path, caption, weeks')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(12)
  if (error) return NextResponse.json({ items: [] })
  const items = (data ?? []).map(r => ({
    id: r.id, displayName: r.display_name, caption: r.caption, weeks: r.weeks,
    beforeUrl: service.storage.from(BUCKET).getPublicUrl(r.before_path).data.publicUrl,
    afterUrl: service.storage.from(BUCKET).getPublicUrl(r.after_path).data.publicUrl,
  }))
  return NextResponse.json({ items })
}

// POST : envoi d'une transformation (connecté, multipart).
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'guest' }, { status: 401 })

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
    const ub = await service.storage.from(BUCKET).upload(beforePath, Buffer.from(await before!.arrayBuffer()), { contentType: before!.type })
    const ua = await service.storage.from(BUCKET).upload(afterPath, Buffer.from(await after!.arrayBuffer()), { contentType: after!.type })
    if (ub.error || ua.error) return NextResponse.json({ error: 'upload_failed' }, { status: 500 })

    const { error } = await service.from('transformations').insert({
      user_id: user.id, display_name: displayName, before_path: beforePath, after_path: afterPath,
      caption, weeks, consent: true, status: 'pending',
    })
    if (error) return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/transformations]', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
