/**
 * @jest-environment node
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  ETAPE_MAX,
  ETAPE_MIN,
  avancerEtape,
  bornerEtape,
  creerSiAbsent,
  doitAfficherOnboarding,
  lireEtat,
  marquerTermine,
  peutReprendre,
  reporter,
  reprendre,
  type LectureEtat,
} from './website-state'

/**
 * Phase 09.7.16 — frontière d'accès de l'onboarding Website.
 *
 * DOUBLE LOCAL PLUTÔT QUE src/test/fake-supabase.ts : ce helper est déclaré
 * pour les tests serveur et sa FakeQuery n'expose ni `lt`, ni `neq`, ni
 * `upsert` avec options — or ce sont exactement les filtres qui portent les
 * garanties testées ici. Le double ci-dessous JOURNALISE la chaîne d'appels,
 * ce qui permet d'affirmer non seulement « l'écriture a eu lieu » mais « elle
 * portait bien les filtres qui la rendent sûre ».
 */
type Reponse = { data: unknown; error: unknown }
type Appel = { methode: string; args: unknown[] }

function doubleSupabase(reponse: Reponse = { data: null, error: null }) {
  const appels: Appel[] = []
  const chaine: Record<string, unknown> = {}

  const journalise = (methode: string) => (...args: unknown[]) => {
    appels.push({ methode, args })
    return chaine
  }

  for (const m of ['select', 'eq', 'lt', 'neq', 'update', 'upsert', 'maybeSingle']) {
    chaine[m] = journalise(m)
  }
  // Rend la chaîne « awaitable » : `await supabase.from(x).update(y).eq(...)`
  // comme `.maybeSingle()` résolvent sur la même réponse.
  chaine.then = <A>(onF?: ((v: Reponse) => A) | null) => Promise.resolve(reponse).then(onF)

  const from = (table: string) => {
    appels.push({ methode: 'from', args: [table] })
    return chaine
  }

  return { client: { from } as unknown as SupabaseClient, appels }
}

const aAppel = (appels: Appel[], methode: string, args: unknown[]) =>
  appels.some(a => a.methode === methode && JSON.stringify(a.args) === JSON.stringify(args))

describe('bornerEtape', () => {
  test.each([
    [0, ETAPE_MIN],
    [1, 1],
    [4, 4],
    [5, ETAPE_MAX],
    [99, ETAPE_MAX],
    [-3, ETAPE_MIN],
  ])('borne %s en %s', (entree, attendu) => {
    expect(bornerEtape(entree)).toBe(attendu)
  })

  test('une valeur non entière retombe sur le minimum', () => {
    expect(bornerEtape(2.5)).toBe(ETAPE_MIN)
    expect(bornerEtape(NaN)).toBe(ETAPE_MIN)
  })
})

describe('doitAfficherOnboarding — la règle de gating', () => {
  const cas: [string, LectureEtat, boolean][] = [
    ['aucune ligne → parcours affiché', { statut: 'absent' }, true],
    ['in_progress → parcours affiché', { statut: 'present', ligne: { state: 'in_progress', current_step: 2 } }, true],
    ['dismissed → tableau de bord', { statut: 'present', ligne: { state: 'dismissed', current_step: 2 } }, false],
    ['completed → tableau de bord', { statut: 'present', ligne: { state: 'completed', current_step: 4 } }, false],
  ]
  test.each(cas)('%s', (_titre, lecture, attendu) => {
    expect(doitAfficherOnboarding(lecture)).toBe(attendu)
  })

  test('LECTURE INDISPONIBLE → on NE redirige PAS', () => {
    // Une panne de lecture ne doit jamais détourner la navigation : confondre
    // « échec » et « jamais commencé » renverrait vers l'onboarding un membre
    // qui l'a déjà terminé.
    expect(doitAfficherOnboarding({ statut: 'indisponible' })).toBe(false)
  })
})

describe('peutReprendre — affichage de la CTA', () => {
  test('uniquement pour un parcours reporté', () => {
    expect(peutReprendre({ statut: 'present', ligne: { state: 'dismissed', current_step: 1 } })).toBe(true)
    expect(peutReprendre({ statut: 'present', ligne: { state: 'in_progress', current_step: 1 } })).toBe(false)
    expect(peutReprendre({ statut: 'present', ligne: { state: 'completed', current_step: 4 } })).toBe(false)
    expect(peutReprendre({ statut: 'absent' })).toBe(false)
    expect(peutReprendre({ statut: 'indisponible' })).toBe(false)
  })
})

