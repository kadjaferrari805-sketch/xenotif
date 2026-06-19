import { Resend } from 'resend'
import { getProductById } from '@/lib/boutique/products'

export type EmailLocale = 'fr' | 'en'
const norm = (l?: string): EmailLocale => (l === 'en' ? 'en' : 'fr')

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
const FROM = 'Xenotif® <noreply@xenotif.com>'
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'

const CHROME = {
  fr: {
    tagline: 'Performance · Coaching IA',
    preheader: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
    shop: 'Boutique',
    contact: 'Contact',
    copyright: '© 2026 Xenotif® — Tous droits réservés. Forge ton corps. Dépasse tes limites.',
  },
  en: {
    tagline: 'Performance · AI Coaching',
    preheader: 'Xenotif® — Forge your body. Push your limits.',
    shop: 'Shop',
    contact: 'Contact',
    copyright: '© 2026 Xenotif® — All rights reserved. Forge your body. Push your limits.',
  },
} as const

// Gabarit email premium — layout table-based (compatible Outlook, Gmail, Apple Mail).
function wrap(content: string, locale: EmailLocale, preheader?: string) {
  const x = CHROME[locale]
  const ph = preheader ?? x.preheader
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`
  return `<!DOCTYPE html>
<html lang="${locale}"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark light"/>
<meta name="x-apple-disable-message-reformatting"/>
</head>
<body style="margin:0;padding:0;background:#070809;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#070809;">${ph}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#070809;">
<tr><td align="center" style="padding:36px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;font-family:${font};">

  <!-- En-tête de marque -->
  <tr><td style="padding:0 4px 16px;">
    <table role="presentation" width="100%"><tr>
      <td style="font-weight:900;font-size:21px;letter-spacing:3px;color:#ffffff;">XENOTIF<span style="color:#FF4500;">®</span></td>
      <td align="right" style="font-weight:600;font-size:10px;letter-spacing:1.5px;color:#586173;text-transform:uppercase;">${x.tagline}</td>
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
      &nbsp;·&nbsp;<a href="${BASE_URL}/boutique" style="color:#9aa2ad;text-decoration:none;">${x.shop}</a>
      &nbsp;·&nbsp;<a href="mailto:contact@xenotif.com" style="color:#9aa2ad;text-decoration:none;">${x.contact}</a><br/>
      <span style="color:#4b5563;">${x.copyright}</span>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
}

