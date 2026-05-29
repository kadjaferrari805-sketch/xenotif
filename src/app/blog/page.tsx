import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getPostsByCategory } from '@/lib/blog/posts'
import type { BlogPost } from '@/lib/blog/posts'

export const metadata: Metadata = {
  title: 'Blog Fitness — Conseils, Guides & Comparatifs | Xenotif®',
  description:
    'Conseils fitness experts, guides nutritionnels, comparatifs matériel et programmes d\'entraînement. Tout ce qu\'il faut savoir pour progresser, rédigé par des experts Xenotif®.',
  keywords: [
    'blog fitness',
    'conseils musculation',
    'nutrition sportive',
    'programme running',
    'guide HIIT',
    'récupération musculaire',
    'comparatif matériel fitness',
  ],
  alternates: { canonical: 'https://xenotif.vercel.app/blog' },
  openGraph: {
    title: 'Blog Fitness — Conseils, Guides & Comparatifs | Xenotif®',
    description:
      'Conseils fitness experts, guides nutritionnels, comparatifs matériel. Progressez plus vite avec Xenotif®.',
    url: 'https://xenotif.vercel.app/blog',
    type: 'website',
  },
}

const CATEGORIES: Array<{ label: string; value: BlogPost['category'] | 'Tous' }> = [
  { label: 'Tous', value: 'Tous' },
  { label: 'Musculation', value: 'Musculation' },
  { label: 'Nutrition', value: 'Nutrition' },
  { label: 'Running', value: 'Running' },
  { label: 'HIIT', value: 'HIIT' },
  { label: 'Récupération', value: 'Récupération' },
  { label: 'Matériel', value: 'Matériel' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-sport-orange/10 text-sport-orange border-sport-orange/20',
  Nutrition: 'bg-green-500/10 text-green-400 border-green-500/20',
  Running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HIIT: 'bg-red-500/10 text-red-400 border-red-500/20',
  Récupération: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Matériel: 'bg-sport-lime/10 text-sport-lime border-sport-lime/20',
}

function formatDateFR(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ArticleCard({ post }: { post: BlogPost }) {
  const colorClass =
    CATEGORY_COLORS[post.category] ?? 'bg-sport-orange/10 text-sport-orange border-sport-orange/20'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:border-sport-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sport-orange/5"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/80 via-transparent to-transparent" />
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${colorClass}`}
        >
          {post.category}
        </span>
      </div>

      <div className="p-5">
        <h2 className="font-black text-white text-lg leading-snug mb-2 group-hover:text-sport-orange transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sport-gray text-sm leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-sport-gray border-t border-sport-border pt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sport-orange/20 flex items-center justify-center text-sport-orange font-black text-xs">
              {post.author.charAt(0)}
            </div>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{formatDateFR(post.publishedAt)}</span>
            <span className="text-sport-orange">•</span>
            <span>{post.readingMinutes} min</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const VALID_CATEGORIES: BlogPost['category'][] = [
  'Musculation',
  'Nutrition',
  'Running',
  'Récupération',
  'Matériel',
  'HIIT',
]

function isValidCategory(value: string): value is BlogPost['category'] {
  return (VALID_CATEGORIES as string[]).includes(value)
}

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { categorie?: string }
}) {
  const raw = searchParams?.categorie
  const activeCategory: BlogPost['category'] | undefined =
    raw && isValidCategory(raw) ? raw : undefined

  const posts = activeCategory ? getPostsByCategory(activeCategory) : getAllPosts()

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sport-border py-20 px-6">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, #FF4500 0%, transparent 50%), radial-gradient(circle at 70% 50%, #A3FF00 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-sport-orange font-bold text-sm uppercase tracking-widest mb-4">
            Le Blog Xenotif®
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Conseils Fitness{' '}
            <span className="text-sport-orange">par des Experts</span>
          </h1>
          <p className="text-sport-gray text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Guides techniques, programmes d&apos;entraînement, nutrition scientifique et comparatifs
            matériel. Tout ce qu&apos;il faut pour progresser plus vite.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-sport-gray">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sport-lime" />
              {getAllPosts().length} articles
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sport-orange" />
              Experts vérifiés
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Mis à jour 2026
            </span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-sport-dark/90 backdrop-blur-lg border-b border-sport-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => {
              const isActive =
                cat.value === 'Tous'
                  ? !activeCategory
                  : activeCategory === cat.value

              const href =
                cat.value === 'Tous' ? '/blog' : `/blog?categorie=${encodeURIComponent(cat.value)}`

              return (
                <Link
                  key={cat.value}
                  href={href}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-sport-orange text-white shadow-lg shadow-sport-orange/20'
                      : 'bg-sport-card border border-sport-border text-sport-gray hover:text-white hover:border-sport-orange/30'
                  }`}
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        {activeCategory && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-white">
              {posts.length} article{posts.length > 1 ? 's' : ''} en{' '}
              <span className="text-sport-orange">{activeCategory}</span>
            </h2>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 text-sport-gray">
            <p className="text-xl font-semibold">Aucun article dans cette catégorie.</p>
            <Link href="/blog" className="mt-4 inline-block text-sport-orange hover:underline">
              Voir tous les articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-sport-border py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Prêt à{' '}
            <span className="text-sport-orange">Passer à l&apos;Action ?</span>
          </h2>
          <p className="text-sport-gray mb-8">
            Les conseils théoriques c&apos;est bien, un programme structuré par des experts c&apos;est mieux.
            Rejoignez les 12 000+ athlètes Xenotif®.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique"
              className="px-8 py-3 bg-sport-orange text-white rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-sport-orange/20"
            >
              Voir la Boutique
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 border border-sport-border text-white rounded-full font-bold hover:border-sport-orange/40 transition-all"
            >
              Rejoindre Xenotif®
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
