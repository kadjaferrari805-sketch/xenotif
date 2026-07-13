import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { FEATURES } from '@/lib/constants'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default async function AdminContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')
  const service = await createServiceClient()
  const { data: isAdmin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  if (!isAdmin) redirect('/dashboard')

  const { data: rows } = await service.from('content_disciplines').select('slug, min_plan')
  const minPlanBySlug = new Map((rows ?? []).map(r => [r.slug as string, r.min_plan as string]))

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg p-6 md:p-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-8 hover:text-sport-fg">
        <ArrowLeft size={14} /> Admin
      </Link>
      <h1 className="text-2xl font-black mb-6">Contenu des disciplines</h1>
      <div className="space-y-2 max-w-2xl">
        {FEATURES.map(f => (
          <Link
            key={f.slug}
            href={`/admin/content/${f.slug}`}
            className="flex items-center justify-between rounded-xl border border-sport-border bg-sport-card px-5 py-4 hover:border-sport-orange/40 transition-all"
          >
            <span className="text-sm font-bold text-sport-fg">{f.title}</span>
            <span className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${minPlanBySlug.get(f.slug) === 'free' ? 'text-[#1E7F5A] border-emerald-500/30 bg-emerald-500/10' : 'text-sport-orange border-sport-orange/30 bg-sport-orange/10'}`}>
                {minPlanBySlug.get(f.slug) ?? 'non seedé'}
              </span>
              <ArrowRight size={14} className="text-sport-gray" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
