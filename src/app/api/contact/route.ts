import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json() as {
    name: string; email: string; subject: string; message: string
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY!)

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="background:#0A0B0F;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
      <span style="font-weight:900;font-size:16px;letter-spacing:2px;color:#fff;">XENOTIF® — Nouveau message</span>
    </div>
    <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;">
      <p style="color:#9CA3AF;font-size:13px;margin:0 0 8px;"><strong style="color:#fff;">De :</strong> ${name} &lt;${email}&gt;</p>
      <p style="color:#9CA3AF;font-size:13px;margin:0 0 16px;"><strong style="color:#fff;">Sujet :</strong> ${subject}</p>
      <hr style="border:none;border-top:1px solid #1F2937;margin:0 0 16px;"/>
      ${message.split('\n').map(line => `<p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 12px;">${line}</p>`).join('')}
    </div>
    <p style="color:#374151;font-size:11px;margin-top:32px;">Xenotif® · contact@xenotif.com</p>
  </div>
</body></html>`

  try {
    await resend.emails.send({
      from: 'Xenotif® <noreply@xenotif.com>',
      to: 'contact@xenotif.com',
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html,
    })

    await resend.emails.send({
      from: 'Xenotif® <noreply@xenotif.com>',
      to: email,
      subject: 'Nous avons bien reçu ton message — Xenotif®',
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
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l\'envoi. Réessaie.' }, { status: 500 })
  }
}
