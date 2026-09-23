import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { claimEvent } from '@/lib/supabase/claim'
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
  // K8.9-01 — le message Postgres nommait table, colonne et contrainte, et
  // partait tel quel au client. Il reste journalisé en entier ci-dessous ; la
  // réponse reprend la convention générique K8.1 (`server_error`), déjà employée
  // par cron/abandoned-cart et cron/reactivation.
  const { data: subs, error: subErr } = await supabase.from('subscriptions').select('user_id')
  if (subErr) {
    console.error('[onboarding] subscriptions query error:', subErr)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
  const hasSub = new Set((subs ?? []).map((s: { user_id: string }) => s.user_id))

  // Étape déjà envoyée + prénom + langue (la colonne onboarding_step doit exister).
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, full_name, locale, onboarding_step')
  if (profErr) {
    console.error('[onboarding] profiles query error:', profErr)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
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

  // K8.9-02 — l'adresse ne quitte plus le serveur : le log retient l'identifiant
  // de compte, qui suffit au diagnostic et n'est pas une donnée personnelle.
  let sent = 0
  let failed = 0

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

      // ── K8.12.7 — APPROPRIATION AVANT ENVOI.
      //
      // L'UPDATE conditionnel est atomique : PostgreSQL n'accorde la ligne qu'à
      // UN seul exécutant. La garde `onboarding_step = current` rejoue, AU
      // MOMENT de l'écriture, la valeur lue au SELECT — ce que le SELECT seul ne
      // peut pas garantir. L'identité protégée est donc bien le couple
      // (profile.id, onboarding_step), et non le seul profil.
      //
      // L'ISOLATION DES ÉTAPES EST STRUCTURELLE : `nextOnboardingStep` ne rend
      // l'étape N que si `currentStep < N`. Le claim fait PROGRESSER la valeur
      // (0→1, 1→2, 2→3) ; s'approprier l'étape 2 laisse `current = 2`, ce qui
      // rend l'étape 3 éligible au cycle suivant. Un claim ne bloque jamais
      // l'étape d'après.
      //
      // `update` ET NON `upsert` : la ligne `profiles` est garantie par le
      // trigger `on_auth_user_created` → `handle_new_user()`. Un `upsert` ne
      // pourrait pas porter de garde conditionnelle, et créerait la ligne au
      // lieu de perdre le claim. Si la ligne manquait malgré tout, l'issue est
      // CLAIM_LOST : aucun envoi, aucune étape consommée — fail-safe.
      //
      // ⚠️ COMPROMIS ASSUMÉ (K8.12.3 §G) : l'appropriation est DÉFINITIVE. Un
      // échec d'envoi après ce point consomme l'étape sans e-mail parti. Aucune
      // compensation : restaurer `onboarding_step` rouvrirait la fenêtre de
      // doublon que cette phase ferme.
      const claim = await claimEvent(
        supabase
          .from('profiles')
          .update({ onboarding_step: step })
          .eq('id', u.id)
          .eq('onboarding_step', current)
          .select('id'),
      )

      // Un autre exécutant a gagné cette étape : ni succès ni échec pour
      // celui-ci. Aucun compteur, aucun envoi.
      if (claim.outcome === 'CLAIM_LOST') continue

      if (claim.outcome === 'DB_ERROR') {
        // JAMAIS confondu avec CLAIM_LOST : une écriture refusée doit rester
        // visible. Seul le message est journalisé — jamais l'adresse.
        failed++
        console.error('[onboarding] claim echoue :', u.id, `step ${step}`, claim.error.message)
        continue
      }

      try {
        await sendOnboardingEmail({
          email: u.email,
          name: nameById.get(u.id) ?? '',
          step,
          locale: localeById.get(u.id) ?? 'fr',
        })
        sent++
      } catch (e) {
        failed++
        console.error('[onboarding] envoi echoue :', u.id, `step ${step}`, e)
      }
    }

    if (list.users.length < 200) break
  }

  console.log(`[onboarding] emails=${sent} errors=${failed}`)
  return NextResponse.json({ sent, failed })
}
