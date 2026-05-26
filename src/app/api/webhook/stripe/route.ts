import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendTrialReminderEmail, sendCancellationEmail } from '@/lib/emails'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

function subPeriodEnd(sub: Stripe.Subscription): string {
  return new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString()
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

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
        if (session.mode !== 'subscription') break

        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const customerEmail = session.customer_details?.email ?? session.customer_email
        const customerName = session.customer_details?.name ?? ''
        const plan = session.metadata?.plan ?? 'pro'

        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null
        const periodEnd = subPeriodEnd(sub)
        const status = sub.status

        if (!customerEmail) break

        // Find or create user
        const { data: existingUsers } = await service.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find(u => u.email === customerEmail)

        let userId: string
        if (existingUser) {
          userId = existingUser.id
        } else {
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

          await service.from('profiles').upsert({
            id: userId,
            full_name: customerName,
          }, { onConflict: 'id' })

          const { data: linkData } = await service.auth.admin.generateLink({
            type: 'recovery',
            email: customerEmail,
          })

          await sendWelcomeEmail({
            email: customerEmail,
            name: customerName,
            plan,
            setupLink: linkData?.properties?.action_link ?? `${process.env.NEXT_PUBLIC_URL}/auth/signin`,
          })
        }

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
              .select('full_name')
              .eq('id', existing.user_id)
              .single()
            const { data: userData } = await service.auth.admin.getUserById(existing.user_id)
            if (userData?.user?.email) {
              await sendTrialReminderEmail({
                email: userData.user.email,
                name: profile?.full_name ?? '',
                daysLeft,
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
            .select('full_name')
            .eq('id', existing.user_id)
            .single()
          const { data: userData } = await service.auth.admin.getUserById(existing.user_id)
          if (userData?.user?.email) {
            await sendCancellationEmail({
              email: userData.user.email,
              name: profile?.full_name ?? '',
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
