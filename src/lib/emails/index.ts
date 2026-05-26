import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = 'Xenotif® <noreply@xenotif.com>'
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.vercel.app'

function logo() {
  return `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
      <span style="font-weight:900;font-size:16px;letter-spacing:2px;color:#fff;">XENOTIF®</span>
    </div>
  `
}

function wrap(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="background:#0A0B0F;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    ${logo()}
    ${content}
    <p style="color:#374151;font-size:11px;margin-top:40px;line-height:1.6;">
      Xenotif® · contact@xenotif.com<br/>
      Tu reçois cet email car tu as un compte sur xenotif.com.
    </p>
  </div>
</body></html>`
}

export async function sendWelcomeEmail({
  email, name, plan, setupLink,
}: {
  email: string; name: string; plan: string; setupLink: string
}) {
  const planLabel = plan === 'elite' ? 'Élite' : 'Pro'
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Bienvenue sur Xenotif® — ton essai ${planLabel} commence !`,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        Bienvenue ${name ? `, ${name.split(' ')[0]}` : ''} ! 💪
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Ton essai gratuit de <strong style="color:#fff;">7 jours</strong> sur le
        <strong style="color:#F97316;">Plan ${planLabel}</strong> vient de commencer.
        Aucun débit avant la fin de la période d'essai.
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-weight:700;color:#fff;">Crée ton accès en 1 clic :</p>
        <a href="${setupLink}"
           style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          Accéder à mon espace →
        </a>
        <p style="color:#6B7280;font-size:11px;margin:12px 0 0;">
          Ce lien expire dans 24h. Si tu as du mal à cliquer, copie-colle l'URL dans ton navigateur.
        </p>
      </div>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;">
        <p style="margin:0 0 12px;font-weight:700;color:#fff;">Inclus dans ton Plan ${planLabel} :</p>
        <ul style="margin:0;padding:0;list-style:none;color:#9CA3AF;font-size:14px;line-height:2.2;">
          ${plan === 'elite' ? `
            <li>⚡ Coach personnel dédié</li>
            <li>📹 Bilan mensuel visio 1-1</li>
            <li>🥗 Plan nutritionnel sur mesure</li>
            <li>🎯 Analyse biomécanique vidéo</li>
            <li>✅ Tout le Plan Pro inclus</li>
          ` : `
            <li>✅ Tous les programmes illimités</li>
            <li>🤖 Coaching IA personnalisé</li>
            <li>📊 Statistiques & suivi avancé</li>
            <li>🎥 Vidéos HD haute qualité</li>
            <li>💬 Support prioritaire 7j/7</li>
          `}
        </ul>
      </div>
    `),
  })
}

export async function sendTrialReminderEmail({
  email, name, daysLeft,
}: {
  email: string; name: string; daysLeft: number
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `⏰ Ton essai Xenotif® se termine dans ${daysLeft} jours`,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai ${name ? `, ${name.split(' ')[0]}` : ''} !
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Ton essai gratuit Xenotif® se termine bientôt.
        Continue ton accès complet sans interruption.
      </p>

      <div style="background:#111218;border:1px solid #F97316;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#9CA3AF;">Après ton essai :</p>
        <p style="margin:0;font-size:22px;font-weight:900;color:#F97316;">
          À partir de 9,99 €/mois
        </p>
        <p style="margin:4px 0 16px;font-size:12px;color:#6B7280;">Annulable à tout moment, sans engagement</p>
        <a href="${BASE_URL}/dashboard/abonnement"
           style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          Gérer mon abonnement →
        </a>
      </div>

      <p style="color:#6B7280;font-size:13px;line-height:1.6;">
        Si tu ne fais rien, ton abonnement se poursuivra automatiquement.
        Tu peux annuler à tout moment depuis ton espace membre.
      </p>
    `),
  })
}

export async function sendCancellationEmail({
  email, name,
}: {
  email: string; name: string
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Résiliation confirmée — Xenotif®',
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        Résiliation confirmée${name ? `, ${name.split(' ')[0]}` : ''}
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Ta résiliation a bien été prise en compte.
        Tu gardes un accès complet jusqu'à la fin de ta période de facturation.
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 16px;font-weight:700;color:#fff;">On est tristes de te voir partir. 😢</p>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0 0 16px;">
          Si tu changes d'avis, tu peux réactiver ton abonnement à tout moment
          depuis ton espace membre. Toute ta progression est sauvegardée.
        </p>
        <a href="${BASE_URL}/dashboard/abonnement"
           style="display:inline-block;border:2px solid #F97316;color:#F97316;padding:12px 24px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          Réactiver mon abonnement
        </a>
      </div>

      <p style="color:#6B7280;font-size:13px;">
        Des questions ? Réponds à cet email ou contacte-nous à
        <a href="mailto:contact@xenotif.com" style="color:#F97316;">contact@xenotif.com</a>
      </p>
    `),
  })
}
