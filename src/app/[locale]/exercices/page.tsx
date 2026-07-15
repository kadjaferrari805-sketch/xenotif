import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight, X, Zap } from 'lucide-react'
import { exercicesForLocale } from '@/lib/exercices/registry'
import { getExerciceDetail } from '@/lib/exercices/details'

const SITE = 'https://xenotif.com'
const LOCS = ['fr', 'en', 'de'] as const

function hubUrl(locale: string): string {
  return locale === 'fr' ? `${SITE}/exercices` : `${SITE}/${locale}/exercices`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'exercices' })
  const languages: Record<string, string> = { 'x-default': hubUrl('fr') }
  for (const l of LOCS) languages[l] = hubUrl(l)
  return {
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
    alternates: { canonical: hubUrl(locale), languages },
  }
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const LEVELS = ['debutant', 'intermediaire', 'avance'] as const
const EQUIPMENT = ['none', 'dumbbells', 'barbell', 'kettlebell', 'cable', 'machine', 'pullupBar', 'bench', 'mat'] as const

function levelHref(level: string, equipment?: string): string {
  const params = new URLSearchParams()
  params.set('level', level)
  if (equipment) params.set('equipment', equipment)
  return `/exercices?${params.toString()}`
}
function equipmentHref(equipment: string, level?: string): string {
  const params = new URLSearchParams()
  params.set('equipment', equipment)
  if (level) params.set('level', level)
  return `/exercices?${params.toString()}`
}

// Hub des exercices : page catégorie SEO + maillage vers chaque fiche exercice.
// Filtrable par niveau / muscle / matériel via ?level=&muscle=&equipment=
// (liens envoyés depuis les badges de la fiche exercice).
export default async function ExercicesHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ level?: string; muscle?: string; equipment?: string }>
}) {
  const { locale } = await params
  const { level, muscle, equipment } = await searchParams
  const t = await getTranslations({ locale, namespace: 'exercices' })
  const tDetail = await getTranslations({ locale, namespace: 'exercicesDetail' })
  const exercices = exercicesForLocale(locale)

  const withDetail = exercices.map(({ slug, ex }) => ({ slug, ex, detail: getExerciceDetail(slug, locale) }))
  const muscleNorm = muscle ? norm(muscle) : null
  const filtered = withDetail.filter(({ detail }) => {
    if (!detail) return true
    if (level && detail.difficulty !== level) return false
    if (equipment && !detail.equipment.includes(equipment)) return false
    if (muscleNorm && ![...detail.primaryMuscles, ...detail.secondaryMuscles].some((m) => norm(m) === muscleNorm)) return false
    return true
  })

  const filterLabel = level ? tDetail(`diff_${level}` as 'diff_avance') : equipment ? tDetail(`eq_${equipment}` as 'eq_none') : muscle || null

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filtered.map(({ slug, ex }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ex.name,
      url: locale === 'fr' ? `${SITE}/exercices/${slug}` : `${SITE}/${locale}/exercices/${slug}`,
    })),
  }

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-sport-orange mb-3">{t('hubEyebrow')}</p>
        <h1 className="text-4xl md:text-5xl font-black mb-4">{t('hubTitle')}</h1>
        <p className="text-lg text-sport-fg max-w-2xl mb-6">{t('hubSubtitle')}</p>

        {/* Filtres visibles (niveau / matériel) - la fiche exercice envoie déjà des
            liens ?level=&equipment=&muscle=, ce bloc les rend accessibles directement
            depuis le hub. Filtre muscle laissé en deep-link uniquement (valeurs libres,
            trop nombreuses pour une rangée de pastilles lisible). */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href="/exercices"
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
              !level && !equipment && !muscle
                ? 'bg-sport-orange text-white border-sport-orange'
                : 'border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-gray'
            }`}
          >
            {t('hubFilterAll')}
          </Link>
          {LEVELS.map((l) => (
            <Link
              key={l}
              href={levelHref(l, equipment)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                level === l
                  ? 'bg-sport-orange text-white border-sport-orange'
                  : 'border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-gray'
              }`}
            >
              {tDetail(`diff_${l}`)}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {EQUIPMENT.map((eq) => (
            <Link
              key={eq}
              href={equipmentHref(eq, level)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                equipment === eq
                  ? 'bg-sport-fg text-sport-dark border-sport-fg'
                  : 'border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-gray'
              }`}
            >
              {tDetail(`eq_${eq}`)}
            </Link>
          ))}
        </div>

        {filterLabel && (
          <Link
            href="/exercices"
            className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-sport-orange/10 text-sport-orange border border-sport-orange/30 mb-8 hover:bg-sport-orange/20 transition-colors"
          >
            {t('hubFilteredBy', { label: filterLabel })}
            <X size={12} aria-hidden="true" />
          </Link>
        )}

        {filtered.length === 0 ? (
          <p className="text-sport-gray">{t('hubNoResults')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(({ slug, ex }) => (
              <Link
                key={slug}
                href={`/exercices/${slug}`}
                className="group bg-sport-card border border-sport-border rounded-2xl p-5 hover:border-sport-orange/50 transition-all hover:-translate-y-0.5"
              >
                <h2 className="text-base font-black mb-1.5 group-hover:text-sport-orange transition-colors">{ex.name}</h2>
                <p className="text-xs text-sport-gray leading-relaxed mb-3 line-clamp-2">{ex.muscles}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sport-orange/10 text-sport-orange">
                    <Zap size={10} aria-hidden="true" /> {ex.level}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sport-orange text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('seeExercise')} <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
