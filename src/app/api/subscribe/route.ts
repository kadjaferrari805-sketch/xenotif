import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const SITE = 'https://xenotif.com'

type EmailCopy = {
  subject: string
  heading: string
  intro: string
  programButton: string
  perksTitle: string
  perks: string[]
  signupButton: string
  footer: string
}

// Email de bienvenue localisé. Le lead magnet (programme 7 jours) est le CTA
// principal ; la création de compte est le CTA secondaire.
const COPY: Record<string, EmailCopy> = {
  fr: {
    subject: 'Ton programme 7 jours est prêt 🎁 — Bienvenue chez Xenotif®',
    heading: 'Bienvenue dans la communauté ! 💪',
    intro: `Tu fais maintenant partie des <strong style="color:#fff;">12 000+ athlètes</strong> qui transforment leur corps avec Xenotif®. Ton programme découverte 7 jours t'attend juste ici :`,
    programButton: '🎁 Télécharger mon programme (PDF)',
    perksTitle: "Ce qui t'attend ensuite :",
    perks: ['Programmes gratuits chaque semaine', 'Conseils nutrition et récupération', 'WODs de la communauté', "Accès à l'IA de coaching personnalisé"],
    signupButton: 'Créer mon compte gratuit →',
    footer: `Tu reçois cet email car tu t'es inscrit(e) sur xenotif.com.<br />Pour te désabonner, réponds à cet email avec "STOP".`,
  },
  en: {
    subject: 'Your 7-day program is ready 🎁 — Welcome to Xenotif®',
    heading: 'Welcome to the community! 💪',
    intro: `You're now part of the <strong style="color:#fff;">12,000+ athletes</strong> transforming their body with Xenotif®. Your 7-day starter program is right here:`,
    programButton: '🎁 Download my program (PDF)',
    perksTitle: 'What comes next:',
    perks: ['Free programs every week', 'Nutrition and recovery advice', 'Community WODs', 'Access to personalized AI coaching'],
    signupButton: 'Create my free account →',
    footer: `You're receiving this email because you signed up on xenotif.com.<br />To unsubscribe, reply to this email with "STOP".`,
  },
  de: {
    subject: 'Dein 7-Tage-Programm ist da 🎁 — Willkommen bei Xenotif®',
    heading: 'Willkommen in der Community! 💪',
    intro: `Du gehörst jetzt zu den <strong style="color:#fff;">12.000+ Athleten</strong>, die ihren Körper mit Xenotif® transformieren. Dein 7-Tage-Einsteiger-Programm wartet genau hier:`,
    programButton: '🎁 Mein Programm herunterladen (PDF)',
    perksTitle: 'Was als Nächstes kommt:',
    perks: ['Kostenlose Programme jede Woche', 'Tipps zu Ernährung und Erholung', 'Community-WODs', 'Zugang zum personalisierten KI-Coaching'],
    signupButton: 'Kostenloses Konto erstellen →',
    footer: `Du erhältst diese E-Mail, weil du dich auf xenotif.com angemeldet hast.<br />Zum Abmelden antworte mit "STOP".`,
  },
}

function buildHtml(c: EmailCopy, locale: string): string {
  const programUrl = `${SITE}/api/free-program?locale=${locale}`
  const signupUrl = `${SITE}/auth/signup`
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="background:#0A0B0F;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px;">
        <div style="max-width:560px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
            <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
            <span style="font-weight:900;font-size:18px;letter-spacing:2px;">XENOTIF®</span>
          </div>

          <h1 style="font-size:28px;font-weight:900;margin:0 0 8px;">${c.heading}</h1>
          <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">${c.intro}</p>

          <a href="${programUrl}"
             style="display:inline-block;background:#F97316;color:#fff;padding:16px 32px;border-radius:50px;font-weight:800;font-size:15px;text-decoration:none;margin-bottom:28px;">
            ${c.programButton}
          </a>

          <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
            <p style="margin:0 0 16px;font-weight:700;color:#fff;">${c.perksTitle}</p>
            <ul style="margin:0;padding:0;list-style:none;color:#9CA3AF;font-size:14px;line-height:2;">
              ${c.perks.map((p) => `<li>✅ ${p}</li>`).join('')}
            </ul>
          </div>

          <a href="${signupUrl}"
             style="display:inline-block;background:transparent;border:1px solid #374151;color:#fff;padding:13px 26px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
            ${c.signupButton}
          </a>

          <p style="color:#4B5563;font-size:11px;margin-top:32px;">${c.footer}</p>
        </div>
      </body>
    </html>
  `
}

export async function POST(req: NextRequest) {
  try {
    const { email, locale: rawLocale } = await req.json()
    const locale = ['fr', 'en', 'de'].includes(rawLocale) ? rawLocale : 'fr'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 })
    }

    // Enregistrer l'abonné dans la liste newsletter persistante (non bloquant)
    try {
      const supabase = createAdminClient()
      await supabase.from('newsletter_subscribers').upsert(
        { email: email.toLowerCase().trim(), source: 'newsletter', subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      )
    } catch (dbErr) {
      console.error('[subscribe] DB upsert error (non-bloquant):', dbErr)
    }

    const copy = COPY[locale] ?? COPY.fr
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: 'Xenotif® <noreply@xenotif.com>',
      to: email,
      subject: copy.subject,
      html: buildHtml(copy, locale),
    })

    if (error) {
      console.error('Resend error:', JSON.stringify(error))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscribe route error:', err)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessaie dans quelques instants.' }, { status: 500 })
  }
}