export async function sendWelcomeEmail({
  email, name, setupLink, locale: rawLocale,
}: {
  email: string; name: string; plan?: string; setupLink: string; locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const planLabel = 'Pro'
  const first = name ? name.split(' ')[0] : ''
  const features = en ? [
    '✅ Unlimited access to all 10 disciplines & programs', '🤖 Personalized AI coach',
    '📊 Progress tracking & statistics', '🎥 HD training videos', '🔔 Daily reminders & motivation',
  ] : [
    '✅ Accès illimité aux 10 disciplines & programmes', '🤖 Coach IA personnalisé',
    '📊 Suivi & statistiques de progression', '🎥 Vidéos d\'entraînement HD', '🔔 Rappels & motivation quotidienne',
  ]
  const c = en ? {
    subject: `Welcome to Xenotif® — your ${planLabel} membership is active!`,
    h1: `Welcome${first ? `, ${first}` : ''}! 💪`,
    intro: `Your <strong style="color:#F97316;">${planLabel} membership</strong> is now active. Welcome aboard — let's get to work!`,
    createTitle: 'Create your access in 1 click:',
    cta: 'Go to my dashboard →',
    linkNote: `This link expires in 24h. If clicking doesn't work, copy-paste the URL into your browser.`,
    includedTitle: `Included in your ${planLabel} plan:`,
  } : {
    subject: `Bienvenue sur Xenotif® — ton abonnement ${planLabel} est actif !`,
    h1: `Bienvenue${first ? `, ${first}` : ''} ! 💪`,
    intro: `Ton <strong style="color:#F97316;">abonnement ${planLabel}</strong> est maintenant actif. Bienvenue — au travail !`,
    createTitle: 'Crée ton accès en 1 clic :',
    cta: 'Accéder à mon espace →',
    linkNote: `Ce lien expire dans 24h. Si tu as du mal à cliquer, copie-colle l'URL dans ton navigateur.`,
    includedTitle: `Inclus dans ton Plan ${planLabel} :`,
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: c.subject,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        ${c.h1}
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${c.intro}
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-weight:700;color:#fff;">${c.createTitle}</p>
        <a href="${setupLink}"
           style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          ${c.cta}
        </a>
        <p style="color:#6B7280;font-size:11px;margin:12px 0 0;">
          ${c.linkNote}
        </p>
      </div>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;">
        <p style="margin:0 0 12px;font-weight:700;color:#fff;">${c.includedTitle}</p>
        <ul style="margin:0;padding:0;list-style:none;color:#9CA3AF;font-size:14px;line-height:2.2;">
          ${features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `, locale),
  })
}

export async function sendTrialReminderEmail({
  email, name, daysLeft, locale: rawLocale,
}: {
  email: string; name: string; daysLeft: number; locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const first = name ? name.split(' ')[0] : ''
  const c = en ? {
    subject: `⏰ Your Xenotif® trial ends in ${daysLeft} days`,
    h1: `Only ${daysLeft} day${daysLeft > 1 ? 's' : ''} of trial left${first ? `, ${first}` : ''}!`,
    intro: 'Your free Xenotif® trial ends soon. Keep your full access without interruption.',
    afterTrial: 'After your trial:',
    price: 'From 9,99 €/month',
    priceNote: 'Cancel anytime, no commitment',
    cta: 'Manage my subscription →',
    note: 'If you do nothing, your subscription will continue automatically. You can cancel anytime from your member area.',
  } : {
    subject: `⏰ Ton essai Xenotif® se termine dans ${daysLeft} jours`,
    h1: `Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai${first ? `, ${first}` : ''} !`,
    intro: 'Ton essai gratuit Xenotif® se termine bientôt. Continue ton accès complet sans interruption.',
    afterTrial: 'Après ton essai :',
    price: 'À partir de 9,99 €/mois',
    priceNote: 'Annulable à tout moment, sans engagement',
    cta: 'Gérer mon abonnement →',
    note: 'Si tu ne fais rien, ton abonnement se poursuivra automatiquement. Tu peux annuler à tout moment depuis ton espace membre.',
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: c.subject,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        ${c.h1}
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${c.intro}
      </p>

      <div style="background:#111218;border:1px solid #F97316;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#9CA3AF;">${c.afterTrial}</p>
        <p style="margin:0;font-size:22px;font-weight:900;color:#F97316;">
          ${c.price}
        </p>
        <p style="margin:4px 0 16px;font-size:12px;color:#6B7280;">${c.priceNote}</p>
        <a href="${BASE_URL}/dashboard/abonnement"
           style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          ${c.cta}
        </a>
      </div>

      <p style="color:#6B7280;font-size:13px;line-height:1.6;">
        ${c.note}
      </p>
    `, locale),
  })
}

type DailyMessage = {
  subject: string; quote: string; quoteAuthor: string; headline: string; body: string; challenge: string
}

