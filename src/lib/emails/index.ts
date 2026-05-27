import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
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
