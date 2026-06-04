import type { MetadataRoute } from 'next'

// Manifest PWA — rend Xenotif installable sur mobile (« Ajouter à l'écran d'accueil »).
// Servi sur /manifest.webmanifest et référencé via la metadata du layout.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Xenotif® — Coaching fitness premium',
    short_name: 'Xenotif',
    description:
      "La plateforme fitness premium : programmes guidés, coaching IA personnalisé et suivi d'activité en temps réel.",
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0A0B0F',
    theme_color: '#0A0B0F',
    lang: 'fr',
    categories: ['health', 'fitness', 'sports', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
