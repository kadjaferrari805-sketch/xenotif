// Server-safe JSON-LD schema components — no hooks, pure rendering

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Xenotif®',
    url: 'https://xenotif.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://xenotif.com/og-image.jpg',
      width: 1200,
      height: 630,
    },
    description:
      'La plateforme fitness premium — 10 disciplines, coaching IA personnalisé, programmes guidés et garantie 30 jours.',
    sameAs: [
      'https://www.instagram.com/xenotif',
      'https://www.youtube.com/@xenotif',
      'https://www.tiktok.com/@xenotif',
      'https://twitter.com/xenotif',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'French',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Xenotif®',
    url: 'https://xenotif.com',
    description:
      'Plateforme fitness premium avec coaching IA, 10 disciplines sportives et boutique équipement.',
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://xenotif.com/boutique?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
