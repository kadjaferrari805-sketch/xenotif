import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendTrialReminderEmail, sendCancellationEmail, sendDigitalDeliveryEmail } from '@/lib/emails'
import { getProductById } from '@/lib/boutique/products'
import { sendMetaConversion } from '@/lib/meta-capi'
import { sendGa4Purchase } from '@/lib/ga-measurement'
import { findUserIdByEmail, linkSubscriptionToUser, subscriptionRow } from '@/lib/billing/stripe-subscription'
import { createStripeClient } from '@/lib/stripe/server'
import { assertWebhookEventAllowed, getPublicBaseUrl } from '@/lib/env/deployment'

export const runtime = 'nodejs'

// Client Stripe construit à la demande : la garde d'environnement (clé TEST
// obligatoire hors production) s'applique à chaque appel, et non au chargement
// du module. Avant, une clé LIVE aurait été utilisée telle quelle en preview.
let stripeSingleton: Stripe | null = null
function stripeClient(): Stripe {
  if (!stripeSingleton) stripeSingleton = createStripeClient()
  return stripeSingleton
}

// Effets de bord non critiques (e-mails, conversions) : un échec est journalisé
// sans faire échouer le webhook. Sinon Stripe rejouerait tout l'événement pour
// un simple e-mail.
async function bestEffort(label: string, task: () => Promise<unknown>): Promise<void> {
  try {
    await task()
  } catch (err) {
    console.error(`[webhook] ${label} :`, err)
  }
}

// Supabase renvoie ses erreurs au lieu de les lever : sans ce contrôle, une
// écriture ratée passait inaperçue et l'événement était acquitté quand même.
function assertNoError(label: string, error: { message: string } | null): void {
  if (error) throw new Error(`${label} : ${error.message}`)
}

// Journal des événements déjà traités (table stripe_events). Best-effort : si la
// table est absente, l'événement est traité comme avant, sans déduplication.
async function alreadyProcessed(service: SupabaseClient, eventId: string): Promise<boolean> {
  const { data, error } = await service.from('stripe_events').select('id').eq('id', eventId).maybeSingle()
  if (error) {
    console.error('[webhook] lecture stripe_events :', error.message)
    return false
  }
  return !!data
}

