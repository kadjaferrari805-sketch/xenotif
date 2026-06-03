import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendTrialReminderEmail, sendCancellationEmail, sendDigitalDeliveryEmail } from '@/lib/emails'
import { getProductById } from '@/lib/boutique/products'
import { sendMetaConversion } from '@/lib/meta-capi'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder')

function subPeriodEnd(sub: Stripe.Subscription): string {
  return new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString()
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

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const service = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Paiement boutique (mode payment) → relance panier + livraison digitale
        if (session.mode === 'payment') {
          const buyerEmail = session.customer_details?.email ?? session.customer_email
          const buyerName = session.customer_details?.name ?? ''

          if (buyerEmail) {
            await service
              .from('abandoned_carts')
              .update({ recovered: true })
              .eq('email', buyerEmail.toLowerCase())
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
              await sendDigitalDeliveryEmail({
                email: buyerEmail,
                name: buyerName,
                sessionId: session.id,
                items: products.map(p => ({ id: p.id, name: p.name })),
                locale: session.metadata?.locale,
              })
            } else if (insertErr.code !== '23505') {
              console.error('orders insert error:', insertErr)
            }
          }

          // API Conversions Meta — achat boutique (déduplication via session.id côté Pixel)
          if (buyerEmail && (session.amount_total ?? 0) > 0) {
            await sendMetaConversion({
              eventName: 'Purchase',
              eventId: session.id,
              email: buyerEmail,
              value: (session.amount_total ?? 0) / 100,
              currency: (session.currency ?? 'eur').toUpperCase(),
            })
          }
          break
        }

        if (session.mode !== 'subscription') break

        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const customerEmail = session.customer_details?.email ?? session.customer_email
        const customerName = session.customer_details?.name ?? ''
        const plan = session.metadata?.plan ?? 'pro'
        const locale = session.metadata?.locale ?? 'fr'

        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null
        const periodEnd = subPeriodEnd(sub)
        const status = sub.status

        // Rattachement FIABLE : on privilégie l'ID utilisateur passé au checkout
        // (client_reference_id / metadata.user_id), puis l'email, puis la création.
        const refUserId = session.client_reference_id || session.metadata?.user_id || ''
        let userId: string | null = null
        let userEmail: string | null = customerEmail ?? null
        let isNewUser = false

        if (refUserId) {
          const { data: byId } = await service.auth.admin.getUserById(refUserId)
          if (byId?.user) {
            userId = byId.user.id
            userEmail = byId.user.email ?? userEmail
          }
        }
        if (!userId && customerEmail) {
          const { data: list } = await service.auth.admin.listUsers({ perPage: 200 })
          const existing = list?.users?.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase())
          if (existing) { userId = existing.id; userEmail = existing.email ?? userEmail }
        }
        if (!userId && customerEmail) {
          const { data: newUser, error: userError } = await service.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: { full_name: customerName },
          })
          if (userError || !newUser.user) {
            console.error('Failed to create user:', userError)
            break
          }
          userId = newUser.user.id
          userEmail = customerEmail
          isNewUser = true
          await service.from('profiles').upsert({ id: userId, full_name: customerName, locale }, { onConflict: 'id' })
        }
        if (!userId) break

        await service.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan,
          status,
          trial_end: trialEnd,
          current_period_end: periodEnd,
          cancel_at_period_end: false,
        }, { onConflict: 'user_id' })

        // Email de confirmation — TOUJOURS (nouvel utilisateur OU compte existant).
        if (userEmail) {
          let setupLink = `${process.env.NEXT_PUBLIC_URL}/dashboard`
          if (isNewUser) {
            const { data: linkData } = await service.auth.admin.generateLink({ type: 'recovery', email: userEmail })
            setupLink = linkData?.properties?.action_link ?? setupLink
          }
          await sendWelcomeEmail({ email: userEmail, name: customerName, plan, setupLink, locale })
        }

        // API Conversions Meta — abonnement (essai) démarré (déduplication via session.id côté Pixel)
        await sendMetaConversion({
          eventName: 'Subscribe',
          eventId: session.id,
          email: customerEmail,
        })

        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const { data: existing } = await service
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', sub.id)
          .single()

        if (!existing) break

        const plan = sub.metadata?.plan
          ?? ((sub.items.data[0]?.price?.unit_amount ?? 0) > 1000 ? 'elite' : 'pro')

        await service.from('subscriptions').update({
          status: sub.status,
          plan,
          trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          current_period_end: subPeriodEnd(sub),
          cancel_at_period_end: sub.cancel_at_period_end,
        }).eq('stripe_subscription_id', sub.id)

        if (sub.trial_end) {
          const daysLeft = Math.ceil((sub.trial_end * 1000 - Date.now()) / 86400000)
          if (daysLeft === 3) {
            const { data: profile } = await service
              .from('profiles')
              .select('full_name, locale')
              .eq('id', existing.user_id)
              .single()
            const { data: userData } = await service.auth.admin.getUserById(existing.user_id)
            if (userData?.user?.email) {
              await sendTrialReminderEmail({
                email: userData.user.email,
                name: profile?.full_name ?? '',
                daysLeft,
                locale: sub.metadata?.locale ?? profile?.locale ?? 'fr',
              })
            }
          }
        }

        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await service.from('subscriptions').update({
          status: 'canceled',
          cancel_at_period_end: false,
        }).eq('stripe_subscription_id', sub.id)

        const { data: existing } = await service
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', sub.id)
          .single()

        if (existing) {
          const { data: profile } = await service
            .from('profiles')
            .select('full_name, locale')
            .eq('id', existing.user_id)
            .single()
          const { data: userData } = await service.auth.admin.getUserById(existing.user_id)
          if (userData?.user?.email) {
            await sendCancellationEmail({
              email: userData.user.email,
              name: profile?.full_name ?? '',
              locale: sub.metadata?.locale ?? profile?.locale ?? 'fr',
            })
          }
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = invoice.parent?.subscription_details?.subscription
        if (subId) {
          const subIdStr = typeof subId === 'string' ? subId : subId.id
          await service.from('subscriptions').update({
            status: 'past_due',
          }).eq('stripe_subscription_id', subIdStr)
        }
        break
      }
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err)
  }

  return NextResponse.json({ received: true })
}
