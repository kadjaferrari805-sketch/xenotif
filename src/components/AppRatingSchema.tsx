import { getTranslations } from 'next-intl/server'

// SoftwareApplication + aggregateRating reflétant EXACTEMENT le résumé de note
// affiché dans la section Avis de l'accueil (home.reviews.summary). Conforme aux
// règles Google : la note agrège des avis réellement visibles sur la page, et
// porte sur l'app (type accepté), pas sur l'Organisation. Émis uniquement si les
// valeurs sont numériquement valides. Server component + i18n statique → n'affecte
// pas le rendu CDN de l'accueil.
export async function AppRatingSchema() {
  const t = await getTranslations('home.reviews.summary')
  // "4.9 / 5" → 4.9 ; "3 200+" / "3,200+" / "3.200+" → 3200
  const ratingValue = parseFloat(String(t('rating')).split('/')[0].replace(',', '.').trim())
  const reviewCount = parseInt(String(t('count')).replace(/[^\d]/g, ''), 10)
  if (!Number.isFinite(ratingValue) || !Number.isInteger(reviewCount) || reviewCount <= 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Xenotif®',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    url: 'https://xenotif.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      bestRating: 5,
      worstRating: 1,
      reviewCount,
    },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}
