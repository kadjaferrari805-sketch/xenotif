/**
 * stripe-setup.js — Xenotif®
 * ─────────────────────────────────────────────────────────────
 * Crée automatiquement tous les produits Stripe pour Xenotif®.
 *
 * UTILISATION :
 *   node stripe-setup.js <ta_cle_secrete_stripe>
 *
 * Exemple :
 *   node stripe-setup.js sk_test_abcdef123456
 *
 * Tu trouveras ta clé secrète dans :
 *   Stripe Dashboard → Développeurs → Clés API → Clé secrète
 * ─────────────────────────────────────────────────────────────
 */

const Stripe = require('stripe')

const SECRET_KEY = process.argv[2] || process.env.STRIPE_SECRET_KEY

if (!SECRET_KEY || SECRET_KEY.length < 20) {
  console.error('\n  Cle Stripe manquante.')
  console.error('  Usage : node stripe-setup.js <ta_cle_secrete>\n')
  process.exit(1)
}

const stripe = new Stripe(SECRET_KEY)
const isLive = SECRET_KEY.includes('_live_')

async function run() {
  console.log('\n  Creation des produits Xenotif sur Stripe...')
  console.log('  Mode : ' + (isLive ? 'PRODUCTION (Live)' : 'TEST'))
  console.log('  ' + '-'.repeat(50))

  // ── Plan Pro ─────────────────────────────────────────────
  const proProd = await stripe.products.create({
    name: 'Xenotif - Plan Pro',
    description: [
      'Acces illimite a tous les programmes,',
      'coaching IA personnalise, statistiques avancees,',
      'videos HD, support prioritaire 7j/7',
      'et challenges communautaires.',
    ].join(' '),
    metadata: { plan: 'pro', platform: 'xenotif' },
    url: 'https://xenotif.com/#tarifs',
  })
  console.log('\n  Produit "Plan Pro" cree  : ' + proProd.id)

  const proPrice = await stripe.prices.create({
    product: proProd.id,
    unit_amount: 999,
    currency: 'eur',
    recurring: {
      interval: 'month',
      trial_period_days: 30,
    },
    nickname: 'Pro Mensuel 9,99 EUR',
    metadata: { plan: 'pro' },
  })
  console.log('  Prix mensuel  9,99 EUR  : ' + proPrice.id)

  const proAnnualPrice = await stripe.prices.create({
    product: proProd.id,
    unit_amount: 9990,
    currency: 'eur',
    recurring: {
      interval: 'year',
      trial_period_days: 30,
    },
    nickname: 'Pro Annuel 99,90 EUR (2 mois offerts)',
    metadata: { plan: 'pro_annual' },
  })
  console.log('  Prix annuel  99,90 EUR  : ' + proAnnualPrice.id)

  // ── Plan Elite ────────────────────────────────────────────
  const eliteProd = await stripe.products.create({
    name: 'Xenotif - Plan Elite',
    description: [
      'Tout le plan Pro + coach personnel dedie,',
      'bilan mensuel visio 1-1, plan nutritionnel sur mesure,',
      'analyse biomecanique video',
      'et acces anticipe aux nouveautes.',
    ].join(' '),
    metadata: { plan: 'elite', platform: 'xenotif' },
    url: 'https://xenotif.com/#tarifs',
  })
  console.log('\n  Produit "Plan Elite" cree : ' + eliteProd.id)

  const elitePrice = await stripe.prices.create({
    product: eliteProd.id,
    unit_amount: 2499,
    currency: 'eur',
    recurring: {
      interval: 'month',
      trial_period_days: 30,
    },
    nickname: 'Elite Mensuel 24,99 EUR',
    metadata: { plan: 'elite' },
  })
  console.log('  Prix mensuel 24,99 EUR  : ' + elitePrice.id)

  const eliteAnnualPrice = await stripe.prices.create({
    product: eliteProd.id,
    unit_amount: 24990,
    currency: 'eur',
    recurring: {
      interval: 'year',
      trial_period_days: 30,
    },
    nickname: 'Elite Annuel 249,90 EUR (2 mois offerts)',
    metadata: { plan: 'elite_annual' },
  })
  console.log('  Prix annuel 249,90 EUR  : ' + eliteAnnualPrice.id)

  // ── Coupon de lancement ───────────────────────────────────
  let couponCreated = false
  try {
    await stripe.coupons.create({
      id: 'XENOTIF20',
      name: 'Bienvenue Xenotif - 20% de reduction',
      percent_off: 20,
      duration: 'repeating',
      duration_in_months: 3,
      max_redemptions: 500,
      metadata: { campaign: 'launch' },
    })
    couponCreated = true
    console.log('\n  Coupon XENOTIF20 cree   : -20% pendant 3 mois')
  } catch (err) {
    if (err.code === 'resource_already_exists') {
      console.log('\n  Coupon XENOTIF20        : deja existant (ignore)')
    } else {
      throw err
    }
  }

  // ── Résultat final ────────────────────────────────────────
  const sep = '='.repeat(52)
  console.log('\n\n  ' + sep)
  console.log('  COPIE CES VARIABLES DANS VERCEL')
  console.log('  Settings -> Environment Variables')
  console.log('  ' + sep)
  console.log('\n  STRIPE_SECRET_KEY        = ' + SECRET_KEY)
  console.log('  STRIPE_PRICE_PRO         = ' + proPrice.id)
  console.log('  STRIPE_PRICE_ELITE       = ' + elitePrice.id)
  console.log('  STRIPE_PRICE_PRO_ANNUAL  = ' + proAnnualPrice.id)
  console.log('  STRIPE_PRICE_ELITE_ANNUAL= ' + eliteAnnualPrice.id)
  console.log('  NEXT_PUBLIC_URL          = https://xenotif.com')
  console.log('\n  ' + sep + '\n')

  if (!isLive) {
    console.log('  MODE TEST : relance avec ta cle de production pour finaliser.\n')
  } else {
    console.log('  Configuration PRODUCTION terminee !\n')
  }
}

run().catch((err) => {
  console.error('\n  Erreur Stripe :', err.message, '\n')
  process.exit(1)
})
