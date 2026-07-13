import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, CheckCircle, Zap,
  Activity, Dumbbell, Bike, Waves, Flame, Star,
  Play, BookOpen, Target, Layers, Leaf,
} from 'lucide-react'
import { FEATURES } from '@/lib/constants'
import { getDisciplineContent, getDisciplineMeta } from '@/lib/disciplines'
import { VideoGallery } from '@/components/disciplines/VideoGallery'
import { DisciplineFAQSection } from '@/components/disciplines/DisciplineFAQ'
import { SubscriberGate } from '@/components/disciplines/SubscriberGate'
import { getDisciplineFromDb } from '@/lib/content-db'

/* ── Static data ─────────────────────────────────────────────── */

const SITE = 'https://xenotif.com'

const DISC_PHOTOS: Record<string, string> = {
  'running-cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80',
  musculation:      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1920&q=80',
  hiit:             'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80',
  cyclisme:         'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1920&q=80',
  natation:         'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1920&q=80',
  crossfit:         'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1920&q=80',
  yoga:             'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80',
  boxing:           'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1920&q=80',
  stretching:       'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=80',
  nutrition:        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1920&q=80',
}

const DISC_ICONS: Record<string, React.ReactNode> = {
  running:  <Activity size={20} aria-hidden="true" />,
  dumbbell: <Dumbbell size={20} aria-hidden="true" />,
  zap:      <Zap size={20} aria-hidden="true" />,
  bike:     <Bike size={20} aria-hidden="true" />,
  waves:    <Waves size={20} aria-hidden="true" />,
  flame:    <Flame size={20} aria-hidden="true" />,
  leaf:     <Leaf size={20} aria-hidden="true" />,
  target:   <Target size={20} aria-hidden="true" />,
  layers:   <Layers size={20} aria-hidden="true" />,
}

const COLOR_TEXT:  Record<string, string> = { orange: 'text-sport-orange',    blue: 'text-sport-blue',   lime: 'text-sport-lime' }
const COLOR_CARD:  Record<string, string> = { orange: 'bg-sport-orange/10 border-sport-orange/25', blue: 'bg-sport-blue/10 border-sport-blue/25', lime: 'bg-sport-lime/10 border-sport-lime/25' }
const COLOR_PILL:  Record<string, string> = { orange: 'bg-sport-orange text-sport-fg', blue: 'bg-sport-blue text-sport-fg', lime: 'bg-sport-lime text-[#0A0B0F]' }
const COLOR_VIDEO: Record<string, string> = { orange: 'bg-sport-orange/15 text-sport-orange', blue: 'bg-sport-blue/15 text-sport-blue', lime: 'bg-sport-lime/15 text-sport-lime' }

/* ── Metadata ────────────────────────────────────────────────── */
export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const meta = getDisciplineMeta(slug, locale)
  if (!meta) return {}
  const t = await getTranslations({ locale, namespace: 'disciplines' })
  // Le template du layout ajoute déjà « | Xenotif® » → ne pas le remettre.
  const title = t('metaTitle', { name: meta.title })
  const path = `/disciplines/${slug}`
  const languages: Record<string, string> = {
    fr: `${SITE}${path}`,
    en: `${SITE}/en${path}`,
    de: `${SITE}/de${path}`,
    'x-default': `${SITE}${path}`,
  }
  return {
    title,
    description: meta.description,
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: `${title} | Xenotif®`,
      description: meta.description,
      images: [DISC_PHOTOS[slug] ?? ''],
    },
  }
}

