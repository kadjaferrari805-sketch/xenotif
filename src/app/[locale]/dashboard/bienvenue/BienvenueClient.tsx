'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, ArrowRight, CheckCircle, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  DISCIPLINES,
  DUREE_MAX,
  DUREE_MIN,
  parseDuree,
} from '../progression/ProgressionClient'
import {
  ETAPE_MAX,
  avancerEtape,
  creerSiAbsent,
  marquerTermine,
  reporter,
  reprendre,
} from '@/lib/onboarding/website-state'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { Progress } from '@/components/ui/Progress'

/**
 * OBJECTIFS — VALEURS STRICTEMENT TRANSITOIRES.
 *
 * Elles ne sont JAMAIS écrites en base : ni dans `profiles.main_goal` (colonne
 * Mobile portant deux vocabulaires incompatibles), ni dans une colonne nouvelle.
 * Leur unique rôle est de recommander une discipline à l'étape 3.
 *
 * La correspondance objectif → discipline reprend celle que XenotifFitness
 * applique déjà (RECOMMENDED_DISCIPLINE) : la réutiliser EN INTERFACE SEULE n'a
 * aucun effet sur le Mobile, puisque rien n'est persisté.
 */
const OBJECTIFS = [
  { id: 'weight_loss', discipline: 'hiit' },
  { id: 'muscle_gain', discipline: 'musculation' },
  { id: 'endurance', discipline: 'running-cardio' },
  { id: 'general_fitness', discipline: 'crossfit' },
] as const

type ObjectifId = (typeof OBJECTIFS)[number]['id']

const DISCIPLINE_DEFAUT = 'running-cardio'

