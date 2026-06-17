import { NextRequest, NextResponse } from 'next/server'
import { getFreeProgram } from '@/lib/lead-magnet'
import { generateGuidePdf } from '@/lib/boutique/guide-pdf'

export const runtime = 'nodejs'

/**
 * Lead magnet gratuit : « Programme Découverte 7 jours » en PDF.
 *   GET /api/free-program?locale=fr
 *
 * Aucune authentification — c'est une ressource offerte pour capturer l'email
 * (le formulaire newsletter enregistre l'email AVANT d'exposer ce lien). Le PDF
 * est généré à la volée avec le générateur premium existant (guide-pdf.ts).
 */
export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get('locale') ?? 'fr'
  const locale = ['fr', 'en', 'de'].includes(param) ? param : 'fr'

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
