import type { Metadata } from 'next'
import { CartButton } from '@/components/boutique/CartButton'

// Métadonnées par défaut du segment /boutique (la page liste est un composant
// client → elle ne peut pas exporter de metadata). Les fiches produit et la
// page succès définissent les leurs et écrasent celles-ci.
export const metadata: Metadata = {
  title: 'Boutique — Équipements, Suppléments & Programmes Fitness',
  description: 'La boutique Xenotif® : équipements de sport, suppléments éprouvés, montres connectées et programmes digitaux créés par nos coachs certifiés. Livraison rapide, paiement sécurisé.',
  alternates: { canonical: 'https://xenotif.com/boutique' },
  openGraph: {
    title: 'Boutique Xenotif® — Équipements, Suppléments & Programmes',
    description: 'Équipements pro, suppléments éprouvés et programmes digitaux créés par nos coachs certifiés.',
    url: 'https://xenotif.com/boutique',
    type: 'website',
  },
}

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartButton />
    </>
  )
}
