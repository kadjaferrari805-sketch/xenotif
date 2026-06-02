import { NextRequest, NextResponse } from 'next/server'
import { getProductByIdLocalized } from '@/lib/boutique/products.en'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Pays germanophones → amazon.de (tag xenotif21-21). Sinon → amazon.fr (xenotif-21).
const DE_COUNTRIES = new Set(['DE', 'AT'])

// Redirection affiliée géolocalisée : lit le pays du visiteur (header Vercel
// x-vercel-ip-country) et renvoie vers le bon Amazon avec le bon tag.
// Le marché « en » de notre catalogue = amazon.de ; « fr » = amazon.fr.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') ?? ''
  const country = (req.headers.get('x-vercel-ip-country') ?? '').toUpperCase()
  const market = DE_COUNTRIES.has(country) ? 'en' : 'fr'

  const product = getProductByIdLocalized(id, market)
  const target = product?.amazon?.affiliateUrl
    ?? (market === 'en' ? 'https://www.amazon.de' : 'https://www.amazon.fr')

  return NextResponse.redirect(target, 302)
}
