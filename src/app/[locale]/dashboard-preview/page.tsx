import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PreviewDashboard } from '@/components/preview/PreviewDashboard'

// Rendu à la demande (pas de generateStaticParams) : cette page a le plus
// gros arbre de composants clients du site (anneaux SVG, graphiques,
// plusieurs animations framer-motion) et s'est révélée sujette à un échec
// silencieux de la génération statique - le build réussit mais fige la page
// sur son état "Chargement..." au lieu du contenu réel (reproduit localement,
// intermittent, cause probable Turbopack). En dynamique, chaque requête est
// rendue à neuf côté serveur - immunisé contre ce mode d'échec.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboardPreview' })
  return { title: t('metaTitle'), description: t('metaDescription') }
}

export default async function DashboardPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PreviewDashboard />
}
