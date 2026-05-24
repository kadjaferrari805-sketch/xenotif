import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CheckCircle, Users, Zap } from 'lucide-react'
import { FEATURES } from '@/lib/constants'

const DISC_PHOTOS: Record<string, string> = {
  'running-cardio':
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
  musculation:
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
  hiit: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  cyclisme:
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
  natation:
    'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80',
  crossfit:
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
}

const COLOR_ACCENT: Record<string, string> = {
  orange: 'text-sport-orange',
  blue: 'text-sport-blue',
  lime: 'text-sport-lime',
}

const COLOR_BG: Record<string, string> = {
  orange: 'bg-sport-orange/15 border-sport-orange/30',
  blue: 'bg-sport-blue/15 border-sport-blue/30',
  lime: 'bg-sport-lime/10 border-sport-lime/30',
}

const COLOR_PILL: Record<string, string> = {
  orange: 'bg-sport-orange text-white',
  blue: 'bg-sport-blue text-white',
  lime: 'bg-sport-lime text-[#0A0B0F]',
}

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }))
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

  return (
    <main className="min-h-screen bg-sport-dark text-white">

      {/* ── Hero ── */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={photo}
          alt={discipline.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
          <div className="max-w-4xl mx-auto w-full">
            <Link
              href="/#disciplines"
              className="inline-flex items-center gap-1.5 text-sport-gray text-sm mb-6 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Retour aux disciplines
            </Link>
            <span
              className={`inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3 ${COLOR_PILL[discipline.color]}`}
            >
              {discipline.tag}
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-none mb-4">
              {discipline.title}
            </h1>
            <p className="text-sport-gray text-base max-w-xl leading-relaxed">
              {discipline.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-sport-card border-y border-sport-border py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-8 justify-center md:justify-start">
          {discipline.stats.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <CheckCircle size={16} className={COLOR_ACCENT[discipline.color]} />
              <span className="text-sm font-semibold text-white">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">

          {/* Levels */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Zap size={20} className={COLOR_ACCENT[discipline.color]} />
              Niveaux disponibles
            </h2>
            <div className="space-y-3">
              {discipline.levels.map((level, i) => (
                <div
                  key={level}
                  className={`flex items-center justify-between border rounded-xl px-5 py-4 ${COLOR_BG[discipline.color]}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-lg ${COLOR_ACCENT[discipline.color]}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{level}</span>
                  </div>
                  <Link
                    href="/#newsletter"
                    className="text-xs font-bold text-sport-orange hover:underline flex items-center gap-1"
                  >
                    Rejoindre <ArrowRight size={11} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <Users size={20} className={COLOR_ACCENT[discipline.color]} />
              Rejoins la communauté
            </h2>
            <div className="bg-sport-card border border-sport-border rounded-2xl p-7">
              <p className="text-sport-gray text-sm leading-relaxed mb-6">
                Accède à tous les programmes {discipline.title}, coaching IA personnalisé
                et rejoins des milliers d&apos;athlètes motivés comme toi.
              </p>
              <Link
                href="/#newsletter"
                className="w-full inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all"
              >
                Commencer gratuitement <ArrowRight size={14} />
              </Link>
              <p className="text-[11px] text-sport-gray mt-3 text-center">
                Sans engagement · 30 jours satisfait ou remboursé
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other disciplines ── */}
      <section className="py-16 px-6 bg-sport-card border-t border-sport-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-white mb-8">Autres disciplines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/disciplines/${other.slug}`}
                className="group relative h-36 rounded-2xl overflow-hidden border border-sport-border hover:border-sport-orange/50 transition-all"
              >
                <Image
                  src={DISC_PHOTOS[other.slug] ?? ''}
                  alt={other.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/30 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-sm font-bold text-white">{other.title}</p>
                  <p className="text-[10px] text-sport-gray">{other.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