// Index 0 = dimanche … 6 = samedi
const DAILY_MESSAGES: Record<EmailLocale, DailyMessage[]> = {
  fr: [
    {
      subject: '☀️ Nouveau départ — ta semaine commence aujourd\'hui !',
      quote: '« Le succès n\'est pas final, l\'échec n\'est pas fatal : c\'est le courage de continuer qui compte. »',
      quoteAuthor: '— Winston Churchill',
      headline: 'Lance ta semaine du bon pied !',
      body: 'Le dimanche, c\'est le moment idéal pour poser les bases de ta semaine. Une courte séance aujourd\'hui et tu arrives lundi avec de l\'énergie et de la confiance.',
      challenge: 'Défi du jour : 15 min de mobilité ou une marche active pour préparer ton corps.',
    },
    {
      subject: '💪 Lundi = jour J. Prêt(e) à tout donner ?',
      quote: '« Ce n\'est pas l\'envie qui manque, c\'est la discipline qui fait la différence. »',
      quoteAuthor: '— Xenotif®',
      headline: 'Lundi, c\'est ton jour de force.',
      body: 'Les champions ne choisissent pas leurs jours. Ils s\'entraînent parce qu\'ils savent que chaque effort compte, même les jours sans motivation.',
      challenge: 'Défi du jour : complète une séance muscu ou cardio complète sur ton tableau de bord.',
    },
    {
      subject: '🔥 Mardi — garde le rythme, ne lâche rien !',
      quote: '« La douleur d\'aujourd\'hui est la force de demain. »',
      quoteAuthor: '— Arnold Schwarzenegger',
      headline: 'Le momentum est de ton côté.',
      body: 'Après le lundi, le mardi c\'est là où les engagements se testent. Ceux qui restent constants maintenant seront ceux qui voient des résultats dans 30 jours.',
      challenge: 'Défi du jour : ajoute 5 % de charge ou 2 répétitions à ton exercice principal.',
    },
    {
      subject: '⚡ Mi-semaine — tu es à mi-chemin, continue !',
      quote: '« Ton corps peut tout. C\'est ton esprit qu\'il faut convaincre. »',
      quoteAuthor: '— Xenotif®',
      headline: 'Mercredi : le cap de la semaine.',
      body: 'La mi-semaine est souvent le moment où la fatigue se fait sentir. Mais c\'est aussi le moment où les vrais athlètes font la différence. Reste dans ta routine.',
      challenge: 'Défi du jour : séance cardio courte ou yoga pour récupérer et rester actif(ve).',
    },
    {
      subject: '🎯 Jeudi — presque vendredi, pousse encore !',
      quote: '« Chaque rep, chaque set, chaque goutte de sueur te rapproche de ton objectif. »',
      quoteAuthor: '— Xenotif®',
      headline: 'L\'effort d\'aujourd\'hui fait la transformation de demain.',
      body: 'Jeudi c\'est le sprint final de la semaine. Tu as déjà fait le plus dur. Aujourd\'hui, donne le reste — ton futur toi te remerciera.',
      challenge: 'Défi du jour : termine une séance complète et note tes progrès dans ton suivi.',
    },
    {
      subject: '🏆 Vendredi — termine la semaine en beauté !',
      quote: '« Les résultats ne viennent pas du talent, mais de la constance. »',
      quoteAuthor: '— Dwayne Johnson',
      headline: 'Finisher le vendredi, c\'est le meilleur sentiment.',
      body: 'Une semaine complète d\'entraînement — c\'est 52 semaines par an de progression. Ceux qui s\'entraînent le vendredi sont ceux qui transforment leur corps durablement.',
      challenge: 'Défi du jour : séance intensive, repousse tes limites — c\'est le dernier effort de la semaine !',
    },
    {
      subject: '🌟 Samedi actif — profite et reste en mouvement !',
      quote: '« Le corps réalise ce que l\'esprit croit. »',
      quoteAuthor: '— Napoleon Hill',
      headline: 'Samedi : récupération active ou nouveau challenge.',
      body: 'Le week-end n\'est pas une pause, c\'est une opportunité. Une petite séance ou une activité sportive dehors te gardera dans la dynamique et boostera ton humeur toute la journée.',
      challenge: 'Défi du jour : sport en plein air, nage, vélo ou séance légère — 30 min suffisent !',
    },
  ],
  en: [
    {
      subject: '☀️ Fresh start — your week begins today!',
      quote: '“Success is not final, failure is not fatal: it is the courage to continue that counts.”',
      quoteAuthor: '— Winston Churchill',
      headline: 'Kick off your week the right way!',
      body: 'Sunday is the perfect time to set the foundation for your week. A short session today and you\'ll start Monday with energy and confidence.',
      challenge: 'Today\'s challenge: 15 min of mobility or a brisk walk to prime your body.',
    },
    {
      subject: '💪 Monday = game day. Ready to give it all?',
      quote: '“It\'s not motivation you lack — it\'s discipline that makes the difference.”',
      quoteAuthor: '— Xenotif®',
      headline: 'Monday is your strength day.',
      body: 'Champions don\'t pick their days. They train because they know every effort counts — even on the days motivation is missing.',
      challenge: 'Today\'s challenge: complete a full strength or cardio session on your dashboard.',
    },
    {
      subject: '🔥 Tuesday — keep the pace, don\'t let up!',
      quote: '“The pain of today is the strength of tomorrow.”',
      quoteAuthor: '— Arnold Schwarzenegger',
      headline: 'Momentum is on your side.',
      body: 'After Monday, Tuesday is where commitments get tested. Those who stay consistent now are the ones who see results in 30 days.',
      challenge: 'Today\'s challenge: add 5% load or 2 reps to your main exercise.',
    },
    {
      subject: '⚡ Midweek — you\'re halfway there, keep going!',
      quote: '“Your body can do anything. It\'s your mind you have to convince.”',
      quoteAuthor: '— Xenotif®',
      headline: 'Wednesday: the turning point of the week.',
      body: 'Midweek is often when fatigue sets in. But it\'s also when real athletes make the difference. Stick to your routine.',
      challenge: 'Today\'s challenge: a short cardio session or yoga to recover and stay active.',
    },
    {
      subject: '🎯 Thursday — almost Friday, push a little more!',
      quote: '“Every rep, every set, every drop of sweat brings you closer to your goal.”',
      quoteAuthor: '— Xenotif®',
      headline: 'Today\'s effort is tomorrow\'s transformation.',
      body: 'Thursday is the week\'s final sprint. You\'ve already done the hardest part. Today, give the rest — your future self will thank you.',
      challenge: 'Today\'s challenge: finish a full session and log your progress in your tracker.',
    },
    {
      subject: '🏆 Friday — finish the week strong!',
      quote: '“Success isn\'t about talent, it\'s about consistency.”',
      quoteAuthor: '— Dwayne Johnson',
      headline: 'Finishing on Friday is the best feeling.',
      body: 'A full week of training — that\'s 52 weeks a year of progress. Those who train on Friday are the ones who transform their bodies for good.',
      challenge: 'Today\'s challenge: an intense session, push your limits — it\'s the week\'s last effort!',
    },
    {
      subject: '🌟 Active Saturday — enjoy it and keep moving!',
      quote: '“The body achieves what the mind believes.”',
      quoteAuthor: '— Napoleon Hill',
      headline: 'Saturday: active recovery or a new challenge.',
      body: 'The weekend isn\'t a break, it\'s an opportunity. A short session or some outdoor activity will keep your momentum and boost your mood all day.',
      challenge: 'Today\'s challenge: outdoor sport, swimming, cycling or a light session — 30 min is enough!',
    },
  ],
}

