import type { Metadata } from 'next'
import { AppInstall } from '@/components/AppInstall'

// Page d'atterrissage du QR code (install PWA). Hors index : page utilitaire.
export const metadata: Metadata = {
  title: "Installer l'app Xenotif",
  robots: { index: false, follow: true },
}

export default function AppInstallPage() {
  return <AppInstall />
}