describe('lireEtat', () => {
  test('absence de ligne → statut absent', async () => {
    const { client } = doubleSupabase({ data: null, error: null })
    await expect(lireEtat(client, 'u1')).resolves.toEqual({ statut: 'absent' })
  })

  test('ligne présente → statut present', async () => {
    const { client, appels } = doubleSupabase({
      data: { state: 'in_progress', current_step: 3 },
      error: null,
    })
    await expect(lireEtat(client, 'u1')).resolves.toEqual({
      statut: 'present',
      ligne: { state: 'in_progress', current_step: 3 },
    })
    expect(aAppel(appels, 'from', ['website_onboarding'])).toBe(true)
    expect(aAppel(appels, 'eq', ['user_id', 'u1'])).toBe(true)
  })

  test('erreur → statut indisponible, JAMAIS absent', async () => {
    const { client } = doubleSupabase({ data: null, error: { message: 'boom' } })
    await expect(lireEtat(client, 'u1')).resolves.toEqual({ statut: 'indisponible' })
  })

  test('rejet réseau → statut indisponible, sans lever', async () => {
    const client = {
      from: () => {
        throw new Error('network down')
      },
    } as unknown as SupabaseClient
    await expect(lireEtat(client, 'u1')).resolves.toEqual({ statut: 'indisponible' })
  })
})

describe('creerSiAbsent — ne doit jamais écraser un parcours terminé', () => {
  test('emploie ignoreDuplicates, et non un upsert ordinaire', async () => {
    const { client, appels } = doubleSupabase()
    await creerSiAbsent(client, 'u1')

    const upsert = appels.find(a => a.methode === 'upsert')
    expect(upsert).toBeDefined()
    expect(upsert!.args[0]).toEqual({ user_id: 'u1', state: 'in_progress', current_step: ETAPE_MIN })
    // Sans ignoreDuplicates, un conflit déclencherait un UPDATE qui
    // réinitialiserait un membre déjà 'completed'.
    expect(upsert!.args[1]).toEqual({ onConflict: 'user_id', ignoreDuplicates: true })
  })
})

describe('avancerEtape — monotonie garantie par les filtres', () => {
  test('n’écrit que sur une ligne in_progress ET une étape strictement inférieure', async () => {
    const { client, appels } = doubleSupabase()
    await avancerEtape(client, 'u1', 3)

    expect(aAppel(appels, 'update', [{ current_step: 3 }])).toBe(true)
    expect(aAppel(appels, 'eq', ['user_id', 'u1'])).toBe(true)
    // Protège dismissed et completed :
    expect(aAppel(appels, 'eq', ['state', 'in_progress'])).toBe(true)
    // Interdit toute régression 4 → 3 → 2 :
    expect(aAppel(appels, 'lt', ['current_step', 3])).toBe(true)
  })

  test('une étape hors bornes est ramenée dans l’intervalle avant écriture', async () => {
    const { client, appels } = doubleSupabase()
    await avancerEtape(client, 'u1', 99)
    expect(aAppel(appels, 'update', [{ current_step: ETAPE_MAX }])).toBe(true)
    expect(aAppel(appels, 'lt', ['current_step', ETAPE_MAX])).toBe(true)
  })
})

describe('reporter / reprendre — transitions gardées', () => {
  test('reporter n’agit que depuis in_progress', async () => {
    const { client, appels } = doubleSupabase()
    await reporter(client, 'u1')
    expect(aAppel(appels, 'update', [{ state: 'dismissed' }])).toBe(true)
    expect(aAppel(appels, 'eq', ['state', 'in_progress'])).toBe(true)
  })

  test('reprendre n’agit que depuis dismissed', async () => {
    const { client, appels } = doubleSupabase()
    await reprendre(client, 'u1')
    expect(aAppel(appels, 'update', [{ state: 'in_progress' }])).toBe(true)
    expect(aAppel(appels, 'eq', ['state', 'dismissed'])).toBe(true)
    // Ne doit JAMAIS pouvoir rouvrir un parcours terminé.
    expect(aAppel(appels, 'eq', ['state', 'completed'])).toBe(false)
  })
})

describe('marquerTermine — terminal et idempotent', () => {
  test('écrit completed + étape finale, et exclut les lignes déjà completed', async () => {
    const { client, appels } = doubleSupabase()
    await marquerTermine(client, 'u1')

    expect(aAppel(appels, 'update', [{ state: 'completed', current_step: ETAPE_MAX }])).toBe(true)
    expect(aAppel(appels, 'eq', ['user_id', 'u1'])).toBe(true)
    // `neq` rend l'appel idempotent : un double-clic ou un onglet concurrent
    // ne réécrit aucune ligne.
    expect(aAppel(appels, 'neq', ['state', 'completed'])).toBe(true)
  })

  test('aucune transition completed → in_progress n’est exposée par l’API', () => {
    // Seul `reprendre` remet en in_progress, et il filtre sur dismissed.
    const source = reprendre.toString()
    expect(source).toContain('dismissed')
  })
})