export async function sendDailyMotivationEmail({
  email, name, locale: rawLocale,
}: {
  email: string; name: string; locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const dayIndex = new Date().getDay() // 0=Sunday … 6=Saturday
  const msg = DAILY_MESSAGES[locale][dayIndex]
  const firstName = name ? name.split(' ')[0] : ''
  const labels = en
    ? { challenge: 'Today\'s challenge', cta: 'Start my session →', unsub: 'You receive this daily email because you\'re subscribed to Xenotif®.', prefs: 'Manage my preferences' }
    : { challenge: 'Défi du jour', cta: 'Commencer ma séance →', unsub: 'Tu reçois cet email quotidien car tu es abonné(e) à Xenotif®.', prefs: 'Gérer mes préférences' }

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
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;color:#F97316;text-transform:uppercase;">${labels.challenge}</p>
        <p style="margin:0;color:#fff;font-size:14px;line-height:1.6;">${msg.challenge}</p>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${BASE_URL}/dashboard"
           style="display:inline-block;background:#F97316;color:#fff;padding:16px 36px;border-radius:50px;font-weight:900;font-size:15px;text-decoration:none;letter-spacing:0.5px;">
          ${labels.cta}
        </a>
      </div>

      <p style="color:#374151;font-size:12px;text-align:center;line-height:1.6;">
        ${labels.unsub}<br/>
        <a href="${BASE_URL}/dashboard/abonnement" style="color:#6B7280;">${labels.prefs}</a>
      </p>
    `, locale),
  })
}

export async function sendCancellationEmail({
  email, name, locale: rawLocale,
}: {
  email: string; name: string; locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const first = name ? name.split(' ')[0] : ''
  const c = en ? {
    subject: 'Cancellation confirmed — Xenotif®',
    h1: `Cancellation confirmed${first ? `, ${first}` : ''}`,
    intro: 'Your cancellation has been processed. You keep full access until the end of your billing period.',
    sad: 'We\'re sad to see you go. 😢',
    comeback: 'If you change your mind, you can reactivate your subscription anytime from your member area. All your progress is saved.',
    cta: 'Reactivate my subscription',
    questions: 'Questions? Reply to this email or contact us at',
  } : {
    subject: 'Résiliation confirmée — Xenotif®',
    h1: `Résiliation confirmée${first ? `, ${first}` : ''}`,
    intro: 'Ta résiliation a bien été prise en compte. Tu gardes un accès complet jusqu\'à la fin de ta période de facturation.',
    sad: 'On est tristes de te voir partir. 😢',
    comeback: 'Si tu changes d\'avis, tu peux réactiver ton abonnement à tout moment depuis ton espace membre. Toute ta progression est sauvegardée.',
    cta: 'Réactiver mon abonnement',
    questions: 'Des questions ? Réponds à cet email ou contacte-nous à',
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: c.subject,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        ${c.h1}
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${c.intro}
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 16px;font-weight:700;color:#fff;">${c.sad}</p>
        <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0 0 16px;">
          ${c.comeback}
        </p>
        <a href="${BASE_URL}/dashboard/abonnement"
           style="display:inline-block;border:2px solid #F97316;color:#F97316;padding:12px 24px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          ${c.cta}
        </a>
      </div>

      <p style="color:#6B7280;font-size:13px;">
        ${c.questions}
        <a href="mailto:contact@xenotif.com" style="color:#F97316;">contact@xenotif.com</a>
      </p>
    `, locale),
  })
}

