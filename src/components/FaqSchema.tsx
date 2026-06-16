import { getTranslations } from 'next-intl/server'

// JSON-LD FAQPage construit depuis les messages (home.faq.items) → résultats
// enrichis Google (accordéon de questions dans la SERP). Server component.
export async function FaqSchema() {
  const t = await getTranslations('home.faq')
  const items = t.raw('items') as { q: string; a: string }[]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
