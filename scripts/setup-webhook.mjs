/**
 * Ancien script de provisioning Stripe exécuté après chaque build (vercel.json).
 * Il ne fait PLUS RIEN, dans aucun environnement.
 *
 * Pourquoi : il appelait `billingPortal.configurations.update()` sans condition,
 * donc CHAQUE build de production était une écriture Stripe LIVE. Il portait en
 * plus un bloc devenu inatteignable qui supprimait puis recréait un webhook
 * Stripe (sur `xenotif.vercel.app`, alors que l'endpoint réel est `xenotif.com`)
 * et réécrivait STRIPE_WEBHOOK_SECRET dans Vercel avec un jeton de portée compte.
 *
 * Le provisioning du portail client est désormais une opération ADMINISTRATIVE,
 * explicite et hors build :
 *
 *   npm run stripe:portal            → simulation, lecture seule
 *   npm run stripe:portal -- --apply → applique, après confirmation du mode
 *
 * Le webhook Stripe, lui, se gère dans le Dashboard : c'est une opération rare,
 * qui ne doit jamais dépendre d'un build.
 *
 * Ce fichier est conservé (et non supprimé) parce que `vercel.json` l'appelle
 * encore : il garantit qu'un build ne peut plus écrire chez Stripe.
 */
console.log(
  `[setup-webhook] VERCEL_ENV=${process.env.VERCEL_ENV ?? 'absent'} — aucune action. ` +
    'Le provisioning Stripe est désormais administratif : npm run stripe:portal',
)
