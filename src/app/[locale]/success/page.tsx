import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { MetaTrack } from '@/components/analytics/MetaTrack'

export const metadata: Metadata = {
  title: 'Paiement confirmé - Xenotif®',
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  { num: '1', text: 'Vérifie ta boîte mail - un email de confirmation t\'a été envoyé.' },
  { num: '2', text: 'Crée ton profil sportif pour que l\'IA personnalise ton programme.' },
  { num: '3', text: 'Choisis ta première discipline et lance ta première séance.' },
]

// Filet de sécurité : synchronise l'abonnement en base si le webhook Stripe est
// en retard quand l'utilisateur atterrit sur la page de succès.
async function syncSubscription(sessionId: string): Promise<void> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })
    if (session.mode !== 'subscription' || !session.customer || !session.subscription) return
    if (typeof session.subscription === 'string') return

    const sub = session.subscription as Stripe.Subscription
    const email = session.customer_details?.email ?? session.customer_email

    const service = await createServiceClient()
    // Rattachement fiable : ID utilisateur passé au checkout, sinon recherche par email.
    const refUserId = session.client_reference_id || session.metadata?.user_id || ''
    let userId: string | null = null
    if (refUserId) {
      const { data: byId } = await service.auth.admin.getUserById(refUserId)
      if (byId?.user) userId = byId.user.id
    }
    if (!userId && email) {
      const { data: users } = await service.auth.admin.listUsers({ perPage: 200 })
      userId = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())?.id ?? null
    }
    if (!userId) return

    const plan = session.metadata?.plan ?? 'pro'

    await service.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer.id,
      stripe_subscription_id: sub.id,
      plan,
      status: sub.status,
      trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
      current_period_end: new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
    }, { onConflict: 'user_id' })
  } catch (err) {
    console.error('syncSubscription error:', err)
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (session_id) await syncSubscription(session_id)

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 bg-sport-dark">
      {/* Signal « essai démarré » (Meta - dédup via eventId côté Pixel + CAPI).
          La conversion d'ACHAT (GA4/Ads) part côté serveur au 1er vrai paiement
          (fin d'essai) : webhook invoice.paid → GA4 Measurement Protocol. */}
      {session_id && <MetaTrack event="Subscribe" eventId={session_id} />}
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sport-orange/8 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} className="text-[#1E7F5A]" aria-hidden="true" />
        </div>

        <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#1E7F5A] mb-3">
          Paiement confirmé
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-sport-fg mb-4 leading-tight">
          Bienvenue dans
          <br />
          <span className="text-sport-orange">la communauté Xenotif® !</span>
        </h1>

        <p className="text-sport-gray text-sm leading-relaxed mb-12 max-w-sm mx-auto">
          Ton essai gratuit de <strong className="text-sport-fg">7 jours</strong> démarre maintenant.
          Aucun débit avant la fin de la période d&apos;essai.
        </p>

        {/* Next steps */}
        <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-8 text-left">
          <p className="text-xs font-bold text-sport-fg uppercase tracking-wider mb-5 flex items-center gap-2">
            <Zap size={13} aria-hidden="true" className="text-sport-orange" />
            Prochaines étapes
          </p>
          <ol className="space-y-4">
            {NEXT_STEPS.map((step) => (
              <li key={step.num} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sport-orange flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5">
                  {step.num}
                </span>
                <p className="text-xs text-sport-gray leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/abonnement" className="btn-primary shadow-lg shadow-sport-orange/20">
            Voir mon abonnement <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Mon espace
          </Link>
        </div>

        <p className="text-[11px] text-sport-gray mt-8">
          Un problème ?{' '}
          <a href="mailto:contact@xenotif.com" className="text-sport-orange hover:underline">
            contact@xenotif.com
          </a>
        </p>
      </div>
    </main>
  )
}
