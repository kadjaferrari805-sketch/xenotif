/**
 * Implémentations de `RateLimitStore` — phase 05-K.5.
 *
 * CHOIX DU STOCKAGE. Le dépôt ne possédait aucun stockage distribué (audit K.5 :
 * 0 Upstash, 0 Vercel KV, 0 Redis, 0 lru-cache). Plutôt que d'introduire un
 * fournisseur externe — nouveau service, nouveau secret, provisioning manuel —
 * on réutilise la base Postgres déjà en place, déjà jointe en `service_role` par
 * trois des quatre routes concernées.
 *
 * ATOMICITÉ. Le comptage passe par la fonction SQL `public.rate_limit_hit`, qui
 * fait l'upsert et l'incrément en une seule instruction. Compter côté
 * application (lire puis écrire) serait contournable par rafale : deux requêtes
 * simultanées liraient le même compteur.
 *
 * POURQUOI PAS LA MÉMOIRE DU PROCESSUS. Sur Vercel, chaque invocation peut
 * atterrir sur une instance distincte : un compteur en mémoire ne protège rien.
 * `InMemoryRateLimitStore` n'existe donc que pour les tests et le développement
 * local, et ne doit jamais servir de mécanisme de sécurité en production.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import { RateLimitStoreUnavailable, type RateLimitStore } from './rate-limit'

/** Compteur en mémoire — TESTS ET DÉVELOPPEMENT UNIQUEMENT. */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly windows = new Map<string, { count: number; resetAtMs: number }>()

  async hit(key: string, windowSeconds: number): Promise<{ count: number; resetAtMs: number }> {
    const now = Date.now()
    const current = this.windows.get(key)
    if (!current || current.resetAtMs <= now) {
      const fresh = { count: 1, resetAtMs: now + windowSeconds * 1000 }
      this.windows.set(key, fresh)
      return { ...fresh }
    }
    current.count += 1
    return { ...current }
  }

  reset(): void {
    this.windows.clear()
  }
}

/**
 * Compteur persistant, adossé à `public.rate_limits` via la RPC
 * `public.rate_limit_hit` (SECURITY DEFINER, EXECUTE réservé à service_role).
 *
 * Toute panne — RPC absente, réseau, permission — lève
 * `RateLimitStoreUnavailable`. C'est l'appelant qui décide alors d'ouvrir ou de
 * fermer, selon le coût de l'action protégée.
 */
export class PostgresRateLimitStore implements RateLimitStore {
  async hit(key: string, windowSeconds: number): Promise<{ count: number; resetAtMs: number }> {
    let data: unknown
    let error: unknown
    try {
      const supabase = createAdminClient()
      const result = await supabase.rpc('rate_limit_hit', {
        p_bucket: key,
        p_window_seconds: windowSeconds,
      })
      data = result.data
      error = result.error
    } catch (cause) {
      // Client Supabase indisponible (variables absentes, garde d'environnement).
      throw new RateLimitStoreUnavailable(cause instanceof Error ? cause.message : undefined)
    }

    if (error) throw new RateLimitStoreUnavailable()

    const row = Array.isArray(data) ? data[0] : data
    const count = (row as { hit_count?: unknown } | null)?.hit_count
    const resetAt = (row as { reset_at?: unknown } | null)?.reset_at

    if (typeof count !== 'number' || typeof resetAt !== 'string') {
      throw new RateLimitStoreUnavailable('unexpected rate_limit_hit payload')
    }

    const resetAtMs = Date.parse(resetAt)
    if (Number.isNaN(resetAtMs)) throw new RateLimitStoreUnavailable('unparsable reset_at')

    return { count, resetAtMs }
  }
}

let shared: RateLimitStore | null = null

/** Store partagé par les routes. Injectable dans les tests via `setRateLimitStore`. */
export function getRateLimitStore(): RateLimitStore {
  if (!shared) shared = new PostgresRateLimitStore()
  return shared
}

export function setRateLimitStore(store: RateLimitStore | null): void {
  shared = store
}
