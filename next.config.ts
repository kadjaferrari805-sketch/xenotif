import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',    value: 'on' },
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://img.youtube.com https://i.ytimg.com https://m.media-amazon.com https://images-eu.ssl-images-amazon.com https://images-na.ssl-images-amazon.com https://ws-eu.amazon-adsystem.com https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com",
      "frame-src https://www.youtube.com https://js.stripe.com https://hooks.stripe.com",
      "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.stripe.com https://firestore.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://connect.facebook.net https://www.facebook.com",
      "media-src 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  // next-intl et toute sa chaîne de dépendances ESM doivent être transpilés
  // pour Jest (next/jest n'autorise que `transpilePackages` à transformer node_modules).
  transpilePackages: [
    'next-intl',
    'use-intl',
    'intl-messageformat',
    'icu-minify',
    '@schummar/icu-type-parser',
    '@formatjs/fast-memoize',
    '@formatjs/icu-messageformat-parser',
    '@formatjs/icu-skeleton-parser',
    '@formatjs/intl-localematcher',
  ],
  images: {
    // AVIF (plus léger que WebP) → meilleur LCP. Next sert WebP en repli.
    formats: ['image/avif', 'image/webp'],
    // Next 16 : la liste par défaut est [75]. Sans 90, le quality={90} des bandeaux
    // serait ramené à 75 (bandeaux moins nets). On autorise explicitement 90.
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      // Amazon product images
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-eu.ssl-images-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      { protocol: 'https', hostname: 'ws-eu.amazon-adsystem.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
export default withNextIntl(nextConfig)
