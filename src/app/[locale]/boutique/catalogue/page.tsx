import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Catalogue } from '@/components/boutique/Catalogue'

const SITE = 'https://xenotif.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'boutique' })
  const languages: Record<string, string> = {
    fr: `${SITE}/boutique/catalogue`,
    en: `${SITE}/en/boutique/catalogue`,
    de: `${SITE}/de/boutique/catalogue`,
    'x-default': `${SITE}/boutique/catalogue`,
  }
  return {
    title: t('catalogue.metaTitle'),
    description: t('catalogue.metaDescription'),
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: t('catalogue.metaTitle'),
      description: t('catalogue.metaDescription'),
      url: languages[locale] ?? languages.fr,
      type: 'website',
    },
  }
}

export default function CataloguePage() {
  return <Catalogue />
}
