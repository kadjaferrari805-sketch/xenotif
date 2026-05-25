import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, CheckCircle, Users, Zap,
  Activity, Dumbbell, Bike, Waves, Flame, Star,
} from 'lucide-react'
import { FEATURES } from '@/lib/constants'

const DISC_PHOTOS: Record<string, string> = {
  'running-cardio': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
  musculation: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  hiit: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  cyclisme: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
  natation: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80',
  crossfit: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
}

const DISC_ICONS: Record<string, React.ReactNode> = {
  running: <Activity size={20} aria-hidden="true" />,
  dumbbell: <Dumbbell size={20} aria-hidden="true" />,
  zap: <Zap size={20} aria-hidden="true" />,
  bike: <Bike size={20} aria-hidden="true" />,
  waves: <Waves size={20} aria-hidden="true" />,
  flame: <Flame size={20} aria-hidden="true" />,
}

const COLOR_TEXT: Record<string, string> = {
  orange: 'text-sport-orange',
  blue: 'text-sport-blue',
  lime: 'text-sport-lime',
}

const COLOR_CARD: Record<string, string> = {
  orange: 'bg-sport-orange/10 border-sport-orange/25',
  blue: 'bg-sport-blue/10 border-sport-blue/25',
  lime: 'bg-sport-lime/10 border-sport-lime/25',
}

