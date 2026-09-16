/**
 * Limitation de débit des endpoints publics — phase 05-K.5.
 *
 * POURQUOI. L'audit K.4 a établi (finding F-01, P1) que /api/subscribe permet à
 * un tiers non authentifié de faire émettre des e-mails depuis noreply@xenotif.com
 * vers des adresses arbitraires, sans aucune limitation : ni dépendance de rate
 * limiting, ni captcha, ni honeypot, ni protection Vercel. F-02 (/api/contact),
 * F-03 (/api/boutique/save-cart) et F-10 (/api/free-program) partagent la cause.
 *
 * UNE SEULE ABSTRACTION. Ce module est le point d'entrée unique des quatre
 * routes : on ne construit pas quatre systèmes. Le stockage est derrière une
 * interface (`RateLimitStore`) pour rester remplaçable — Postgres aujourd'hui,
 * un KV demain — sans retoucher une seule route.
 *
 * CE QUI N'EST PAS FAIT ICI. Aucun double opt-in : il exigerait une table de
 * jetons de confirmation et un second gabarit d'e-mail, donc une architecture
 * nouvelle. Signalé séparément, hors périmètre K.5.
 */

/** Règle de fenêtre fixe : `limit` requêtes par `windowSeconds`. */
export type RateLimitRule = {
  /** Nombre de requêtes autorisées dans la fenêtre. La (limit+1)ᵉ est refusée. */
  limit: number
  windowSeconds: number
}

export type RateLimitVerdict =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

/**
 * Stockage des compteurs. `hit` incrémente et renvoie l'état de la fenêtre.
 * Toute implémentation doit être atomique : deux appels concourants ne doivent
 * jamais renvoyer le même `count`, sinon la limite est contournable par rafale.
 */
export interface RateLimitStore {
  hit(key: string, windowSeconds: number): Promise<{ count: number; resetAtMs: number }>
}

/** Erreur signalant que le stockage est injoignable — pilote le fail-open/closed. */
export class RateLimitStoreUnavailable extends Error {
  constructor(message = 'rate limit store unavailable') {
    super(message)
    this.name = 'RateLimitStoreUnavailable'
  }
}

// ------------------------------------------------------------------ identifiants

/**
 * IP du client derrière Vercel.
 *
 * `request.ip` a été retiré de Next.js en v15 (cf. node_modules/next/dist/docs,
 * guide de migration v15) ; la voie restante sans dépendance supplémentaire est
 * `x-forwarded-for`, dont Vercel réécrit la valeur en bordure. On ne lit QUE le
 * premier segment : les suivants sont fournis par le client et ne sont pas
 * dignes de confiance. Même convention que src/app/api/checkout/route.ts.
 *
 * Aucun autre en-tête n'est accepté : un client ne doit pas pouvoir se choisir
 * une identité en ajoutant un en-tête arbitraire.
 */
export function clientIp(req: { headers: { get(name: string): string | null } }): string | null {
  const forwarded = req.headers.get('x-forwarded-for')
  if (!forwarded) return null
  const first = forwarded.split(',')[0]?.trim() ?? ''
  if (!first) return null

  // IPv6 entre crochets, éventuellement suivi d'un port : [::1]:443 → ::1
  const bracketed = /^\[([^\]]+)\]/.exec(first)
  if (bracketed) return bracketed[1].toLowerCase()

  // IPv4 avec port : 1.2.3.4:56789 → 1.2.3.4. Un IPv6 nu contient plusieurs
  // « : » et ne doit pas être tronqué.
  const colons = first.split(':')
  if (colons.length === 2) return colons[0].toLowerCase()

  return first.toLowerCase()
}

/** Longueur maximale d'une adresse e-mail (RFC 5321 §4.5.3.1.3). */
export const EMAIL_MAX_LENGTH = 254

/**
 * Normalise une adresse pour en faire une clé de limitation stable et pour la
 * valider. Renvoie `null` si l'entrée n'est pas une adresse plausible.
 *
 * La normalisation reste volontairement conservatrice : minuscules et espaces
 * retirés. On ne retire NI les points NI les suffixes « +tag » — ce serait
 * fusionner des adresses que le fournisseur considère distinctes.
 */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim().toLowerCase()
  if (!value || value.length > EMAIL_MAX_LENGTH) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null
  return value
}

