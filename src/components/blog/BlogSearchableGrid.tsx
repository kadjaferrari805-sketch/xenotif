'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, X } from 'lucide-react'
import { Tilt3D } from '@/components/premium/Tilt3D'
import type { BlogPost } from '@/lib/blog/posts'

// Grille d'articles avec recherche instantanée (titre / extrait / catégorie).
// Rendue côté client MAIS aussi pré-rendue côté serveur par Next (App Router) :
// au chargement initial (requête vide), TOUS les articles sont dans le HTML →
// le SEO est préservé, la recherche est une amélioration progressive.
const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-sport-orange/10 text-sport-orange border-sport-orange/20',
  Nutrition: 'bg-green-500/10 text-green-400 border-green-500/20',
  Running: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  HIIT: 'bg-red-500/10 text-red-400 border-red-500/20',
  Récupération: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Matériel: 'bg-sport-lime/10 text-sport-lime border-sport-lime/20',
}

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : 'fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function BlogSearchableGrid({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations('blog')
  const locale = useLocale()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      t(`categories.${p.category}`).toLowerCase().includes(q),
    )
  }, [query, posts, t])

  return (
    <div>
      {/* Champ de recherche */}
      <div className="relative mb-8 max-w-md">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sport-gray" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="w-full rounded-full border border-sport-border bg-sport-card py-3 pl-11 pr-10 text-sm text-white placeholder:text-sport-gray focus:border-sport-orange/60 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={t('searchClear')}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-sport-gray hover:text-white transition-colors"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sport-gray">
          <p className="text-lg font-semibold">{t('searchNoResults', { query })}</p>
          <button type="button" onClick={() => setQuery('')} className="mt-3 text-sport-orange hover:underline">
            {t('seeAll')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const colorClass = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Musculation
            return (
              <Tilt3D key={post.slug} max={13} className="relative h-full rounded-2xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:border-sport-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-sport-orange/5"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: post.coverPosition }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/80 via-transparent to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${colorClass}`}>
                      {t(`categories.${post.category}`)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-black text-white text-lg leading-snug mb-2 group-hover:text-sport-orange transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-sport-gray text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-sport-gray border-t border-sport-border pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sport-orange/20 flex items-center justify-center text-sport-orange font-black text-xs">{post.author.charAt(0)}</div>
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{formatDate(post.publishedAt, locale)}</span>
                        <span className="text-sport-orange">•</span>
                        <span>{t('readingTime', { minutes: post.readingMinutes })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Tilt3D>
            )
          })}
        </div>
      )}
    </div>
  )
}
