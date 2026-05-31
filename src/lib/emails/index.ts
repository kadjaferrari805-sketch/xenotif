import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
const FROM = 'Xenotif® <noreply@xenotif.com>'
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'

// Gabarit email premium — layout table-based (compatible Outlook, Gmail, Apple Mail).
function wrap(content: string, preheader = 'Xenotif® — Forge ton corps. Dépasse tes limites.') {
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`
  return `<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark light"/>
<meta name="x-apple-disable-message-reformatting"/>
</head>
<body style="margin:0;padding:0;background:#070809;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#070809;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#070809;">
<tr><td align="center" style="padding:36px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;font-family:${font};">

  <!-- En-tête de marque -->
  <tr><td style="padding:0 4px 16px;">
    <table role="presentation" width="100%"><tr>
      <td style="font-weight:900;font-size:21px;letter-spacing:3px;color:#ffffff;">XENOTIF<span style="color:#FF4500;">®</span></td>
      <td align="right" style="font-weight:600;font-size:10px;letter-spacing:1.5px;color:#586173;text-transform:uppercase;">Performance · Coaching IA</td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:0 4px;"><div style="height:3px;background:linear-gradient(90deg,#FF4500 0%,#FF6a33 45%,rgba(255,69,0,0) 100%);border-radius:99px;"></div></td></tr>

  <!-- Corps -->
  <tr><td style="padding:34px 6px 8px;color:#e6e8ec;font-size:15px;line-height:1.65;">
    ${content}
  </td></tr>

  <!-- Pied de page -->
  <tr><td style="padding:30px 6px 0;">
    <div style="height:1px;background:#1b1f27;margin-bottom:22px;"></div>
    <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.8;">
      <a href="${BASE_URL}" style="color:#9aa2ad;text-decoration:none;font-weight:600;">xenotif.com</a>
      &nbsp;·&nbsp;<a href="${BASE_URL}/boutique" style="color:#9aa2ad;text-decoration:none;">Boutique</a>
      &nbsp;·&nbsp;<a href="mailto:contact@xenotif.com" style="color:#9aa2ad;text-decoration:none;">Contact</a><br/>
      <span style="color:#4b5563;">© 2026 Xenotif® — Tous droits réservés. Forge ton corps. Dépasse tes limites.</span>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
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

const DAILY_MESSAGES = [
  // 0 = Sunday
  {
    subject: '☀️ Nouveau départ — ta semaine commence aujourd\'hui !',
    quote: '« Le succès n\'est pas final, l\'échec n\'est pas fatal : c\'est le courage de continuer qui compte. »',
    quoteAuthor: '— Winston Churchill',
    headline: 'Lance ta semaine du bon pied !',
    body: 'Le dimanche, c\'est le moment idéal pour poser les bases de ta semaine. Une courte séance aujourd\'hui et tu arrives lundi avec de l\'énergie et de la confiance.',
    challenge: 'Défi du jour : 15 min de mobilité ou une marche active pour préparer ton corps.',
  },
  // 1 = Monday
  {
    subject: '💪 Lundi = jour J. Prêt(e) à tout donner ?',
    quote: '« Ce n\'est pas l\'envie qui manque, c\'est la discipline qui fait la différence. »',
    quoteAuthor: '— Xenotif®',
    headline: 'Lundi, c\'est ton jour de force.',
    body: 'Les champions ne choisissent pas leurs jours. Ils s\'entraînent parce qu\'ils savent que chaque effort compte, même les jours sans motivation.',
    challenge: 'Défi du jour : complète une séance muscu ou cardio complète sur ton tableau de bord.',
  },
  // 2 = Tuesday
  {
    subject: '🔥 Mardi — garde le rythme, ne lâche rien !',
    quote: '« La douleur d\'aujourd\'hui est la force de demain. »',
    quoteAuthor: '— Arnold Schwarzenegger',
    headline: 'Le momentum est de ton côté.',
    body: 'Après le lundi, le mardi c\'est là où les engagements se testent. Ceux qui restent constants maintenant seront ceux qui voient des résultats dans 30 jours.',
    challenge: 'Défi du jour : ajoute 5 % de charge ou 2 répétitions à ton exercice principal.',
  },
  // 3 = Wednesday
  {
    subject: '⚡ Mi-semaine — tu es à mi-chemin, continue !',
    quote: '« Ton corps peut tout. C\'est ton esprit qu\'il faut convaincre. »',
    quoteAuthor: '— Xenotif®',
    headline: 'Mercredi : le cap de la semaine.',
    body: 'La mi-semaine est souvent le moment où la fatigue se fait sentir. Mais c\'est aussi le moment où les vrais athlètes font la différence. Reste dans ta routine.',
    challenge: 'Défi du jour : séance cardio courte ou yoga pour récupérer et rester actif(ve).',
  },
  // 4 = Thursday
  {
    subject: '🎯 Jeudi — presque vendredi, pousse encore !',
    quote: '« Chaque rep, chaque set, chaque goutte de sueur te rapproche de ton objectif. »',
    quoteAuthor: '— Xenotif®',
    headline: 'L\'effort d\'aujourd\'hui fait la transformation de demain.',
    body: 'Jeudi c\'est le sprint final de la semaine. Tu as déjà fait le plus dur. Aujourd\'hui, donne le reste — ton futur toi te remerciera.',
    challenge: 'Défi du jour : termine une séance complète et note tes progrès dans ton suivi.',
  },
  // 5 = Friday
  {
    subject: '🏆 Vendredi — termine la semaine en beauté !',
    quote: '« Les résultats ne viennent pas du talent, mais de la constance. »',
    quoteAuthor: '— Dwayne Johnson',
    headline: 'Finisher le vendredi, c\'est le meilleur sentiment.',
    body: 'Une semaine complète d\'entraînement — c\'est 52 semaines par an de progression. Ceux qui s\'entraînent le vendredi sont ceux qui transforment leur corps durablement.',
    challenge: 'Défi du jour : séance intensive, repousse tes limites — c\'est le dernier effort de la semaine !',
  },
  // 6 = Saturday
  {
    subject: '🌟 Samedi actif — profite et reste en mouvement !',
    quote: '« Le corps réalise ce que l\'esprit croit. »',
    quoteAuthor: '— Napoleon Hill',
    headline: 'Samedi : récupération active ou nouveau challenge.',
    body: 'Le week-end n\'est pas une pause, c\'est une opportunité. Une petite séance ou une activité sportive dehors te gardera dans la dynamique et boostera ton humeur toute la journée.',
    challenge: 'Défi du jour : sport en plein air, nage, vélo ou séance légère — 30 min suffisent !',
  },
]

export async function sendDailyMotivationEmail({
  email, name,
}: {
  email: string; name: string
}) {
  const dayIndex = new Date().getDay() // 0=Sunday … 6=Saturday
  const msg = DAILY_MESSAGES[dayIndex]
  const firstName = name ? name.split(' ')[0] : ''

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: msg.subject,
    html: wrap(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 8px;">
        ${msg.headline}${firstName ? ` ${firstName}` : ''} 🔥
      </h1>

      <div style="background:#111218;border-left:4px solid #F97316;border-radius:0 12px 12px 0;padding:16px 20px;margin:24px 0;">
        <p style="margin:0;font-style:italic;color:#E5E7EB;font-size:15px;line-height:1.6;">${msg.quote}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#6B7280;">${msg.quoteAuthor}</p>
      </div>

      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">${msg.body}</p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;color:#F97316;text-transform:uppercase;">Défi du jour</p>
        <p style="margin:0;color:#fff;font-size:14px;line-height:1.6;">${msg.challenge}</p>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${BASE_URL}/dashboard"
           style="display:inline-block;background:#F97316;color:#fff;padding:16px 36px;border-radius:50px;font-weight:900;font-size:15px;text-decoration:none;letter-spacing:0.5px;">
          Commencer ma séance →
        </a>
      </div>

      <p style="color:#374151;font-size:12px;text-align:center;line-height:1.6;">
        Tu reçois cet email quotidien car tu es abonné(e) à Xenotif®.<br/>
        <a href="${BASE_URL}/dashboard/abonnement" style="color:#6B7280;">Gérer mes préférences</a>
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

export async function sendAbandonedCartEmail({
  email, items, total, recoverUrl,
}: {
  email: string
  items: { name: string; price: string; image: string }[]
  total: string
  recoverUrl: string
}) {
  const itemsHtml = items.map(i => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1F2937;">
        <table style="width:100%;"><tr>
          <td style="width:56px;">
            <img src="${i.image}" alt="" width="48" height="48" style="border-radius:8px;object-fit:cover;display:block;" />
          </td>
          <td style="padding-left:12px;color:#fff;font-size:14px;font-weight:600;">${i.name}</td>
          <td style="text-align:right;color:#F97316;font-size:14px;font-weight:700;white-space:nowrap;">${i.price}</td>
        </tr></table>
      </td>
    </tr>
  `).join('')

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '🛒 Tu as oublié quelque chose dans ton panier Xenotif®',
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">Ton panier t'attend 💪</h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Tu as laissé des articles dans ton panier. Termine ta commande avant qu'ils ne partent !
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:20px 24px;margin-bottom:8px;">
        <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
        <table style="width:100%;margin-top:16px;"><tr>
          <td style="color:#fff;font-weight:900;font-size:16px;">Total</td>
          <td style="text-align:right;color:#F97316;font-weight:900;font-size:18px;">${total}</td>
        </tr></table>
      </div>

      <a href="${recoverUrl}"
         style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:16px 0;">
        Finaliser ma commande →
      </a>

      <div style="margin-top:8px;color:#9CA3AF;font-size:13px;line-height:1.8;">
        🚚 Livraison offerte dès 50€ &nbsp;·&nbsp; ↩️ Retours 30 jours &nbsp;·&nbsp; 🔒 Paiement sécurisé
      </div>
    `),
  })
}

// ─── Livraison des programmes/guides digitaux après achat ──────────────
export async function sendDigitalDeliveryEmail({
  email, name, sessionId, items,
}: {
  email: string
  name?: string
  sessionId: string
  items: { id: string; name: string }[]
}) {
  if (!items.length) return

  const itemsHtml = items.map(i => {
    const url = `${BASE_URL}/api/boutique/download?session=${encodeURIComponent(sessionId)}&p=${encodeURIComponent(i.id)}`
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1216;border:1px solid #232a33;border-radius:16px;margin:0 0 14px;">
        <tr><td style="padding:22px 24px;">
          <div style="font-weight:800;font-size:10px;letter-spacing:1.5px;color:#FF4500;text-transform:uppercase;margin:0 0 7px;">Guide PDF · Xenotif®</div>
          <div style="font-weight:800;font-size:16px;color:#ffffff;line-height:1.3;margin:0 0 4px;">${i.name}</div>
          <div style="font-size:12px;color:#6b7280;margin:0 0 18px;">Format PDF · Accès à vie · Compatible tous appareils</div>
          <a href="${url}"
             style="display:inline-block;background:#15803d;color:#ffffff;padding:13px 26px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">
            ↓&nbsp;&nbsp;Télécharger le PDF
          </a>
        </td></tr>
      </table>
    `
  }).join('')

  const hello = name ? `Merci ${name.split(' ')[0]} 🙌` : 'Merci pour ta confiance 🙌'
  const plural = items.length > 1

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Ton guide Xenotif® est prêt 📘`,
    html: wrap(`
      <div style="font-weight:800;font-size:11px;letter-spacing:1.5px;color:#16a34a;text-transform:uppercase;margin:0 0 12px;">&#10003; Commande confirmée</div>
      <h1 style="font-size:27px;font-weight:900;margin:0 0 10px;color:#ffffff;line-height:1.2;">
        ${plural ? 'Tes guides sont prêts' : 'Ton guide est prêt'} 📘
      </h1>
      <p style="color:#9aa2ad;font-size:15px;line-height:1.65;margin:0 0 26px;">
        ${hello} — ${plural ? 'tes guides sont disponibles' : 'ton guide est disponible'} immédiatement.
        Télécharge${plural ? '-les' : '-le'} ci-dessous : ${plural ? 'ils sont' : 'il est'} à toi pour toujours.
      </p>

      ${itemsHtml}

      <table role="presentation" width="100%" style="margin:6px 0 0;"><tr>
        <td style="font-size:12px;color:#6b7280;line-height:1.7;">
          🔒 Lien sécurisé &nbsp;·&nbsp; ♾️ Accès à vie &nbsp;·&nbsp; 📱 Tous appareils
        </td>
      </tr></table>

      <p style="color:#6b7280;font-size:12.5px;line-height:1.7;margin:24px 0 0;border-top:1px solid #1b1f27;padding-top:20px;">
        Conserve cet email : tu peux retélécharger ${plural ? 'tes guides' : 'ton guide'} à tout moment via ce lien.
        Une question ? Réponds simplement à cet email — notre équipe te répond sous 24&nbsp;h.
      </p>
    `, `${plural ? 'Tes guides Xenotif®' : 'Ton guide Xenotif®'} est disponible — télécharge ton PDF maintenant.`),
  })
}