/* ── Page ────────────────────────────────────────────────────── */
export default async function DisciplinePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const base = FEATURES.find((f) => f.slug === slug)
  // B2 : contenu servi depuis la base pour toutes les disciplines (repli statique si absent).
  const db = await getDisciplineFromDb(slug, locale)
  const meta = db?.meta ?? getDisciplineMeta(slug, locale)
  if (!base || !meta) notFound()

  const t = await getTranslations('disciplines')

  const photo   = DISC_PHOTOS[slug] ?? ''
  const content = db?.content ?? getDisciplineContent(locale)[slug]
  const minPlan = db?.minPlan ?? (slug === 'musculation' ? 'free' : 'pro')
  // min_plan par vidéo (base) ; repli : 1ʳᵉ vidéo gratuite si la discipline est gratuite, sinon tout PRO.
  const videoMinPlans = db?.videoMinPlans ?? (content?.videos ?? []).map((_, i) => (minPlan === 'free' && i === 0 ? 'free' : 'pro'))
  const color   = base.color
  const { title, tag, description, stats, levels } = meta

  // Autres disciplines (méta localisée pour les libellés affichés)
  const others = FEATURES.filter((f) => f.slug !== slug).slice(0, 3).map((f) => {
    const m = getDisciplineMeta(f.slug, locale) ?? { title: f.title, tag: f.tag }
    return { slug: f.slug, title: m.title, tag: m.tag }
  })

  // ── SEO : données structurées (fil d'Ariane + FAQ) ──
  // FR à la racine (locale par défaut), autres préfixées, cohérent avec generateMetadata.
  const path = `/disciplines/${slug}`
  const pageUrl = locale === 'en' ? `${SITE}/en${path}` : locale === 'de' ? `${SITE}/de${path}` : `${SITE}${path}`
  const homeUrl = locale === 'en' ? `${SITE}/en` : locale === 'de' ? `${SITE}/de` : SITE
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Xenotif®', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: title, item: pageUrl },
    ],
  }
  const faq = content?.faq ?? []
  const faqSchema = faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null
  // Programme d'entraînement structuré = Course (nom, description, fournisseur).
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    inLanguage: locale,
    url: pageUrl,
    provider: { '@type': 'Organization', name: 'Xenotif®', url: SITE },
  }

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] overflow-hidden" aria-label={t('heroAria', { name: title })}>
        <Image src={photo} alt={t('heroAlt', { name: title })} fill sizes="100vw" className="object-cover" priority />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/60 to-black/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16">
          <div className="max-w-5xl mx-auto w-full">
            <Link href="/disciplines" className="inline-flex items-center gap-1.5 text-white/55 text-sm mb-10 hover:text-white transition-colors">
              <ArrowLeft size={14} aria-hidden="true" /> {t('back')}
            </Link>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${COLOR_PILL[color]}`}>
                {tag}
              </span>
              <div role="img" className="flex gap-0.5" aria-label={t('ratingAria')}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} aria-hidden="true" className="fill-sport-orange text-sport-orange" />)}
              </div>
              {content && (
                <span className="text-[11px] text-white/60 font-medium">{content.heroStat}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-black leading-none mb-4 tracking-tight text-white">
              {title}
            </h1>

            {/* Tagline */}
            {content && (
              <p className={`text-lg md:text-xl font-bold mb-4 ${COLOR_TEXT[color]}`}>
                {content.tagline}
              </p>
            )}
            <p className="text-white/65 text-sm max-w-lg leading-relaxed">{description}</p>

            {/* Quick stats from discipline */}
            <div className="flex flex-wrap gap-5 mt-6">
              {stats.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <CheckCircle size={14} aria-hidden="true" className={COLOR_TEXT[color]} />
                  <span className="text-sm font-semibold text-white">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Video Gallery ─────────────────────────────────────── */}
      {content?.videos && (
        <section aria-labelledby="videos-title" className="py-20 px-6 bg-sport-card border-b border-sport-border">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${COLOR_CARD[color]}`}>
                <Play size={16} aria-hidden="true" className={COLOR_TEXT[color]} />
              </div>
              <p className={`text-[11px] font-bold tracking-[2px] uppercase ${COLOR_TEXT[color]}`}>{t('videos.eyebrow')}</p>
            </div>
            <h2 id="videos-title" className="text-3xl md:text-4xl font-black text-sport-fg mb-2">
              {t('videos.title')}
            </h2>
            <p className="text-sport-fg text-sm mb-10 max-w-xl">
              {t('videos.subtitle')}
            </p>

            <VideoGallery videos={content.videos} videoMinPlans={videoMinPlans} accentColor={COLOR_VIDEO[color]} />
          </div>
        </section>
      )}

      {/* ── Guide complet ─────────────────────────────────────── */}
      {content?.guide && (
        <section aria-labelledby="guide-title" className="py-20 px-6 bg-sport-dark">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${COLOR_CARD[color]}`}>
                <BookOpen size={16} aria-hidden="true" className={COLOR_TEXT[color]} />
              </div>
              <p className={`text-[11px] font-bold tracking-[2px] uppercase ${COLOR_TEXT[color]}`}>{t('guide.eyebrow')}</p>
            </div>
            <h2 id="guide-title" className="text-3xl md:text-4xl font-black text-sport-fg mb-10">
              {t('guide.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(content.guide).map((section) => (
                <div
                  key={section.title}
                  className={`rounded-2xl border p-6 ${COLOR_CARD[color]}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl" aria-hidden="true">{section.emoji}</span>
                    <h3 className={`font-black text-base ${COLOR_TEXT[color]}`}>{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-sport-gray leading-relaxed">
                        <CheckCircle size={13} aria-hidden="true" className={`mt-0.5 shrink-0 ${COLOR_TEXT[color]}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Expert Tips ───────────────────────────────────────── */}
      {content?.tips && (
        <section aria-labelledby="tips-title" className="py-20 px-6 bg-sport-card border-y border-sport-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className={`text-[11px] font-bold tracking-[2px] uppercase mb-3 ${COLOR_TEXT[color]}`}>{t('tips.eyebrow')}</p>
              <h2 id="tips-title" className="text-3xl md:text-4xl font-black text-sport-fg">
                {t('tips.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.tips.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-sport-dark border border-sport-border rounded-2xl p-5 hover:border-sport-border/60 transition-all hover:-translate-y-1 group"
                >
                  <span className="text-3xl mb-4 block" aria-hidden="true">{tip.icon}</span>
                  <h3 className={`font-black text-sm mb-2 ${COLOR_TEXT[color]}`}>{tip.title}</h3>
                  <p className="text-xs text-sport-gray leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Exercices ─────────────────────────────────────────── */}
      {content?.exercises && content.exercises.length > 0 && (
        <section aria-labelledby="exercises-title" className="py-20 px-6 bg-sport-dark border-b border-sport-border">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${COLOR_CARD[color]}`}>
                <Layers size={16} aria-hidden="true" className={COLOR_TEXT[color]} />
              </div>
              <p className={`text-[11px] font-bold tracking-[2px] uppercase ${COLOR_TEXT[color]}`}>{t('exercises.eyebrow')}</p>
            </div>
            <h2 id="exercises-title" className="text-3xl md:text-4xl font-black text-sport-fg mb-2">
              {t('exercises.title')}
            </h2>
            <p className="text-sport-fg text-sm mb-10 max-w-xl">
              {t('exercises.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.exercises.map((ex) => (
                <div
                  key={ex.name}
                  className="bg-sport-card border border-sport-border rounded-2xl p-5 hover:border-sport-border/70 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className={`font-black text-sm ${COLOR_TEXT[color]}`}>{ex.name}</h3>
                    <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${COLOR_CARD[color]} ${COLOR_TEXT[color]}`}>
                      {ex.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-[11px] text-sport-gray">
                    <span className="font-bold text-sport-fg">{ex.sets}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ex.muscles}</span>
                  </div>
                  <p className="text-xs text-sport-gray leading-relaxed">{ex.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Programme détaillé + CTA ─────────────────────────── */}
      <section className="py-20 px-6 bg-sport-dark">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">

          {/* Left — Levels + Program */}
          <div className="md:col-span-3 space-y-12">

            {/* Levels */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span aria-hidden="true" className={COLOR_TEXT[color]}>{DISC_ICONS[base.icon]}</span>
                <h2 className="text-2xl font-black text-sport-fg">{t('levels.title')}</h2>
              </div>
              <ul className="space-y-3">
                {levels.map((level, i) => (
                  <li key={level} className={`flex items-center justify-between border rounded-xl px-5 py-4 ${COLOR_CARD[color]}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${COLOR_PILL[color]}`} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-sport-fg">{level}</span>
                    </div>
                    <Link
                      href="/#newsletter"
                      aria-label={t('levels.joinAria', { level })}
                      className={`text-xs font-bold hover:underline flex items-center gap-1 ${COLOR_TEXT[color]}`}
                    >
                      {t('levels.join')} <ArrowRight size={11} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Program */}
            {content?.program && content.program.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Target size={20} aria-hidden="true" className={COLOR_TEXT[color]} />
                  <h2 className="text-2xl font-black text-sport-fg">{t('program.title')}</h2>
                </div>

                <SubscriberGate minPlan={minPlan}>
                <div className="space-y-4">
                  {content.program.map((block, bi) => (
                    <div key={block.week} className="bg-sport-card border border-sport-border rounded-xl overflow-hidden">
                      {/* Week header */}
                      <div className="px-5 py-3 border-b border-sport-border flex items-center justify-between">
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${COLOR_TEXT[color]}`}>{block.week}</p>
                          <p className="text-sm font-bold text-sport-fg">{block.theme}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${COLOR_CARD[color]} ${COLOR_TEXT[color]}`}>
                          {t('program.phase', { n: bi + 1 })}
                        </span>
                      </div>
                      {/* Sessions */}
                      <ul className="divide-y divide-sport-border">
                        {block.sessions.map((session, si) => (
                          <li key={session.name} className="px-5 py-3.5 flex gap-4">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${COLOR_PILL[color]}`} aria-hidden="true">
                              {si + 1}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-sport-fg">{session.name}</p>
                              <p className="text-xs text-sport-gray mt-0.5 leading-relaxed">{session.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-sport-gray mt-4">
                  {t('program.note')}
                </p>
                </SubscriberGate>
              </div>
            )}
          </div>

          {/* Right — Sticky CTA */}
          <aside className="md:col-span-2" aria-label={t('cta.title')}>
            <div className="sticky top-24 bg-sport-card border border-sport-border rounded-2xl p-7">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${COLOR_CARD[color]}`}>
                <span className={COLOR_TEXT[color]} aria-hidden="true">{DISC_ICONS[base.icon]}</span>
              </div>

              <h2 className="text-lg font-black text-sport-fg mb-2">{t('cta.title')}</h2>
              <p className="text-sport-gray text-xs leading-relaxed mb-6">
                {t.rich('cta.desc', { title, b: (c) => <strong className="text-sport-fg">{c}</strong> })}
              </p>

              <ul className="space-y-2.5 mb-7">
                {(t.raw('cta.features') as string[]).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-sport-gray">
                    <CheckCircle size={13} aria-hidden="true" className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/#newsletter"
                className="w-full inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-sport-orange/25"
              >
                {t('cta.primary')} <ArrowRight size={14} aria-hidden="true" />
              </Link>

              <Link href="/#tarifs" className="block text-center text-xs text-sport-gray hover:text-sport-fg transition-colors mt-3">
                {t('cta.pricing')}
              </Link>

              {/* Trust micro */}
              <div className="mt-5 pt-5 border-t border-sport-border flex justify-center gap-4 text-[10px] text-sport-gray">
                <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> {t('cta.noCard')}</span>
                <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> {t('cta.freeCancel')}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      {content?.faq && content.faq.length > 0 && (
        <section aria-labelledby="faq-disc-title" className="py-20 px-6 bg-sport-card border-t border-sport-border">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className={`text-[11px] font-bold tracking-[2px] uppercase mb-3 ${COLOR_TEXT[color]}`}>{t('faq.eyebrow')}</p>
              <h2 id="faq-disc-title" className="text-3xl md:text-4xl font-black text-sport-fg">
                {t('faq.title', { name: title })}
              </h2>
            </div>
            <DisciplineFAQSection items={content.faq} accentColor={COLOR_TEXT[color]} />
          </div>
        </section>
      )}

      {/* ── Other disciplines ─────────────────────────────────── */}
      <section aria-labelledby="autres-disciplines-title" className="py-16 px-6 bg-sport-dark border-t border-sport-border">
        <div className="max-w-5xl mx-auto">
          <h2 id="autres-disciplines-title" className="text-2xl font-black text-sport-fg mb-8">
            {t('others.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/disciplines/${other.slug}`}
                aria-label={t('others.cardAria', { name: other.title })}
                className="group relative h-44 rounded-2xl overflow-hidden border border-sport-border hover:border-sport-orange/50 transition-all hover:-translate-y-1"
              >
                <Image
                  src={DISC_PHOTOS[other.slug] ?? ''}
                  alt={t('others.alt', { name: other.title })}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm font-bold text-white">{other.title}</p>
                  <p className="text-[10px] text-white/55 mt-0.5">{other.tag}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