const COLOR_PILL: Record<string, string> = {
  orange: 'bg-sport-orange text-white',
  blue: 'bg-sport-blue text-white',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

const COLOR_CTA: Record<string, string> = {
  orange: 'shadow-sport-orange/25',
  blue: 'shadow-sport-blue/25',
  lime: 'shadow-sport-lime/20',
}

/* Sample program structure per discipline */
const SAMPLE_PROGRAM: Record<string, { week: string; sessions: string[] }[]> = {
  'running-cardio': [
    { week: 'Semaine 1–2', sessions: ['Footing 30 min Z2', 'Côtes × 8 reps', 'Longue sortie 60 min'] },
    { week: 'Semaine 3–4', sessions: ['Intervalles 5×5 min', 'Récupération active', 'Sortie longue 75 min'] },
    { week: 'Semaine 5–6', sessions: ['Tempo 45 min', 'Fartlek 40 min', 'Course test 10K'] },
  ],
  musculation: [
    { week: 'Semaine 1–2', sessions: ['Push (poitrine / épaules)', 'Pull (dos / biceps)', 'Legs (cuisses / mollets)'] },
    { week: 'Semaine 3–4', sessions: ['Upper body force', 'Lower body hypertrophie', 'Full body AMRAP'] },
    { week: 'Semaine 5–6', sessions: ['Max force bilan', 'Déload actif', 'Test 1RM'] },
  ],
  hiit: [
    { week: 'Semaine 1–2', sessions: ['Tabata 4×4 min', 'Circuit 20 min AMRAP', 'Active recovery'] },
    { week: 'Semaine 3–4', sessions: ['EMOM 20 min', 'Chipper 30 min', 'Sprint pyramide'] },
    { week: 'Semaine 5–6', sessions: ['Death by Burpees', 'Partner WOD', 'Bilan cardio'] },
  ],
  cyclisme: [
    { week: 'Semaine 1–2', sessions: ['Endurance Z2 90 min', 'Intervals FTP ×5', 'Sortie récup 60 min'] },
    { week: 'Semaine 3–4', sessions: ['Sweet spot 2×20 min', 'Cadence drills', 'Gran fondo simulé'] },
    { week: 'Semaine 5–6', sessions: ['VO2max 4×8 min', 'Test FTP 20 min', 'Sortie longue 3h'] },
  ],
  natation: [
    { week: 'Semaine 1–2', sessions: ['Technique crawl 1 500 m', 'Dos crawlé drills', 'Endurance 2 000 m'] },
    { week: 'Semaine 3–4', sessions: ['Intervals 10×100 m', 'Brasse technique', 'Open water simulation'] },
    { week: 'Semaine 5–6', sessions: ['Sprint 50 m × 20', 'Tri transition swim', 'Test 1 500 m chrono'] },
  ],
  crossfit: [
    { week: 'Semaine 1–2', sessions: ['Skills : Snatch technique', 'WOD : Fran', 'Gymnastic : HSPU drills'] },
    { week: 'Semaine 3–4', sessions: ['WOD : Murph 50 %', 'Barbell cycling', 'WOD : Death by pull-ups'] },
    { week: 'Semaine 5–6', sessions: ['Benchmark : Grace', 'Open WOD simulation', 'Test max unbroken C2B'] },
  ],
}

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const discipline = FEATURES.find((f) => f.slug === slug)
  if (!discipline) return {}
  return {
    title: `${discipline.title} — Programmes & Coaching | Xenotif®`,
    description: discipline.description,
    openGraph: {
      title: `${discipline.title} — Xenotif®`,
      description: discipline.description,
      images: [DISC_PHOTOS[slug] ?? ''],
    },
  }
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const discipline = FEATURES.find((f) => f.slug === slug)
  if (!discipline) notFound()

  const photo = DISC_PHOTOS[slug] ?? ''
  const others = FEATURES.filter((f) => f.slug !== slug).slice(0, 3)
  const program = SAMPLE_PROGRAM[slug] ?? []

  return (
    <div className="min-h-screen bg-sport-dark text-white">

      {/* ── Hero ── */}
      <section
        className="relative h-[65vh] min-h-[440px] overflow-hidden"
        aria-label={`Discipline ${discipline.title}`}
      >
        <Image
          src={photo}
          alt={`Athlète pratiquant ${discipline.title}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/55 to-black/30" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14">
          <div className="max-w-4xl mx-auto w-full">
            <Link
              href="/#disciplines"
              className="inline-flex items-center gap-1.5 text-white/60 text-sm mb-8 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} aria-hidden="true" /> Retour aux disciplines
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${COLOR_PILL[discipline.color]}`}>
                {discipline.tag}
              </span>
              <div className="flex gap-0.5" aria-label="Note 5 étoiles">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} aria-hidden="true" className="fill-sport-orange text-sport-orange" />
                ))}
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
              {discipline.title}
            </h1>
            <p className="text-white/75 text-base max-w-xl leading-relaxed">
              {discipline.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section
        aria-label="Chiffres clés"
        className="bg-sport-card border-y border-sport-border py-6 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <ul className="flex flex-wrap gap-6 justify-center md:justify-start">
            {discipline.stats.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <CheckCircle
                  size={15}
                  aria-hidden="true"
                  className={COLOR_TEXT[discipline.color]}
                />
                <span className="text-sm font-semibold text-white">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-12">

          {/* Left — Levels + Program */}
          <div className="md:col-span-3 space-y-12">

            {/* Levels */}
            <div>
              <h2 className={`text-2xl font-black text-white mb-6 flex items-center gap-2 ${COLOR_TEXT[discipline.color]}`}>
                <span aria-hidden="true">{DISC_ICONS[discipline.icon]}</span>
                <span className="text-white">Niveaux disponibles</span>
              </h2>
              <ul className="space-y-3">
                {discipline.levels.map((level, i) => (
                  <li
                    key={level}
                    className={`flex items-center justify-between border rounded-xl px-5 py-4 ${COLOR_CARD[discipline.color]}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${COLOR_PILL[discipline.color]}`}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{level}</span>
                    </div>
                    <Link
                      href="/#newsletter"
                      aria-label={`Rejoindre le programme ${level}`}
                      className={`text-xs font-bold hover:underline flex items-center gap-1 ${COLOR_TEXT[discipline.color]}`}
                    >
                      Rejoindre <ArrowRight size={11} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample program */}
            {program.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  <Zap size={20} aria-hidden="true" className={COLOR_TEXT[discipline.color]} />
                  Aperçu du programme
                </h2>
                <div className="space-y-4">
                  {program.map((block) => (
                    <div key={block.week} className="bg-sport-card border border-sport-border rounded-xl p-5">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${COLOR_TEXT[discipline.color]}`}>
                        {block.week}
                      </p>
                      <ul className="space-y-2">
                        {block.sessions.map((session) => (
                          <li key={session} className="flex items-start gap-2 text-xs text-sport-gray">
                            <CheckCircle
                              size={13}
                              aria-hidden="true"
                              className={`mt-0.5 shrink-0 ${COLOR_TEXT[discipline.color]}`}
                            />
                            {session}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-sport-gray mt-4">
                  * Programme indicatif — personnalisé par notre IA selon ton profil.
                </p>
              </div>
            )}
          </div>

          {/* Right — CTA card */}
          <aside className="md:col-span-2" aria-label="Rejoindre ce programme">
            <div className="sticky top-24 bg-sport-card border border-sport-border rounded-2xl p-7">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${COLOR_CARD[discipline.color]}`}>
                <span className={COLOR_TEXT[discipline.color]} aria-hidden="true">
                  {DISC_ICONS[discipline.icon]}
                </span>
              </div>

              <h2 className="text-lg font-black text-white mb-2">Rejoins la communauté</h2>
              <p className="text-sport-gray text-xs leading-relaxed mb-6">
                Accède à tous les programmes <strong className="text-white">{discipline.title}</strong>,
                coaching IA personnalisé et rejoins des milliers d&apos;athlètes motivés.
              </p>

              <ul className="space-y-2 mb-7">
                {['Programmes illimités', 'Coaching IA personnalisé', 'Communauté active', '30 j satisfait ou remboursé'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-sport-gray">
                    <CheckCircle size={13} aria-hidden="true" className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/#newsletter"
                className={`w-full inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg ${COLOR_CTA[discipline.color]}`}
              >
                Commencer gratuitement <ArrowRight size={14} aria-hidden="true" />
              </Link>

              <Link
                href="/#tarifs"
                className="block text-center text-xs text-sport-gray hover:text-white transition-colors mt-3"
              >
                Voir les tarifs →
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* ── Other disciplines ── */}
      <section
        aria-labelledby="autres-disciplines-title"
        className="py-16 px-6 bg-sport-card border-t border-sport-border"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="autres-disciplines-title" className="text-xl font-black text-white mb-8">
            Autres disciplines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/disciplines/${other.slug}`}
                aria-label={`Découvrir la discipline ${other.title}`}
                className="group relative h-40 rounded-2xl overflow-hidden border border-sport-border hover:border-sport-orange/50 transition-all"
              >
                <Image
                  src={DISC_PHOTOS[other.slug] ?? ''}
                  alt={`Discipline ${other.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/30 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-sm font-bold text-white">{other.title}</p>
                  <p className="text-[10px] text-sport-gray">{other.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
