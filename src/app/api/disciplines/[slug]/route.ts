import { NextResponse } from 'next/server'
import { getDisciplineFromDb } from '@/lib/content-db'

export const runtime = 'nodejs'

// Contenu d'une discipline depuis la base (publique ; le contenu est déjà public).
// Renvoie null si absente/base vide → le client utilise alors le repli statique.
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = new URL(req.url).searchParams.get('locale') ?? 'fr'
  const db = await getDisciplineFromDb(slug, locale)
  return NextResponse.json(db)
}
