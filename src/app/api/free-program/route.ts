import { NextRequest, NextResponse } from 'next/server'
import { getFreeProgram } from '@/lib/lead-magnet'
import { generateGuidePdf } from '@/lib/boutique/guide-pdf'
import {
  clientIp,
  enforceRateLimit,
  retryAfterHeaders,
  tooManyRequestsBody,
} from '@/lib/security/rate-limit'
import { getRateLimitStore } from '@/lib/security/rate-limit-store'

export const runtime = 'nodejs'

/**
 * Limitation (05-K.5, finding F-10). La génération du PDF est coûteuse en CPU ;
 * sans borne, elle est déclenchable en boucle par un robot.
 *
 * fail-OPEN, contrairement aux trois autres routes — et c'est délibéré :
 *   - la réponse est identique pour tous et déjà mise en cache par le CDN
 *     (`s-maxage=86400`), qui absorbe l'essentiel des répétitions ;
 *   - aucun e-mail n'est émis, aucune donnée n'est écrite ;
 *   - c'est le lead magnet référencé dans l'e-mail de bienvenue : une panne de
 *     compteur ne doit pas le rendre inaccessible.
 * La borne est donc large, et la disponibilité prime sur la limitation.
 */
const IP_RULE = { limit: 30, windowSeconds: 3600 }

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get('locale') ?? 'fr'
  const locale = ['fr', 'en', 'de'].includes(param) ? param : 'fr'

  const verdict = await enforceRateLimit({
    store: getRateLimitStore(),
    failClosed: false,
    dimensions: [{ scope: 'free-program:ip', value: clientIp(req), rule: IP_RULE }],
  })
  if (!verdict.allowed) {
    return NextResponse.json(tooManyRequestsBody(), {
      status: 429,
      headers: retryAfterHeaders(verdict.retryAfterSeconds),
    })
  }

  try {
    const guide = getFreeProgram(locale)
    const bytes = await generateGuidePdf(guide, locale)
    const filename = `xenotif-programme-decouverte-${locale}.pdf`

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // inline → s'affiche directement dans l'onglet ; filename pour « Enregistrer sous ».
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': String(bytes.length),
        // Ressource publique identique pour tous → cacheable sur le CDN.
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  } catch (err) {
    console.error('[free-program] generation error:', err)
    return NextResponse.json({ error: 'Impossible de générer le programme.' }, { status: 500 })
  }
}