// Email de réactivation (win-back) — envoyé aux abonnés résiliés (status 'canceled')
// par le cron /api/cron/reactivation. On rappelle ce qu'ils manquent + que leur
// progression est sauvegardée, et on invite à réactiver. Aucun faux code promo.
export async function sendReactivationEmail({
  email, name, locale: rawLocale,
}: {
  email: string; name: string; locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const first = name ? name.split(' ')[0] : ''
  const missing = en ? [
    '🤖 Your personalized AI coach', '🏋️ The 10 disciplines & every program',
    '📊 Progress tracking & statistics', '🎥 HD training videos', '🔥 Daily challenges, XP & badges',
  ] : [
    '🤖 Ton coach IA personnalisé', '🏋️ Les 10 disciplines & tous les programmes',
    '📊 Le suivi & les statistiques de progression', '🎥 Les vidéos d\'entraînement HD', '🔥 Les défis quotidiens, l\'XP & les badges',
  ]
  const c = en ? {
    subject: `We saved your spot 💪 — come back to Xenotif®`,
    h1: `We miss you${first ? `, ${first}` : ''} 💪`,
    intro: 'Your account and all your progress are still here, exactly where you left them. Whenever you\'re ready, you can pick up right where you stopped.',
    missingTitle: 'Here\'s what\'s waiting for you:',
    nudge: 'No card needed to look around — and reactivating takes one click. Your best shape is still ahead of you.',
    cta: 'Reactivate my access →',
    ps: 'Stopped for a reason? Just reply to this email — we read every message and we\'d love your feedback.',
  } : {
    subject: `On t'a gardé ta place 💪 — reviens sur Xenotif®`,
    h1: `Tu nous manques${first ? `, ${first}` : ''} 💪`,
    intro: 'Ton compte et toute ta progression sont toujours là, exactement où tu les as laissés. Dès que tu es prêt(e), tu peux reprendre là où tu t\'es arrêté(e).',
    missingTitle: 'Voilà ce qui t\'attend :',
    nudge: 'Pas besoin de carte pour jeter un œil — et réactiver, c\'est un clic. Ta meilleure forme est encore devant toi.',
    cta: 'Réactiver mon accès →',
    ps: 'Tu as arrêté pour une raison ? Réponds simplement à cet email — on lit chaque message et ton retour nous intéresse.',
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: c.subject,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">
        ${c.h1}
      </h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${c.intro}
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-weight:700;color:#fff;">${c.missingTitle}</p>
        <ul style="margin:0 0 20px;padding:0;list-style:none;color:#9CA3AF;font-size:14px;line-height:2.2;">
          ${missing.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <a href="${BASE_URL}/dashboard/abonnement"
           style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">
          ${c.cta}
        </a>
        <p style="color:#6B7280;font-size:12px;margin:14px 0 0;">${c.nudge}</p>
      </div>

      <p style="color:#6B7280;font-size:13px;">
        ${c.ps}
      </p>
    `, locale),
  })
}

export async function sendAbandonedCartEmail({
  email, items, total, recoverUrl, locale: rawLocale,
}: {
  email: string
  items: { name: string; price: string; image: string }[]
  total: string
  recoverUrl: string
  locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const c = en ? {
    subject: '🛒 You left something in your Xenotif® cart',
    h1: 'Your cart is waiting 💪',
    intro: 'You left items in your cart. Complete your order before they\'re gone!',
    total: 'Total',
    cta: 'Complete my order →',
    perks: '🚚 Free shipping over €50 &nbsp;·&nbsp; ↩️ 30-day returns &nbsp;·&nbsp; 🔒 Secure payment',
  } : {
    subject: '🛒 Tu as oublié quelque chose dans ton panier Xenotif®',
    h1: 'Ton panier t\'attend 💪',
    intro: 'Tu as laissé des articles dans ton panier. Termine ta commande avant qu\'ils ne partent !',
    total: 'Total',
    cta: 'Finaliser ma commande →',
    perks: '🚚 Livraison offerte dès 50€ &nbsp;·&nbsp; ↩️ Retours 30 jours &nbsp;·&nbsp; 🔒 Paiement sécurisé',
  }

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
    subject: c.subject,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">${c.h1}</h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${c.intro}
      </p>

      <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:20px 24px;margin-bottom:8px;">
        <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
        <table style="width:100%;margin-top:16px;"><tr>
          <td style="color:#fff;font-weight:900;font-size:16px;">${c.total}</td>
          <td style="text-align:right;color:#F97316;font-weight:900;font-size:18px;">${total}</td>
        </tr></table>
      </div>

      <a href="${recoverUrl}"
         style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:16px 0;">
        ${c.cta}
      </a>

      <div style="margin-top:8px;color:#9CA3AF;font-size:13px;line-height:1.8;">
        ${c.perks}
      </div>
    `, locale),
  })
}

