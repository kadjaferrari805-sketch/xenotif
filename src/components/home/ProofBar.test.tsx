import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { ProofBar } from './ProofBar'

// Phase 09.3 — Trust & Legal.
//
// AVANT : ce test verrouillait les compteurs codés en dur `end: 12000`
// (« athlètes actifs ») et `end: 49` rendu « 4.9/5 » (« satisfaction »), ainsi
// que leurs libellés. Ces deux valeurs ne correspondaient à aucune donnée :
// 19 comptes et 1 avis en Production. ProofBar est monté sur /communaute,
// /a-propos et /coaching — trois pages réelles.
//
// APRÈS : les quatre tuiles portent des faits vérifiables — 10 disciplines
// (DISCIPLINE_SLUGS), 9 programmes (programs/registry), 3 langues (fr/en/de),
// 7 jours d'essai Pro (TRIAL_DAYS).

describe('ProofBar — chiffres vérifiables uniquement', () => {
  it('rend les quatre libellés factuels', () => {
    renderWithIntl(<ProofBar />)

    expect(screen.getByText(/^disciplines$/i)).toBeInTheDocument()
    expect(screen.getByText(/^programmes$/i)).toBeInTheDocument()
    expect(screen.getByText(/^langues$/i)).toBeInTheDocument()
    expect(screen.getByText(/^essai pro$/i)).toBeInTheDocument()
  })

  it('n’affiche plus d’audience ni de note agrégée', () => {
    renderWithIntl(<ProofBar />)

    // Les libellés retirés en 09.3 : ils accompagnaient 12 000 et 4,9/5.
    expect(screen.queryByText(/athlètes actifs/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/satisfaction/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/4[.,]9/)).not.toBeInTheDocument()
  })

  it('les sous-libellés annoncent des faits contrôlables', () => {
    renderWithIntl(<ProofBar />)

    expect(screen.getByText(/FR · EN · DE/i)).toBeInTheDocument()
    expect(screen.getByText(/sans carte bancaire/i)).toBeInTheDocument()
  })
})
