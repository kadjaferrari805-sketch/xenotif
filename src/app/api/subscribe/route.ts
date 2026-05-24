import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: 'Xenotif® <onboarding@resend.dev>',
    to: email,
    subject: 'Bienvenue dans la communauté Xenotif® 🏆',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /></head>
        <body style="background:#0A0B0F;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px;">
          <div style="max-width:560px;margin:0 auto;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
              <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
              <span style="font-weight:900;font-size:18px;letter-spacing:2px;">XENOTIF®</span>
            </div>

            <h1 style="font-size:28px;font-weight:900;margin:0 0 8px;">Bienvenue dans la communauté ! 💪</h1>
            <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Tu fais maintenant partie des <strong style="color:#fff;">12 000+ athlètes</strong> qui transforment leur corps avec Xenotif®.
            </p>

            <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 16px;font-weight:700;color:#fff;">Ce qui t'attend :</p>
              <ul style="margin:0;padding:0;list-style:none;color:#9CA3AF;font-size:14px;line-height:2;">
                <li>✅ Programmes gratuits chaque semaine</li>
                <li>✅ Conseils nutrition et récupération</li>
                <li>✅ WODs de la communauté</li>
                <li>✅ Accès à l'IA de coaching personnalisé</li>
              </ul>
            </div>

            <a href="https://xenotif.vercel.app/#disciplines"
               style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
              Découvrir mes programmes →
            </a>

            <p style="color:#4B5563;font-size:11px;margin-top:32px;">
              Tu reçois cet email car tu t'es inscrit(e) sur xenotif.vercel.app.<br />
              Pour te désabonner, réponds à cet email avec "STOP".
            </p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi. Réessaie dans quelques instants.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