async function markProcessed(service: SupabaseClient, event: Stripe.Event): Promise<void> {
  const { error } = await service.from('stripe_events').insert({ id: event.id, type: event.type })
  if (error && error.code !== '23505') console.error('[webhook] écriture stripe_events :', error.message)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // Garde d'environnement : clé Stripe refusée (LIVE hors production) → 500,
  // sans jamais appeler Stripe.
  let client: Stripe
  try {
    client = stripeClient()
  } catch (err) {
    console.error('[webhook] configuration Stripe refusée :', err)
    return NextResponse.json({ error: 'Stripe environment guard' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = client.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Un événement LIVE reçu hors production = webhook Stripe LIVE pointé sur une
  // preview : refusé, et rien n'est écrit en base.
  try {
    assertWebhookEventAllowed(event.livemode)
  } catch (err) {
    console.error('[webhook] événement refusé :', err)
    return NextResponse.json({ error: 'Environment mismatch' }, { status: 400 })
  }

  const service = await createServiceClient()

  if (await alreadyProcessed(service, event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    await handleEvent(service, event)
  } catch (err) {
    // 500 → Stripe relance l'événement (nouvelles tentatives sur ~3 jours). Avant,
    // l'erreur était avalée et un abonnement pouvait rester non rattaché sans alerte.
    // Les écritures critiques passent avant les e-mails : un rejeu ne renvoie pas
    // d'e-mail déjà parti.
    console.error(`Error handling ${event.type} (${event.id}):`, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  await markProcessed(service, event)
  return NextResponse.json({ received: true })
}

async function handleEvent(service: SupabaseClient, event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Paiement boutique (mode payment) → relance panier + livraison digitale
      if (session.mode === 'payment') {
        const buyerEmail = session.customer_details?.email ?? session.customer_email
        const buyerName = session.customer_details?.name ?? ''

        if (buyerEmail) {
          const { error } = await service
            .from('abandoned_carts')
            .update({ recovered: true })
            .eq('email', buyerEmail.toLowerCase())
          if (error) console.error('[webhook] relance panier :', error.message)
        }

        // Livraison des guides/programmes digitaux achetés
        const digitalIds = (session.metadata?.digital_ids ?? '')
          .split(',').map(s => s.trim()).filter(Boolean)

        if (buyerEmail && digitalIds.length) {
          const products = digitalIds
            .map(id => getProductById(id))
            .filter((p): p is NonNullable<typeof p> => !!p)

          // Enregistre la commande (idempotent : stripe_session_id unique).
          // L'email de livraison n'est envoyé qu'à la 1re insertion.
          const { error: insertErr } = await service.from('boutique_orders').insert({
            email: buyerEmail.toLowerCase(),
            customer_name: buyerName,
            stripe_session_id: session.id,
            product_ids: digitalIds,
            amount_total: session.amount_total ?? 0,
          })

          if (!insertErr) {
            await bestEffort('livraison digitale', () => sendDigitalDeliveryEmail({
              email: buyerEmail,
              name: buyerName,
              sessionId: session.id,
              items: products.map(p => ({ id: p.id, name: p.name })),
              locale: session.metadata?.locale,
            }))
          } else if (insertErr.code !== '23505') {
            assertNoError('commande boutique', insertErr)
          }
        }

        // API Conversions Meta - achat boutique (déduplication via session.id côté Pixel)
        if (buyerEmail && (session.amount_total ?? 0) > 0) {
          await bestEffort('conversion Meta boutique', () => sendMetaConversion({
            eventName: 'Purchase',
            eventId: session.id,
            email: buyerEmail,
            value: (session.amount_total ?? 0) / 100,
            currency: (session.currency ?? 'eur').toUpperCase(),
          }))
        }
        return
      }

      if (session.mode !== 'subscription' || !session.subscription) return

      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id
      const customerEmail = session.customer_details?.email ?? session.customer_email ?? null
      const customerName = session.customer_details?.name ?? ''
      const plan = 'pro' // palier unique
      const locale = session.metadata?.locale ?? 'fr'

      const sub = await stripeClient().subscriptions.retrieve(subscriptionId)

      // Rattachement : l'ID posé au checkout depuis la session serveur
      // (client_reference_id), puis l'email, puis la création du compte.
      const refUserId = session.client_reference_id || session.metadata?.user_id || ''
      let userId: string | null = null
      let userEmail: string | null = customerEmail
      let isNewUser = false

      if (refUserId) {
        const { data: byId } = await service.auth.admin.getUserById(refUserId)
        if (byId?.user) {
          userId = byId.user.id
          userEmail = byId.user.email ?? userEmail
        }
      }
      if (!userId && customerEmail) {
        userId = await findUserIdByEmail(service, customerEmail)
      }
      if (!userId && customerEmail) {
        const { data: created, error: createError } = await service.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
          user_metadata: { full_name: customerName },
        })
        if (created?.user) {
          userId = created.user.id
          isNewUser = true
          const { error: profileError } = await service
            .from('profiles')
            .upsert({ id: userId, full_name: customerName, locale }, { onConflict: 'id' })
          assertNoError('profil du nouveau compte', profileError)
        } else {
          // Création concurrente (rejeu, page /success) : le compte existe peut-être déjà.
          userId = await findUserIdByEmail(service, customerEmail)
          if (!userId) throw new Error(`création du compte : ${createError?.message ?? 'erreur inconnue'}`)
        }
      }
      if (!userId) {
        console.error(`[webhook] abonnement ${sub.id} sans compte ni email : non rattaché`)
        return
      }

      const outcome = await linkSubscriptionToUser(service, userId, sub)
      if (outcome !== 'linked') {
        console.warn(`[webhook] abonnement ${sub.id} non rattaché au compte ${userId} : ${outcome}`)
      }

      // Email de confirmation (nouvel utilisateur OU compte existant), si le rattachement a eu lieu.
      if (outcome === 'linked' && userEmail) {
        const email = userEmail
        await bestEffort('email de bienvenue', async () => {
          let setupLink = `${getPublicBaseUrl()}/dashboard`
          if (isNewUser) {
            const { data: linkData } = await service.auth.admin.generateLink({ type: 'recovery', email })
            setupLink = linkData?.properties?.action_link ?? setupLink
          }
          await sendWelcomeEmail({ email, name: customerName, plan, setupLink, locale })
        })
      }

      // API Conversions Meta - abonnement (essai) démarré (déduplication via session.id côté Pixel).
      // Signaux de correspondance (fbp/fbc/IP/UA) captés au checkout → bien meilleur match.
      await bestEffort('conversion Meta abonnement', () => sendMetaConversion({
        eventName: 'Subscribe',
        eventId: session.id,
        email: customerEmail,
        fbp: sub.metadata?.fb_fbp,
        fbc: sub.metadata?.fb_fbc,
        clientIpAddress: sub.metadata?.fb_ip,
        clientUserAgent: sub.metadata?.fb_ua,
      }))
      return
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const { data: existing, error: readError } = await service
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', sub.id)
        .maybeSingle()
      assertNoError('lecture abonnement', readError)
      if (!existing) return

      const { status, plan, trial_end, current_period_end, cancel_at_period_end } = subscriptionRow(sub, existing.user_id)
      const { error: updateError } = await service
        .from('subscriptions')
        .update({ status, plan, trial_end, current_period_end, cancel_at_period_end })
        .eq('stripe_subscription_id', sub.id)
      assertNoError('mise à jour abonnement', updateError)

      if (sub.trial_end) {
        const daysLeft = Math.ceil((sub.trial_end * 1000 - Date.now()) / 86400000)
        if (daysLeft === 3) {
          await bestEffort('rappel fin d’essai', async () => {
            const { data: profile } = await service
              .from('profiles')
              .select('full_name, locale')
              .eq('id', existing.user_id)
              .maybeSingle()
            const { data: userData } = await service.auth.admin.getUserById(existing.user_id)
            if (userData?.user?.email) {
              await sendTrialReminderEmail({
                email: userData.user.email,
                name: profile?.full_name ?? '',
                daysLeft,
                locale: sub.metadata?.locale ?? profile?.locale ?? 'fr',
              })
            }
          })
        }
      }
      return
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { error: updateError } = await service.from('subscriptions').update({
        status: 'canceled',
        cancel_at_period_end: false,
      }).eq('stripe_subscription_id', sub.id)
      assertNoError('résiliation abonnement', updateError)

      const { data: existing } = await service
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', sub.id)
        .maybeSingle()

      if (existing) {
        await bestEffort('email de résiliation', async () => {
          const { data: profile } = await service
            .from('profiles')
            .select('full_name, locale')
            .eq('id', existing.user_id)
            .maybeSingle()
          const { data: userData } = await service.auth.admin.getUserById(existing.user_id)
          if (userData?.user?.email) {
            await sendCancellationEmail({
              email: userData.user.email,
              name: profile?.full_name ?? '',
              locale: sub.metadata?.locale ?? profile?.locale ?? 'fr',
            })
          }
        })
      }
      return
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = invoice.parent?.subscription_details?.subscription
      if (subId) {
        const subIdStr = typeof subId === 'string' ? subId : subId.id
        const { error } = await service.from('subscriptions').update({
          status: 'past_due',
        }).eq('stripe_subscription_id', subIdStr)
        assertNoError('abonnement impayé', error)
      }
      return
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      // Essai / facture à 0 € → pas une vraie conversion. On ne compte que le 1er
      // vrai paiement (acquisition), UNE seule fois par abonnement (pas les renouvellements).
      if ((invoice.amount_paid ?? 0) <= 0 || !invoice.id) return
      const subRef = invoice.parent?.subscription_details?.subscription
      const subId = typeof subRef === 'string' ? subRef : subRef?.id
      if (!subId) return

      const { data: row, error: readError } = await service
        .from('subscriptions')
        .select('ga_purchase_sent')
        .eq('stripe_subscription_id', subId)
        .maybeSingle()
      assertNoError('lecture conversion', readError)
      if (!row || row.ga_purchase_sent) return

      const invoiceId = invoice.id
      const sub = await stripeClient().subscriptions.retrieve(subId)
      const clientId = sub.metadata?.ga_client_id ?? ''
      const plan = sub.metadata?.plan ?? 'pro'
      const value = (invoice.amount_paid ?? 0) / 100
      const currency = (invoice.currency ?? 'eur').toUpperCase()
      if (clientId) {
        await bestEffort('conversion GA4', () => sendGa4Purchase({
          clientId,
          transactionId: invoiceId,
          value,
          currency,
          items: [{ item_id: plan, item_name: `Abonnement ${plan}` }],
        }))
      }
      // API Conversions Meta - vrai paiement (fin d'essai) : Meta optimise alors sur
      // les vrais payeurs, pas seulement les débuts d'essai. Dédup via invoice.id.
      await bestEffort('conversion Meta paiement', () => sendMetaConversion({
        eventName: 'Purchase',
        eventId: invoiceId,
        email: invoice.customer_email,
        value,
        currency,
        fbp: sub.metadata?.fb_fbp,
        fbc: sub.metadata?.fb_fbc,
        clientIpAddress: sub.metadata?.fb_ip,
        clientUserAgent: sub.metadata?.fb_ua,
      }))
      // Marqué traité même sans client_id (visiteur non consentant) → évite de
      // re-vérifier à chaque renouvellement.
      const { error: flagError } = await service
        .from('subscriptions')
        .update({ ga_purchase_sent: true })
        .eq('stripe_subscription_id', subId)
      assertNoError('marquage conversion', flagError)
      return
    }
  }
}
