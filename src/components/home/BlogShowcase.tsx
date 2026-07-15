'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Carousel } from '@/components/ui/Carousel'
import { Tilt3D } from '@/components/premium/Tilt3D'
import type { BlogPost } from '@/lib/blog/posts'

// Carrousel « Conseils Fitness » sur l'accueil : met en avant les derniers
// articles du blog → trafic SEO interne + temps passé. Réutilise Carousel
// (3D + swipe + flèches), Tilt3D, SectionHeader. Les posts (déjà localisés et
// triés par date) arrivent en props depuis la page serveur.
const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-sport-orange/10 text-sport-orange border-sport-orange/20',
  Nutrition: 'bg-green-50 text-[#1E7F5A] border-green-200',
  Running: 'bg-blue-50 text-blue-600 border-blue-200',
  HIIT: 'bg-red-50 text-red-600 border-red-200',
  Récupération: 'bg-purple-50 text-purple-600 border-purple-200',
  Matériel: 'bg-sport-lime/10 text-sport-lime border-sport-lime/20',
}

function formatDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : 'fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function BlogShowcase({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations('home.blog')
  const tb = useTranslations('blog')
  const locale = useLocale()
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="home-blog" className="px-6 py-20 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader id="home-blog" label={t('label')} title={t('title')} subtitle={t('subtitle')} />

        <Carousel className="mt-12">
          {posts.map((post) => {
            const colorClass = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Musculation
            return (
              <div key={post.slug} className="mr-5 w-[280px] shrink-0 sm:w-[320px]">
                <Tilt3D max={12} className="relative rounded-2xl h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden card-base transition-all duration-300 hover:border-sport-orange/30 hover:shadow-xl hover:shadow-sport-orange/5"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 80vw, 320px"
                        style={{ objectPosition: post.coverPosition }}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full border ${colorClass}`}>
                        {tb(`categories.${post.category}`)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-black text-sport-fg text-base leading-snug mb-2 line-clamp-2 group-hover:text-sport-orange transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sport-gray text-xs leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between text-[11px] text-sport-gray border-t border-sport-border pt-3">
                        <span>{formatDate(post.publishedAt, locale)}</span>
                        <span className="inline-flex items-center gap-1 font-bold text-sport-orange group-hover:gap-1.5 transition-all">
                          {t('readMore')} <ArrowRight size={12} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Tilt3D>
              </div>
            )
          })}
        </Carousel>

        <div className="mt-10 text-center">
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            {t('viewAll')} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