// ─── Livraison des programmes/guides digitaux après achat ──────────────
export async function sendDigitalDeliveryEmail({
  email, name, sessionId, items, locale: rawLocale,
}: {
  email: string
  name?: string
  sessionId: string
  items: { id: string; name: string }[]
  locale?: string
}) {
  if (!items.length) return

  const locale = norm(rawLocale)
  const en = locale === 'en'
  const plural = items.length > 1

  const labels = en ? {
    badgeGuide: 'PDF guide · Xenotif®',
    format: 'PDF format · Lifetime access · Works on all devices',
    download: '↓&nbsp;&nbsp;Download the PDF',
    confirmed: '&#10003; Order confirmed',
    h1: `${plural ? 'Your guides are ready' : 'Your guide is ready'} 📘`,
    hello: name ? `Thanks ${name.split(' ')[0]} 🙌` : 'Thanks for your trust 🙌',
    intro: (hello: string) => `${hello} — your guide${plural ? 's are' : ' is'} available right away. Download ${plural ? 'them' : 'it'} below: ${plural ? 'they\'re' : 'it\'s'} yours forever.`,
    perks: '🔒 Secure link &nbsp;·&nbsp; ♾️ Lifetime access &nbsp;·&nbsp; 📱 All devices',
    note: `Keep this email: you can re-download your guide${plural ? 's' : ''} anytime via this link. A question? Just reply to this email — our team responds within 24&nbsp;h.`,
    reviewTitle: 'Enjoyed your guide? ⭐',
    reviewBody: 'Your honest review helps the whole community choose with confidence. It only takes a minute.',
    reviewCta: '★&nbsp;&nbsp;Leave my review',
    subject: 'Your Xenotif® guide is ready 📘',
    preheader: `Your Xenotif® guide${plural ? 's are' : ' is'} available — download your PDF now.`,
  } : {
    badgeGuide: 'Guide PDF · Xenotif®',
    format: 'Format PDF · Accès à vie · Compatible tous appareils',
    download: '↓&nbsp;&nbsp;Télécharger le PDF',
    confirmed: '&#10003; Commande confirmée',
    h1: `${plural ? 'Tes guides sont prêts' : 'Ton guide est prêt'} 📘`,
    hello: name ? `Merci ${name.split(' ')[0]} 🙌` : 'Merci pour ta confiance 🙌',
    intro: (hello: string) => `${hello} — ${plural ? 'tes guides sont disponibles' : 'ton guide est disponible'} immédiatement. Télécharge${plural ? '-les' : '-le'} ci-dessous : ${plural ? 'ils sont' : 'il est'} à toi pour toujours.`,
    perks: '🔒 Lien sécurisé &nbsp;·&nbsp; ♾️ Accès à vie &nbsp;·&nbsp; 📱 Tous appareils',
    note: `Conserve cet email : tu peux retélécharger ${plural ? 'tes guides' : 'ton guide'} à tout moment via ce lien. Une question ? Réponds simplement à cet email — notre équipe te répond sous 24&nbsp;h.`,
    reviewTitle: 'Ton guide te plaît ? ⭐',
    reviewBody: 'Ton avis honnête aide toute la communauté à choisir en confiance. Ça ne te prend qu\'une minute.',
    reviewCta: '★&nbsp;&nbsp;Donner mon avis',
    subject: 'Ton guide Xenotif® est prêt 📘',
    preheader: `${plural ? 'Tes guides Xenotif®' : 'Ton guide Xenotif®'} est disponible — télécharge ton PDF maintenant.`,
  }

  const itemsHtml = items.map(i => {
    const url = `${BASE_URL}/api/boutique/download?session=${encodeURIComponent(sessionId)}&p=${encodeURIComponent(i.id)}`
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1216;border:1px solid #232a33;border-radius:16px;margin:0 0 14px;">
        <tr><td style="padding:22px 24px;">
          <div style="font-weight:800;font-size:10px;letter-spacing:1.5px;color:#FF4500;text-transform:uppercase;margin:0 0 7px;">${labels.badgeGuide}</div>
          <div style="font-weight:800;font-size:16px;color:#ffffff;line-height:1.3;margin:0 0 4px;">${i.name}</div>
          <div style="font-size:12px;color:#6b7280;margin:0 0 18px;">${labels.format}</div>
          <a href="${url}"
             style="display:inline-block;background:#15803d;color:#ffffff;padding:13px 26px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">
            ${labels.download}
          </a>
        </td></tr>
      </table>
    `
  }).join('')

  // CTA « Donne ton avis » → fiche du premier guide acheté (les avis y sont collectés)
  const reviewSlug = getProductById(items[0].id)?.slug
  const reviewUrl = reviewSlug ? `${BASE_URL}${en ? '/en' : ''}/boutique/${reviewSlug}` : ''
  const reviewHtml = reviewUrl ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1216;border:1px solid #232a33;border-radius:16px;margin:18px 0 0;">
        <tr><td style="padding:22px 24px;">
          <div style="font-weight:800;font-size:16px;color:#ffffff;line-height:1.3;margin:0 0 6px;">${labels.reviewTitle}</div>
          <div style="font-size:13px;color:#9aa2ad;line-height:1.6;margin:0 0 16px;">${labels.reviewBody}</div>
          <a href="${reviewUrl}"
             style="display:inline-block;background:#FF4500;color:#ffffff;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">
            ${labels.reviewCta}
          </a>
        </td></tr>
      </table>
  ` : ''

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: labels.subject,
    html: wrap(`
      <div style="font-weight:800;font-size:11px;letter-spacing:1.5px;color:#16a34a;text-transform:uppercase;margin:0 0 12px;">${labels.confirmed}</div>
      <h1 style="font-size:27px;font-weight:900;margin:0 0 10px;color:#ffffff;line-height:1.2;">
        ${labels.h1}
      </h1>
      <p style="color:#9aa2ad;font-size:15px;line-height:1.65;margin:0 0 26px;">
        ${labels.intro(labels.hello)}
      </p>

      ${itemsHtml}
      ${reviewHtml}

      <table role="presentation" width="100%" style="margin:6px 0 0;"><tr>
        <td style="font-size:12px;color:#6b7280;line-height:1.7;">
          ${labels.perks}
        </td>
      </tr></table>

      <p style="color:#6b7280;font-size:12.5px;line-height:1.7;margin:24px 0 0;border-top:1px solid #1b1f27;padding-top:20px;">
        ${labels.note}
      </p>
    `, locale, labels.preheader),
  })
}

