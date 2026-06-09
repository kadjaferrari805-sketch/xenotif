import type { SupabaseClient } from '@supabase/supabase-js'
import { getProductById } from '@/lib/boutique/products'
import type { ReviewType, Eligibility } from './types'

// Vérifie qu'un utilisateur connecté a le droit de laisser un avis.
// - product : doit avoir acheté ce guide digital (boutique_orders) ; le produit doit être de type 'digital'.
// - platform : doit avoir un abonnement actif/trialing.
export async function checkEligibility(
  service: SupabaseClient,
  user: { id: string; email?: string | null },
  type: ReviewType,
  productId: string | null,
): Promise<Eligibility> {
  // Nom affiché depuis le profil (fallback email)
  const { data: profile } = await service.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
  const authorName = (profile?.full_name?.trim() || (user.email ?? '').split('@')[0] || 'Client')

  if (type === 'platform') {
    // limit(1) plutôt que maybeSingle() : robuste si l'utilisateur a plusieurs
    // lignes d'abonnement (maybeSingle() lèverait une erreur dans ce cas).
    const { data: subs } = await service
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .limit(1)
    return subs && subs.length > 0
      ? { eligible: true, reason: 'ok', authorName }
      : { eligible: false, reason: 'not_subscriber', authorName }
  }

  // type === 'product'
  const product = productId ? getProductById(productId) : undefined
  if (!product || product.type !== 'digital') {
    return { eligible: false, reason: 'invalid_product', authorName }
  }
  const email = (user.email ?? '').toLowerCase()
  if (!email) return { eligible: false, reason: 'not_buyer', authorName }
  const { data: order } = await service
    .from('boutique_orders')
    .select('id')
    .eq('email', email)
    .contains('product_ids', [productId])
    .limit(1)
    .maybeSingle()
  return order
    ? { eligible: true, reason: 'ok', authorName }
    : { eligible: false, reason: 'not_buyer', authorName }
}