export function BienvenueClient({
  userId,
  nomInitial,
  etapeInitiale,
  reprise,
}: {
  userId: string
  nomInitial: string
  etapeInitiale: number
  reprise: boolean
}) {
  const t = useTranslations('dashboard.bienvenue')
  const tDisc = useTranslations('dashboard.progression.disciplines')
  const router = useRouter()

  const [etape, setEtape] = useState(etapeInitiale)
  const [nom, setNom] = useState(nomInitial)
  const [objectif, setObjectif] = useState<ObjectifId | null>(null)
  const [discipline, setDiscipline] = useState(DISCIPLINE_DEFAUT)
  const [duree, setDuree] = useState('45')
  const [occupe, setOccupe] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  const nomDiscipline = (slug: string) => (tDisc.has(slug) ? tDisc(slug) : slug)

  /** Crée la ligne au premier pas, et rouvre un parcours reporté le cas échéant. */
  async function assurerLigne() {
    const supabase = createClient()
    await creerSiAbsent(supabase, userId)
    if (reprise) await reprendre(supabase, userId)
  }

  async function allerA(cible: number) {
    setErreur(null)
    setEtape(cible)
    // L'avancement est persisté au mieux : un échec ne bloque pas le parcours,
    // il coûte seulement la reprise exacte sur un autre appareil.
    const supabase = createClient()
    await avancerEtape(supabase, userId, cible)
  }

  // ÉTAPE 1 — identité. Seule écriture autorisée dans `profiles` : full_name.
  async function validerNom() {
    const propre = nom.trim()
    if (!propre) {
      setErreur(t('errors.name'))
      return
    }
    setErreur(null)
    setOccupe(true)
    try {
      const supabase = createClient()
      await assurerLigne()
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: propre })
        .eq('id', userId)
      if (error) {
        setErreur(t('errors.save'))
        return
      }
      await allerA(2)
    } catch {
      setErreur(t('errors.network'))
    } finally {
      setOccupe(false)
    }
  }

  // ÉTAPE 2 — objectif : transitoire, il pré-sélectionne la discipline.
  function choisirObjectif(id: ObjectifId) {
    setObjectif(id)
    const trouve = OBJECTIFS.find(o => o.id === id)
    if (trouve) setDiscipline(trouve.discipline)
    void allerA(3)
  }

  // ÉTAPE 4 — première séance. Réutilise la validation durcie en 09.7.9.3.
  async function enregistrerSeance() {
    const minutes = parseDuree(duree)
    if (minutes === null) {
      setErreur(t('errors.duration', { min: DUREE_MIN, max: DUREE_MAX }))
      return
    }

    setErreur(null)
    setOccupe(true)
    try {
      const supabase = createClient()

      // ORDRE PRESCRIPTIF, JAMAIS INVERSÉ :
      //   1. insérer la séance   2. confirmer   3. marquer terminé
      // Si l'insertion échoue, l'onboarding RESTE `in_progress`.
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: userId,
          discipline,
          duration_minutes: minutes,
          notes: '',
        })
        .select()
        .single()

      if (error || !data) {
        setErreur(t('errors.save'))
        return
      }

      await marquerTermine(supabase, userId)
      setEtape(5) // écran de confirmation
    } catch {
      setErreur(t('errors.network'))
    } finally {
      setOccupe(false)
    }
  }

  async function plusTard() {
    setOccupe(true)
    try {
      const supabase = createClient()
      await assurerLigne()
      await reporter(supabase, userId)
      router.push('/dashboard')
    } catch {
      setErreur(t('errors.network'))
      setOccupe(false)
    }
  }

  const pourcentage = (Math.min(etape, ETAPE_MAX) / ETAPE_MAX) * 100

  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto pb-24 md:pb-8">
      {/* Progression du parcours */}
      {etape <= ETAPE_MAX && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-black text-sport-fg">{t('title')}</h1>
            <span className="text-xxs font-bold uppercase tracking-wider text-sport-gray">
              {t('stepOf', { n: Math.min(etape, ETAPE_MAX), total: ETAPE_MAX })}
            </span>
          </div>
          <p className="text-sport-gray text-sm mb-4">{t('subtitle')}</p>
          <Progress value={pourcentage} />
        </div>
      )}

      <Card className="hover:-translate-y-0 hover:shadow-sm">
        {/* ÉTAPE 1 — IDENTITÉ */}
        {etape === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-sport-fg">{t('step1.title')}</h2>
              <p className="text-sm text-sport-gray mt-1">{t('step1.subtitle')}</p>
            </div>
            <div>
              <Label htmlFor="bienvenue-nom" className="uppercase tracking-wider">
                {t('step1.label')}
              </Label>
              <Input
                id="bienvenue-nom"
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder={t('step1.placeholder')}
              />
            </div>
            {erreur && <Alert variant="error">{erreur}</Alert>}
            <Button onClick={validerNom} disabled={occupe} className="w-full min-h-[44px]">
              {occupe ? (
                <><Loader size={16} className="text-white" iconClassName="text-white" />{t('saving')}</>
              ) : (
                <>{t('continue')} <ArrowRight size={15} /></>
              )}
            </Button>
          </div>
        )}

        {/* ÉTAPE 2 — OBJECTIF (transitoire) */}
        {etape === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-sport-fg">{t('step2.title')}</h2>
              <p className="text-sm text-sport-gray mt-1">{t('step2.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OBJECTIFS.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => choisirObjectif(o.id)}
                  className={`min-h-[44px] rounded-control border px-4 py-3 text-left text-sm font-bold transition-all ${
                    objectif === o.id
                      ? 'border-sport-orange bg-sport-orange/10 text-sport-orange'
                      : 'border-sport-border bg-sport-card text-sport-fg hover:border-sport-orange/40'
                  }`}
                >
                  {t(`step2.goals.${o.id}`)}
                </button>
              ))}
            </div>
            {erreur && <Alert variant="error">{erreur}</Alert>}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => allerA(1)} className="min-h-[44px]">
                <ArrowLeft size={15} /> {t('back')}
              </Button>
              <Button variant="ghost" onClick={() => allerA(3)} className="min-h-[44px] flex-1">
                {t('skip')}
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — DISCIPLINE DE DÉPART (transitoire) */}
        {etape === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-sport-fg">{t('step3.title')}</h2>
              <p className="text-sm text-sport-gray mt-1">{t('step3.subtitle')}</p>
            </div>
            <div>
              <Label htmlFor="bienvenue-discipline" className="uppercase tracking-wider">
                {t('step3.label')}
              </Label>
              <Select
                id="bienvenue-discipline"
                value={discipline}
                onChange={e => setDiscipline(e.target.value)}
              >
                {DISCIPLINES.map(s => (
                  <option key={s} value={s}>{nomDiscipline(s)}</option>
                ))}
              </Select>
            </div>
            {erreur && <Alert variant="error">{erreur}</Alert>}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => allerA(2)} className="min-h-[44px]">
                <ArrowLeft size={15} /> {t('back')}
              </Button>
              <Button onClick={() => allerA(4)} className="min-h-[44px] flex-1">
                {t('continue')} <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 — PREMIÈRE SÉANCE */}
        {etape === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-sport-fg">{t('step4.title')}</h2>
              <p className="text-sm text-sport-gray mt-1">{t('step4.subtitle')}</p>
            </div>
            <div>
              <Label htmlFor="bienvenue-discipline-seance" className="uppercase tracking-wider">
                {t('step3.label')}
              </Label>
              <Select
                id="bienvenue-discipline-seance"
                value={discipline}
                onChange={e => setDiscipline(e.target.value)}
              >
                {DISCIPLINES.map(s => (
                  <option key={s} value={s}>{nomDiscipline(s)}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="bienvenue-duree" className="uppercase tracking-wider">
                {t('step4.duration')}
              </Label>
              <Input
                id="bienvenue-duree"
                type="number"
                min={DUREE_MIN}
                max={DUREE_MAX}
                value={duree}
                onChange={e => setDuree(e.target.value)}
              />
            </div>
            {erreur && <Alert variant="error">{erreur}</Alert>}
            <Button onClick={enregistrerSeance} disabled={occupe} className="w-full min-h-[44px]">
              {occupe ? (
                <><Loader size={16} className="text-white" iconClassName="text-white" />{t('saving')}</>
              ) : (
                <><Flame size={15} /> {t('step4.save')}</>
              )}
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => allerA(3)} className="min-h-[44px]">
                <ArrowLeft size={15} /> {t('back')}
              </Button>
              <Button variant="ghost" onClick={plusTard} disabled={occupe} className="min-h-[44px] flex-1">
                {t('later')}
              </Button>
            </div>
          </div>
        )}

        {/* CONFIRMATION */}
        {etape > ETAPE_MAX && (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200">
              <CheckCircle size={26} className="text-sport-success" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black text-sport-fg mb-2">{t('done.title')}</h2>
            <p className="text-sport-gray text-sm mb-6">{t('done.text')}</p>
            <Button onClick={() => router.push('/dashboard')} className="w-full min-h-[44px]">
              {t('done.cta')} <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
