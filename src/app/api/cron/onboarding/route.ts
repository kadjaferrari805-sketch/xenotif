import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOnboardingEmail } from '@/lib/emails'
import { nextOnboardingStep, accountAgeDays } from '@/lib/onboarding'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Cron d'onboarding (essai gratuit 7 j). Envoie une séquence de 3 emails
 * (J+1 prise en main, J+3 tirer le max, J+6 fin d'essai → PRO) aux nouveaux
 * comptes EN ESSAI, c.-à-d. SANS aucune ligne subscriptions. Un seul email par
 * exécution/jour ; déduplication via profiles.onboarding_step.
 *
 * ⚠️ SETUP MANUEL REQUIS : exécuter supabase-onboarding.sql (ajoute la colonne
 * profiles.onboarding_step). Sans elle, la requête renvoie 500 et n'envoie RIEN.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Comptes AVEC un abonnement (payant ou résilié) → exclus de l'onboarding essai.
  const { data: subs, error: subErr } = await supabase.from('subscriptions').select('user_id')
  if (subErr) {
    console.error('[onboarding] subscriptions query error:', subErr)
    return NextResponse.json({ error: subErr.message }, { status: 500 })
  }
  const hasSub = new Set((subs ?? []).map((s: { user_id: string }) => s.user_id))

  // Étape déjà envoyée + prénom + langue (la colonne onboarding_step doit exister).
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, full_name, locale, onboarding_step')
  if (profErr) {
    console.error('[onboarding] profiles query error:', profErr)
    return NextResponse.json({ error: profErr.message }, { status: 500 })
  }
  const stepById = new Map<string, number>(
    (profiles ?? []).map((p: { id: string; onboarding_step: number | null }) => [p.id, p.onboarding_step ?? 0]),
  )
  const nameById = new Map<string, string | null>(
    (profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]),
  )
  const localeById = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; locale: string | null }) => [p.id, p.locale ?? 'fr']),
  )

  let sent = 0
  const errors: string[] = []

  // Parcours des comptes auth (source de vérité pour email + date de création).
  for (let page = 1; page <= 25; page++) {
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (listErr) {
      console.error('[onboarding] listUsers error:', listErr)
      break
    }

    for (const u of list.users) {
      if (!u.email || hasSub.has(u.id)) continue
      const age = accountAgeDays(u.created_at)
      const current = stepById.get(u.id) ?? 0
      const step = nextOnboardingStep(age, current)
      if (!step) continue

      try {
        await sendOnboardingEmail({
          email: u.email,
          name: nameById.get(u.id) ?? '',
          step,
          locale: localeById.get(u.id) ?? 'fr',
        })
        await supabase
          .from('profiles')
          .upsert({ id: u.id, onboarding_step: step }, { onConflict: 'id' })
        sent++
      } catch (e) {
        errors.push(`onboarding ${u.email} (step ${step}): ${e}`)
      }
    }

    if (list.users.length < 200) break
  }

  console.log(`[onboarding] emails=${sent} errors=${errors.length}`)
  return NextResponse.json({ sent, errors })
}
