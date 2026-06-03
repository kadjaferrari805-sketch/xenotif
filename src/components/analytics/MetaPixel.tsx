'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// Meta Pixel (Facebook/Instagram Ads). Le Pixel ID vient de la variable
// d'environnement NEXT_PUBLIC_META_PIXEL_ID. Sans valeur → le composant ne
// charge rien (aucun impact en dev/local tant que l'ID n'est pas défini).
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export function MetaPixel() {
  const pathname = usePathname()
  const initialized = useRef(false)

  // PageView sur les navigations SPA (le 1er PageView est envoyé par le script d'init).
  useEffect(() => {
    if (!PIXEL_ID) return
    if (!initialized.current) {
      initialized.current = true
      return
    }
    const w = window as unknown as { fbq?: (...args: unknown[]) => void }
    w.fbq?.('track', 'PageView')
  }, [pathname])

  if (!PIXEL_ID) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
