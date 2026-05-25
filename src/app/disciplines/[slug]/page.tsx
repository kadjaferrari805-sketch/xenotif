import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, CheckCircle, Zap,
  Activity, Dumbbell, Bike, Waves, Flame, Star,
  Play, BookOpen, Target, ChevronDown, ChevronUp,
} from 'lucide-react'
import { FEATURES } from '@/lib/constants'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { VideoCard } from '@/components/disciplines/VideoCard'
import { DisciplineFAQSection } from '@/components/disciplines/DisciplineFAQ'

/* ── Static data ─────────────────────────────────────────────── */

const DISC_PHOTOS: Record<string, string> = {
  'running-cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80',
  musculation:      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1920&q=80',
  hiit:             'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80',
  cyclisme:         'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1920&q=80',
  natation:         'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1920&q=80',
  crossfit:         'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1920&q=80',
}

const DISC_ICONS: Record<string, React.ReactNode> = {
  running:  <Activity size={20} aria-hidden="true" />,
  dumbbell: <Dumbbell size={20} aria-hidden="true" />,
  zap:      <Zap size={20} aria-hidden="true" />,
  bike:     <Bike size={20} aria-hidden="true" />,
  waves:    <Waves size={20} aria-hidden="true" />,
  flame:    <Flame size={20} aria-hidden="true" />,
}

const COLOR_TEXT:  Record<string, string> = { orange: 'text-sport-orange',    blue: 'text-sport-blue',   lime: 'text-sport-lime' }
const COLOR_CARD:  Record<string, string> = { orange: 'bg-sport-orange/10 border-sport-orange/25', blue: 'bg-sport-blue/10 border-sport-blue/25', lime: 'bg-sport-lime/10 border-sport-lime/25' }
const COLOR_PILL:  Record<string, string> = { orange: 'bg-sport-orange text-white', blue: 'bg-sport-blue text-white', lime: 'bg-sport-lime text-[#0A0B0F]' }
const COLOR_VIDEO: Record<string, string> = { orange: 'bg-sport-orange/15 text-sport-orange', blue: 'bg-sport-blue/15 text-sport-blue', lime: 'bg-sport-lime/15 text-sport-lime' }

/* ── Metadata ────────────────────────────────────────────────── */
export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const discipline = FEATURES.find((f) => f.slug === slug)
  if (!discipline) return {}
  const content = DISCIPLINE_CONTENT[slug]
  return {
    title: `${discipline.title} — Guide complet & Programmes | Xenotif®`,
    description: content?.tagline ?? discipline.description,
    openGraph: {
      title: `${discipline.title} — Xenotif®`,
      description: content?.tagline ?? discipline.description,
      images: [DISC_PHOTOS[slug] ?? ''],
    },
  }
}

