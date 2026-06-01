import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CartButton } from '@/components/boutique/CartButton'

const SITE = 'https://xenotif.com'

// Métadonnées par défaut du segment /boutique (la page liste est un composant
// client → elle ne peut pas exporter de metadata). Les fiches produit et la
// page succès définissent les leurs et écrasent celles-ci.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'boutique' })
  const languages: Record<string, string> = {
    fr: `${SITE}/boutique`,
    en: `${SITE}/en/boutique`,
    'x-default': `${SITE}/boutique`,
  }
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: languages[locale] ?? languages.fr, languages },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: languages[locale] ?? languages.fr,
      type: 'website',
    },
  }
}

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartButton />
    </>
  )
}
