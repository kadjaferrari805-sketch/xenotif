/**
 * Logique pure du provisioning administratif du portail client Stripe.
 * Aucun accès réseau ici : l'objet `stripe` est fourni par l'appelant, ce qui
 * rend tout ce fichier testable sans clé ni appel réel.
 */

/** Champs historiquement gérés par le script de build, et eux seuls. */
export const MANAGED_PATHS = [
  'default_return_url',
  'business_profile.headline',
  'features.invoice_history.enabled',
  'features.payment_method_update.enabled',
  'features.subscription_cancel.enabled',
  'features.subscription_cancel.mode',
  'features.subscription_cancel.proration_behavior',
  'features.subscription_pause.enabled',
]

// Valeurs reprises telles quelles de l'ancien script : aucune valeur inventée.
// `default_return_url` pointe encore vers l'ancien domaine ; le changer est une
// décision séparée, possible via --return-url ou STRIPE_PORTAL_RETURN_URL.
export const DEFAULT_RETURN_URL = 'https://xenotif.vercel.app/dashboard/abonnement'
export const HEADLINE = 'Gérez votre abonnement Xenotif®'

export function buildTargetConfiguration({ returnUrl = DEFAULT_RETURN_URL } = {}) {
  return {
    default_return_url: returnUrl,
    business_profile: { headline: HEADLINE },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: 'at_period_end', proration_behavior: 'none' },
      subscription_pause: { enabled: false },
    },
  }
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)

function setIn(obj, path, value) {
  const keys = path.split('.')
  let cursor = obj
  for (const key of keys.slice(0, -1)) {
    cursor[key] = cursor[key] ?? {}
    cursor = cursor[key]
  }
  cursor[keys[keys.length - 1]] = value
}

/** Différences sur les seuls champs gérés. Les autres champs ne sont jamais touchés. */
export function computeDiff(current, target) {
  return MANAGED_PATHS.map((champ) => ({ champ, actuel: get(current, champ), cible: get(target, champ) })).filter(
    (d) => d.actuel !== d.cible,
  )
}

/**
 * Charge utile minimale : uniquement les sous-ensembles concernés par une
 * différence. Un sous-objet `features.X` est envoyé en entier, car Stripe attend
 * ses champs obligatoires ensemble.
 */
export function buildUpdatePayload(diff, target) {
  const payload = {}
  for (const { champ } of diff) {
    const keys = champ.split('.')
    if (keys[0] === 'features') {
      payload.features = payload.features ?? {}
      payload.features[keys[1]] = target.features[keys[1]]
    } else if (keys[0] === 'business_profile') {
      setIn(payload, champ, get(target, champ))
    } else {
      payload[champ] = get(target, champ)
    }
  }
  return payload
}

export function stripeKeyMode(key) {
  if (!key) return 'missing'
  if (/^(sk|rk)_live/.test(key)) return 'live'
  if (/^(sk|rk)_test/.test(key)) return 'test'
  return 'unknown'
}

/**
 * Le mode de la clé doit correspondre à la cible demandée explicitement.
 * Une clé LIVE n'est acceptée qu'avec `--live` ; une clé de test n'est jamais
 * utilisée pour viser le portail LIVE.
 */
export function assertKeyAllowed(mode, target) {
  if (mode === 'missing') throw new Error('STRIPE_SECRET_KEY absente.')
  if (mode === 'unknown') throw new Error('Préfixe de clé Stripe inconnu (attendu sk_/rk_).')
  if (target === 'live' && mode !== 'live') {
    throw new Error('Cible LIVE demandée avec une clé de TEST : refusé.')
  }
  if (target === 'test' && mode !== 'test') {
    throw new Error('Clé LIVE fournie sans cible LIVE explicite : relancer avec --live pour viser la production.')
  }
}

/**
 * Lit la configuration PAR DÉFAUT (filtre `is_default`, jamais un choix
 * arbitraire), calcule les différences, et n'écrit qu'avec `apply: true`.
 * Toute erreur Stripe est propagée : pas de faux succès.
 */
export async function runPortal({ stripe, apply = false, target = buildTargetConfiguration(), log = console.log }) {
  const list = await stripe.billingPortal.configurations.list({ is_default: true, limit: 2 })
  const configurations = list?.data ?? []

  if (configurations.length === 0) {
    return { status: 'aucune-configuration-par-defaut', diff: [], configurationId: null }
  }
  if (configurations.length > 1) {
    return { status: 'configuration-par-defaut-ambigue', diff: [], configurationId: null }
  }

  const current = configurations[0]
  const diff = computeDiff(current, target)
  log(`[stripe-portal] configuration par défaut : ${current.id} (livemode=${current.livemode})`)

  if (diff.length === 0) {
    log('[stripe-portal] aucune différence sur les champs gérés.')
    return { status: 'conforme', diff, configurationId: current.id }
  }

  for (const d of diff) log(`[stripe-portal] ${d.champ} : ${JSON.stringify(d.actuel)} → ${JSON.stringify(d.cible)}`)

  if (!apply) {
    log(`[stripe-portal] simulation : ${diff.length} différence(s), aucune écriture. Relancer avec --apply pour appliquer.`)
    return { status: 'simulation', diff, configurationId: current.id }
  }

  const payload = buildUpdatePayload(diff, target)
  await stripe.billingPortal.configurations.update(current.id, payload)
  log(`[stripe-portal] appliqué sur ${current.id}.`)
  return { status: 'applique', diff, configurationId: current.id, payload }
}
