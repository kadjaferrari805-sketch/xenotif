import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  clientIp,
  enforceRateLimit,
  normalizeEmail,
  retryAfterHeaders,
  tooManyRequestsBody,
} from '@/lib/security/rate-limit'
import { getRateLimitStore } from '@/lib/security/rate-limit-store'

/**
 * Limitation (05-K.5, finding F-02). Chaque appel émet DEUX e-mails via Resend :
 * un vers contact@xenotif.com, un accusé de réception vers l'adresse fournie.
 * Sans borne, la boîte de l'équipe est inondable et l'accusé devient un vecteur
 * d'envoi vers un tiers arbitraire.
 *
 * fail-closed : mêmes effets qu'en F-01, même arbitrage.
 */
const IP_RULE = { limit: 5, windowSeconds: 3600 }
const EMAIL_RULE = { limit: 5, windowSeconds: 86400 }

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json() as {
    name: string; email: string; subject: string; message: string
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
  }

  // Validation longueur max
  if (name.length > 100 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Contenu trop long.' }, { status: 400 })
  }

  const verdict = await enforceRateLimit({
    store: getRateLimitStore(),
    failClosed: true,
    dimensions: [
      { scope: 'contact:ip', value: clientIp(req), rule: IP_RULE, required: true },
      { scope: 'contact:email', value: normalizeEmail(email), rule: EMAIL_RULE },
    ],
  })
  if (!verdict.allowed) {
    return NextResponse.json(tooManyRequestsBody(), {
      status: 429,
      headers: retryAfterHeaders(verdict.retryAfterSeconds),
    })
  }

  const safeName    = escapeHtml(name.trim())
  const safeEmail   = escapeHtml(email.trim())
  const safeSubject = escapeHtml(subject.trim())
  const safeMessage = escapeHtml(message.trim())

  const resend = new Resend(process.env.RESEND_API_KEY!)

  // K8.11-03 — le SDK Resend NE LÈVE PAS sur refus d'API : il retourne
  // `{ data: null, error }`. Les deux `await` nus ci-dessous renvoyaient donc
  // `{ ok: true }` alors que le message n'était jamais parti. Le message de
  // l'erreur ne porte que le code et le statut du fournisseur — jamais
  // l'adresse, le sujet ni le contenu.
  const envoyer = async (payload: Parameters<typeof resend.emails.send>[0]) => {
    const { error } = await resend.emails.send(payload)
    if (error) {
      throw new Error(`Resend a refusé l'envoi (${error.name}, HTTP ${error.statusCode ?? 'inconnu'})`)
    }
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="background:#0A0B0F;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
      <span style="font-weight:900;font-size:16px;letter-spacing:2px;color:#fff;">XENOTIF® - Nouveau message</span>
    </div>
    <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;">
      <p style="color:#9CA3AF;font-size:13px;margin:0 0 8px;"><strong style="color:#fff;">De :</strong> ${safeName} &lt;${safeEmail}&gt;</p>
      <p style="color:#9CA3AF;font-size:13px;margin:0 0 16px;"><strong style="color:#fff;">Sujet :</strong> ${safeSubject}</p>
      <hr style="border:none;border-top:1px solid #1F2937;margin:0 0 16px;"/>
      ${safeMessage.split('\n').map(line => `<p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 12px;">${line}</p>`).join('')}
    </div>
    <p style="color:#374151;font-size:11px;margin-top:32px;">Xenotif® · contact@xenotif.com</p>
  </div>
</body></html>`

  try {
    await envoyer({
      from: 'Xenotif® <noreply@xenotif.com>',
      to: 'contact@xenotif.com',
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html,
    })

    await envoyer({
      from: 'Xenotif® <noreply@xenotif.com>',
      to: email,
      subject: 'Nous avons bien reçu ton message - Xenotif®',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="background:#0A0B0F;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
      <span style="font-weight:900;font-size:16px;letter-spacing:2px;color:#fff;">XENOTIF®</span>
    </div>
    <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;">
      <p style="color:#fff;font-size:17px;font-weight:700;margin:0 0 12px;">Bonjour ${name} 👋</p>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 12px;">Nous avons bien reçu ton message et nous te répondrons dans les plus brefs délais.</p>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0;">L'équipe Xenotif®</p>
    </div>
    <p style="color:#374151;font-size:11px;margin-top:32px;">Xenotif® · contact@xenotif.com</p>
  </div>
</body></html>`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Le détail reste côté serveur ; la réponse conserve son message générique
    // et son statut 500 — le contrat HTTP existant est inchangé.
    console.error('[contact] envoi echoue :', err)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi. Réessaie.' }, { status: 500 })
  }
}
