'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { TransformationItem } from '@/lib/transformations'

/**
 * Galerie publique des transformations approuvées.
 *
 * QUATRE ÉTATS DISTINCTS, jamais confondus : chargement, succès avec éléments,
 * succès sans élément, erreur. La version précédente écrasait toute panne en
 * tableau vide (`catch(() => setItems([]))`) : une base injoignable se
 * présentait comme « aucune transformation », la section disparaissait en
 * silence et le 503 renvoyé par l'API — acquis de la phase K.7 — n'avait aucun
 * effet observable. On ne convertit plus jamais une erreur en liste vide.
 *
 * FILTRAGE. Seules les transformations `approved` sont exposées, et ce filtre
 * reste ENTIÈREMENT côté serveur (`/api/transformations`), y compris la limite
 * de 12. Le composant ne filtre rien : dupliquer la règle ici créerait deux
 * sources de vérité, dont l'une serait modifiable depuis le navigateur.
 */

/** Ancre du titre : il sert de libellé accessible à la section entière. */
const TITLE_ID = 'transformations-gallery-title'

/** Cartes fantômes affichées pendant le chargement — une rangée en large. */
const SKELETON_COUNT = 3

type GalleryState =
  | { phase: 'loading' }
  | { phase: 'ready'; items: TransformationItem[] }
  | { phase: 'error' }

export function TransformationsGallery() {
  const t = useTranslations('transformations')
  const [state, setState] = useState<GalleryState>({ phase: 'loading' })

  useEffect(() => {
    let alive = true

    void (async () => {
      try {
        const response = await fetch('/api/transformations')

        // Un code non-2xx signale une panne : l'API répond 503 quand la base
        // est injoignable. On lève avant même de lire le corps.
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        // `json()` lève si la réponse n'est pas du JSON valide.
        const payload: unknown = await response.json()
        const items = (payload as { items?: unknown } | null)?.items

        // Une charge utile de forme inattendue est une anomalie, pas une
        // galerie vide : on la traite comme telle.
        if (!Array.isArray(items)) throw new Error('charge utile inattendue')

        if (alive) setState({ phase: 'ready', items: items as TransformationItem[] })
      } catch {
        // Aucun détail technique n'atteint le visiteur : ni code HTTP, ni
        // message d'erreur, ni nom de ressource. Seul l'état change.
        if (alive) setState({ phase: 'error' })
      }
    })()

    return () => { alive = false }
  }, [])

  // Succès ET aucun élément : il n'y a rien à montrer, la section s'efface
  // complètement plutôt que d'afficher un bloc vide.
  if (state.phase === 'ready' && state.items.length === 0) return null

  return (
    <section className="px-6 py-20 bg-sport-dark" aria-labelledby={TITLE_ID}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 id={TITLE_ID} className="text-3xl md:text-4xl font-black text-sport-fg">{t('galleryTitle')}</h2>
          <p className="text-sport-gray text-sm mt-3">{t('gallerySubtitle')}</p>
        </div>

        {/*
          Chargement : des cartes fantômes reprennent EXACTEMENT la géométrie
          des vraies (même `aspect-[3/4]`, même grille), pour que l'arrivée des
          données ne déplace pas la page. Elles ne portent aucun contenu
          inventé — ni nom, ni légende, ni image : seulement des blocs neutres.
        */}
        {state.phase === 'loading' && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-busy="true"
            data-testid="transformations-skeleton"
          >
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div key={i} className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden animate-pulse">
                <div className="grid grid-cols-2">
                  <div className="aspect-[3/4] bg-sport-dark" />
                  <div className="aspect-[3/4] bg-sport-dark" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-sport-border" />
                  <div className="h-2.5 w-3/4 rounded bg-sport-border" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Erreur : une seule ligne sobre, réutilisant le message générique déjà
            traduit en fr/en/de. Rien n'est divulgué de la cause réelle. */}
        {state.phase === 'error' && (
          <p role="status" className="text-center text-sport-gray text-sm">{t('errServer')}</p>
        )}

        {state.phase === 'ready' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.items.map(it => {
              // Le nom et la durée contextualisent les textes alternatifs : un
              // lecteur d'écran qui parcourt la page n'entend plus douze fois
              // « Avant », « Après », mais à qui et à quelle durée chaque
              // photo se rapporte.
              const name = it.displayName ?? t('defaultName')
              const duration = it.weeks ? `, ${t('weeks', { weeks: it.weeks })}` : ''
              const images = [
                { url: it.beforeUrl, label: t('before'), alt: `${t('before')} — ${name}` },
                { url: it.afterUrl, label: t('after'), alt: `${t('after')} — ${name}${duration}` },
              ]

              return (
                <figure key={it.id} className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-[3/4] bg-sport-dark">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute top-2 left-2 text-2xs font-black uppercase tracking-wider bg-black/60 text-white rounded px-2 py-0.5" aria-hidden="true">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <figcaption className="p-4">
                    <p className="text-sm font-bold text-sport-fg">
                      {name}
                      {it.weeks ? <span className="text-sport-orange font-black"> · {t('weeks', { weeks: it.weeks })}</span> : null}
                    </p>
                    {it.caption && <p className="text-xs text-sport-gray mt-1 leading-relaxed">{it.caption}</p>}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