// Email envoyé à la création d'un compte gratuit (confirmation Supabase désactivée).
// Confirme au client que son compte est créé et qu'il est connecté.
export async function sendAccountCreatedEmail({
  email, name, locale: rawLocale,
}: {
  email: string; name: string; locale?: string
}) {
  const locale = norm(rawLocale)
  const en = locale === 'en'
  const first = name ? name.split(' ')[0] : ''
  const c = en ? {
    subject: 'Welcome to Xenotif® — your account is ready!',
    h1: `Welcome${first ? `, ${first}` : ''}! 💪`,
    intro: `Your Xenotif® account is created and you're signed in. Start free with <strong style="color:#F97316;">Strength Training</strong> — go PRO anytime to unlock all 10 disciplines, the AI coach and smartwatch sync.`,
    cta: 'Go to my dashboard →',
    note: 'See you inside!',
  } : {
    subject: 'Bienvenue sur Xenotif® — ton compte est prêt !',
    h1: `Bienvenue${first ? `, ${first}` : ''} ! 💪`,
    intro: `Ton compte Xenotif® est créé et tu es connecté(e). Commence gratuitement avec la <strong style="color:#F97316;">Musculation</strong> — passe à PRO quand tu veux pour débloquer les 10 disciplines, le coach IA et la montre connectée.`,
    cta: 'Accéder à mon espace →',
    note: 'À tout de suite !',
  }
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: c.subject,
    html: wrap(`
      <h1 style="font-size:26px;font-weight:900;margin:0 0 8px;">${c.h1}</h1>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">${c.intro}</p>
      <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#F97316;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;">${c.cta}</a>
      <p style="color:#6B7280;font-size:12px;margin:20px 0 0;">${c.note}</p>
    `, locale),
  })
}
