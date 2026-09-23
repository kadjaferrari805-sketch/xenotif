import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Reviews } from './Reviews'
import { REVIEWS } from '@/lib/constants'

// Phase 09.3 — Trust & Legal.
//
// AVANT : ce test exigeait la présence de « Thomas D. », « Leila M. » et
// « Nicolas R. » avec trois badges « Vérifié ». Ces trois témoignages étaient
// ENTIÈREMENT FABRIQUÉS (noms, citations, résultats : -12 kg, Ironman terminé),
// alors que la Production ne comptait qu'un seul avis réel. Le test verrouillait
// donc du faux : le supprimer sans le remplacer laisserait la porte ouverte.
//
// APRÈS : on vérifie la garantie inverse — tant qu'aucun avis réel n'est
// disponible, la section ne s'affiche pas du tout.

describe('Reviews — aucune preuve sociale fabriquée', () => {
  it('ne rend rien tant qu’aucun avis réel n’est disponible', () => {
    const { container } = renderWithIntl(<Reviews />)

    // Afficher un en-tête « Témoignages » au-dessus d'un carrousel vide et de
    // cinq étoiles pleines serait tout aussi trompeur que les faux avis.
    expect(container).toBeEmptyDOMElement()
  })

  it('n’affiche aucun des témoignages fabriqués retirés en 09.3', () => {
    renderWithIntl(<Reviews />)

    for (const nom of [/Thomas D\./i, /Leila M\./i, /Nicolas R\./i]) {
      expect(screen.queryByText(nom)).not.toBeInTheDocument()
    }
  })

  it('n’affiche aucune note agrégée', () => {
    renderWithIntl(<Reviews />)

    expect(screen.queryByText(/4[.,]9\s*\/\s*5/)).not.toBeInTheDocument()
    expect(screen.queryByText(/3[\s.,]?200/)).not.toBeInTheDocument()
  })

  it('la source d’avis est vide, ce qui déclenche la garde du composant', () => {
    expect(REVIEWS).toHaveLength(0)
  })
})