/**
 * Champ-piège. Il est masqué dans le formulaire : un humain ne le remplit
 * jamais, un robot qui remplit tous les champs se trahit. Absent ou vide =
 * légitime, pour rester rétrocompatible avec les clients déjà déployés.
 */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

// ------------------------------------------------------------------ application

/** Une dimension de limitation : un préfixe, une valeur, une règle. */
export type RateLimitDimension = {
  /** Espace de noms de la clé, p. ex. « subscribe:ip ». */
  scope: string
  /** Valeur identifiant l'appelant ; `null` = dimension inapplicable. */
  value: string | null
  rule: RateLimitRule
  /**
   * Dimension indispensable sur une route `failClosed` : si sa valeur est
   * `null`, la requête est refusée sans même consulter les autres.
   *
   * POURQUOI. Sans cela, un appelant dont l'IP n'est pas identifiable
   * échapperait à la borne par IP et n'aurait plus qu'à faire varier l'adresse
   * e-mail pour émettre sans limite — précisément l'abus que K.5 corrige.
   * Derrière Vercel `x-forwarded-for` est toujours renseigné : marquer l'IP
   * requise ne prive donc aucun visiteur légitime.
   */
  required?: boolean
}

export type EnforceOptions = {
  store: RateLimitStore
  dimensions: RateLimitDimension[]
  /**
   * Comportement quand le stockage est injoignable OU qu'aucune dimension n'est
   * applicable (pas d'IP exploitable, par exemple).
   *
   * `true` sur les routes dont l'abus coûte cher ou nuit à la réputation
   * d'expédition ; `false` sur les ressources publiques inoffensives, pour ne
   * jamais transformer une panne de compteur en panne de site.
   */
  failClosed: boolean
}

/**
 * Évalue toutes les dimensions et renvoie le premier refus.
 *
 * Toutes les dimensions sont évaluées même après un refus : sinon un attaquant
 * saturant la limite par IP verrait son compteur par e-mail cesser d'avancer.
 */
export async function enforceRateLimit(options: EnforceOptions): Promise<RateLimitVerdict> {
  const { store, dimensions, failClosed } = options

  // Une dimension déclarée indispensable dont l'identifiant manque ferme la
  // porte : on ne borne pas une action coûteuse sur un seul axe par défaut.
  if (failClosed && dimensions.some(d => d.required && d.value === null)) {
    return { allowed: false, retryAfterSeconds: 60 }
  }

  const applicable = dimensions.filter(d => d.value !== null)

  if (applicable.length === 0) {
    return failClosed ? { allowed: false, retryAfterSeconds: 60 } : { allowed: true }
  }

  let worstRetry = 0

  for (const dimension of applicable) {
    const key = `${dimension.scope}:${dimension.value}`
    let state: { count: number; resetAtMs: number }
    try {
      state = await store.hit(key, dimension.rule.windowSeconds)
    } catch {
      // Le stockage est muet : on ne connaît pas l'état réel du compteur.
      if (failClosed) return { allowed: false, retryAfterSeconds: dimension.rule.windowSeconds }
      continue
    }
    if (state.count > dimension.rule.limit) {
      worstRetry = Math.max(worstRetry, retryAfterFrom(state.resetAtMs))
    }
  }

  return worstRetry > 0 ? { allowed: false, retryAfterSeconds: worstRetry } : { allowed: true }
}

function retryAfterFrom(resetAtMs: number): number {
  const seconds = Math.ceil((resetAtMs - Date.now()) / 1000)
  return Math.max(1, seconds)
}

/**
 * Réponse 429 générique.
 *
 * Le corps ne révèle NI la limite, NI la dimension déclenchée, NI le stockage :
 * un attaquant ne doit pas pouvoir cartographier la protection à partir des
 * réponses. `Retry-After` est en revanche exposé — c'est un en-tête standard,
 * utile aux clients légitimes, et il ne divulgue pas la configuration interne.
 */
export const TOO_MANY_REQUESTS_MESSAGE = 'Trop de requêtes. Réessaie dans quelques instants.'

export function tooManyRequestsBody(): { error: string } {
  return { error: TOO_MANY_REQUESTS_MESSAGE }
}

export function retryAfterHeaders(retryAfterSeconds: number): Record<string, string> {
  return { 'Retry-After': String(Math.max(1, Math.ceil(retryAfterSeconds))) }
}