/* ── Page ────────────────────────────────────────────────────── */
export default async function DisciplinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const discipline = FEATURES.find((f) => f.slug === slug)
  if (!discipline) notFound()

  const photo  = DISC_PHOTOS[slug] ?? ''
  const others = FEATURES.filter((f) => f.slug !== slug).slice(0, 3)
  const content = DISCIPLINE_CONTENT[slug]
  const color   = discipline.color

  return (
    <div className="min-h-screen bg-sport-dark text-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] overflow-hidden" aria-label={`Discipline ${discipline.title}`}>
        <Image src={photo} alt={`Athlète pratiquant ${discipline.title}`} fill sizes="100vw" className="object-cover" priority />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/60 to-black/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16">
          <div className="max-w-5xl mx-auto w-full">
            <Link href="/#disciplines" className="inline-flex items-center gap-1.5 text-white/55 text-sm mb-10 hover:text-white transition-colors">
              <ArrowLeft size={14} aria-hidden="true" /> Retour aux disciplines
            </Link>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${COLOR_PILL[color]}`}>
                {discipline.tag}
              </span>
              <div className="flex gap-0.5" aria-label="Note 5 étoiles">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} aria-hidden="true" className="fill-sport-orange text-sport-orange" />)}
              </div>
              {content && (
                <span className="text-[11px] text-white/60 font-medium">{content.heroStat}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-black leading-none mb-4 tracking-tight">
              {discipline.title}
            </h1>

            {/* Tagline */}
            {content && (
              <p className={`text-lg md:text-xl font-bold mb-4 ${COLOR_TEXT[color]}`}>
                {content.tagline}
              </p>
            )}
            <p className="text-white/65 text-sm max-w-lg leading-relaxed">{discipline.description}</p>

            {/* Quick stats from discipline */}
            <div className="flex flex-wrap gap-5 mt-6">
              {discipline.stats.map((s) => (
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
              <p className={`text-[11px] font-bold tracking-[2px] uppercase ${COLOR_TEXT[color]}`}>Vidéos & Tutoriels</p>
            </div>
            <h2 id="videos-title" className="text-3xl md:text-4xl font-black text-white mb-2">
              Apprends avec les meilleurs
            </h2>
            <p className="text-sport-gray text-sm mb-10 max-w-xl">
              Tutoriels techniques, séances guidées et conseils d&apos;experts — clique pour lancer une vidéo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.videos.map((video) => (
                <VideoCard
                  key={video.youtubeId}
                  youtubeId={video.youtubeId}
                  title={video.title}
                  description={video.description}
                  duration={video.duration}
                  level={video.level}
                  thumbnail={video.thumbnail}
                  accentColor={COLOR_VIDEO[color]}
                />
              ))}
            </div>
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
              <p className={`text-[11px] font-bold tracking-[2px] uppercase ${COLOR_TEXT[color]}`}>Guide Expert</p>
            </div>
            <h2 id="guide-title" className="text-3xl md:text-4xl font-black text-white mb-10">
              Tout ce qu&apos;il faut savoir
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
              <p className={`text-[11px] font-bold tracking-[2px] uppercase mb-3 ${COLOR_TEXT[color]}`}>Conseils d&apos;experts</p>
              <h2 id="tips-title" className="text-3xl md:text-4xl font-black text-white">
                Les secrets des pros
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

      {/* ── Programme détaillé + CTA ─────────────────────────── */}
      <section className="py-20 px-6 bg-sport-dark">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">

          {/* Left — Levels + Program */}
          <div className="md:col-span-3 space-y-12">

            {/* Levels */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span aria-hidden="true" className={COLOR_TEXT[color]}>{DISC_ICONS[discipline.icon]}</span>
                <h2 className="text-2xl font-black text-white">Niveaux disponibles</h2>
              </div>
              <ul className="space-y-3">
                {discipline.levels.map((level, i) => (
                  <li key={level} className={`flex items-center justify-between border rounded-xl px-5 py-4 ${COLOR_CARD[color]}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${COLOR_PILL[color]}`} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{level}</span>
                    </div>
                    <Link
                      href="/#newsletter"
                      aria-label={`Rejoindre le programme ${level}`}
                      className={`text-xs font-bold hover:underline flex items-center gap-1 ${COLOR_TEXT[color]}`}
                    >
                      Rejoindre <ArrowRight size={11} aria-hidden="true" />
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
                  <h2 className="text-2xl font-black text-white">Programme 8 semaines</h2>
                </div>

                <div className="space-y-4">
                  {content.program.map((block, bi) => (
                    <div key={block.week} className="bg-sport-card border border-sport-border rounded-xl overflow-hidden">
                      {/* Week header */}
                      <div className={`px-5 py-3 border-b border-sport-border flex items-center justify-between`}>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${COLOR_TEXT[color]}`}>{block.week}</p>
                          <p className="text-sm font-bold text-white">{block.theme}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${COLOR_CARD[color]} ${COLOR_TEXT[color]}`}>
                          Phase {bi + 1}
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
                              <p className="text-sm font-bold text-white">{session.name}</p>
                              <p className="text-xs text-sport-gray mt-0.5 leading-relaxed">{session.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-sport-gray mt-4">
                  * Programme personnalisé par l&apos;IA Xenotif® selon ton profil, ton niveau et tes objectifs.
                </p>
              </div>
            )}
          </div>

          {/* Right — Sticky CTA */}
          <aside className="md:col-span-2" aria-label="Rejoindre ce programme">
            <div className="sticky top-24 bg-sport-card border border-sport-border rounded-2xl p-7">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${COLOR_CARD[color]}`}>
                <span className={COLOR_TEXT[color]} aria-hidden="true">{DISC_ICONS[discipline.icon]}</span>
              </div>

              <h2 className="text-lg font-black text-white mb-2">Rejoins la communauté</h2>
              <p className="text-sport-gray text-xs leading-relaxed mb-6">
                Accède aux programmes <strong className="text-white">{discipline.title}</strong>, au coaching IA personnalisé et à des milliers d&apos;athlètes motivés.
              </p>

              <ul className="space-y-2.5 mb-7">
                {[
                  'Guide complet + vidéos HD',
                  'Programme personnalisé IA',
                  'Suivi de progression avancé',
                  'Communauté de coaches',
                  '30 j satisfait ou remboursé',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-sport-gray">
                    <CheckCircle size={13} aria-hidden="true" className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/#newsletter"
                className={`w-full inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-sport-orange/25`}
              >
                Commencer gratuitement <ArrowRight size={14} aria-hidden="true" />
              </Link>

              <Link href="/#tarifs" className="block text-center text-xs text-sport-gray hover:text-white transition-colors mt-3">
                Voir les tarifs →
              </Link>

              {/* Trust micro */}
              <div className="mt-5 pt-5 border-t border-sport-border flex justify-center gap-4 text-[10px] text-sport-gray">
                <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> Sans CB requise</span>
                <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> Annulation libre</span>
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
              <p className={`text-[11px] font-bold tracking-[2px] uppercase mb-3 ${COLOR_TEXT[color]}`}>Questions fréquentes</p>
              <h2 id="faq-disc-title" className="text-3xl md:text-4xl font-black text-white">
                Tout sur {discipline.title}
              </h2>
            </div>
            <DisciplineFAQSection items={content.faq} accentColor={COLOR_TEXT[color]} />
          </div>
        </section>
      )}

      {/* ── Other disciplines ─────────────────────────────────── */}
      <section aria-labelledby="autres-disciplines-title" className="py-16 px-6 bg-sport-dark border-t border-sport-border">
        <div className="max-w-5xl mx-auto">
          <h2 id="autres-disciplines-title" className="text-2xl font-black text-white mb-8">
            Explore d&apos;autres disciplines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/disciplines/${other.slug}`}
                aria-label={`Découvrir la discipline ${other.title}`}
                className="group relative h-44 rounded-2xl overflow-hidden border border-sport-border hover:border-sport-orange/50 transition-all hover:-translate-y-1"
              >
                <Image
                  src={DISC_PHOTOS[other.slug] ?? ''}
                  alt={`Discipline ${other.title}`}
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
