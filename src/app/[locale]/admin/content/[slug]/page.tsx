import { redirect, notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { FEATURES } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import { ContentEditor, type EditorInitial, type EditorLocale } from '@/components/admin/ContentEditor'

const LOCALES = ['fr', 'en', 'de'] as const
const EMPTY_SECTIONS = { tagline: '', heroStat: '', guide: {}, tips: [], exercises: [], program: [], faq: [] }

export default async function AdminContentEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const base = FEATURES.find(f => f.slug === slug)
  if (!base) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')
  const service = await createServiceClient()
  const { data: isAdmin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  if (!isAdmin) redirect('/dashboard')

  const [{ data: disc }, { data: i18n }, { data: videos }] = await Promise.all([
    service.from('content_disciplines').select('min_plan').eq('slug', slug).maybeSingle(),
    service.from('content_discipline_i18n').select('locale, meta, sections').eq('discipline_slug', slug),
    service.from('content_videos').select('idx, youtube_ids, min_plan, i18n').eq('discipline_slug', slug).order('idx'),
  ])

  const i18nByLocale = new Map((i18n ?? []).map(r => [r.locale as string, r]))
  const byLocale = Object.fromEntries(LOCALES.map(l => {
    const row = i18nByLocale.get(l)
    const meta = (row?.meta ?? {}) as { title?: string; tag?: string; description?: string; stats?: string[]; levels?: string[] }
    const editorLocale: EditorLocale = {
      title: meta.title ?? '', tag: meta.tag ?? '', description: meta.description ?? '',
      statsText: (meta.stats ?? []).join('\n'), levelsText: (meta.levels ?? []).join('\n'),
      sectionsJson: JSON.stringify(row?.sections ?? EMPTY_SECTIONS, null, 2),
    }
    return [l, editorLocale]
  })) as EditorInitial['byLocale']

  const initial: EditorInitial = {
    minPlan: disc?.min_plan ?? (slug === 'musculation' ? 'free' : 'pro'),
    byLocale,
    videosJson: JSON.stringify(videos ?? [], null, 2),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg p-6 md:p-10">
      <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-8 hover:text-sport-fg">
        <ArrowLeft size={14} /> Contenu
      </Link>
      <h1 className="text-2xl font-black mb-6">{base.title}</h1>
      <ContentEditor slug={slug} initial={initial} />
    </div>
  )
}
