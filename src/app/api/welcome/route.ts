import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAccountCreatedEmail } from '@/lib/emails'

export const runtime = 'nodejs'

// Envoie l'email de bienvenue au compte qui vient d'être créé.
// Auth-gated : n'envoie qu'à l'email de l'utilisateur connecté (pas d'énumération possible).
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let locale = 'fr'
  try {
    const body = await req.json()
    if (typeof body?.locale === 'string') locale = body.locale
  } catch { /* corps optionnel */ }

  const name = (user.user_metadata?.full_name as string) ?? ''
  try {
    await sendAccountCreatedEmail({ email: user.email, name, locale })
  } catch (e) {
    console.error('[welcome] email error:', e)
    return NextResponse.json({ ok: false }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
