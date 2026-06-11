import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { parseContentPayload, type CmsInput } from '@/lib/content-cms'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Garde admin (même check que /admin).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const service = await createServiceClient()
  const { data: isAdmin } = await service.from('admin_users').select('id').eq('id', user.id).maybeSingle()
  if (!isAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const parsed = parseContentPayload(await req.json() as CmsInput)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { minPlan, byLocale, videos } = parsed.data

  // 1) discipline (min_plan)
  await service.from('content_disciplines')
    .upsert({ slug, min_plan: minPlan, updated_at: new Date().toISOString() }, { onConflict: 'slug' })

  // 2) i18n (meta + sections) pour les 3 langues
  await service.from('content_discipline_i18n').upsert(
    (['fr', 'en', 'de'] as const).map(l => ({ discipline_slug: slug, locale: l, meta: byLocale[l].meta, sections: byLocale[l].sections })),
    { onConflict: 'discipline_slug,locale' },
  )

  // 3) vidéos : upsert par idx, puis suppression des idx au-delà du nouveau nombre
  if (videos.length) {
    await service.from('content_videos').upsert(
      videos.map(v => ({ discipline_slug: slug, idx: v.idx, youtube_ids: v.youtube_ids, min_plan: v.min_plan, i18n: v.i18n })),
      { onConflict: 'discipline_slug,idx' },
    )
  }
  await service.from('content_videos').delete().eq('discipline_slug', slug).gte('idx', videos.length)

  // Revalidation à la demande des pages publiques (toutes locales du route).
  revalidatePath('/[locale]/disciplines/[slug]', 'page')

  return NextResponse.json({ ok: true })
}
