import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    renderWithIntl(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders primary CTA link', () => {
    renderWithIntl(<Hero />)
    expect(screen.getByRole('link', { name: /commencer gratuitement/i })).toBeInTheDocument()
  })

  it('renders secondary CTA link', () => {
    renderWithIntl(<Hero />)
    expect(screen.getByRole('link', { name: /voir les disciplines/i })).toBeInTheDocument()
  })

  it('renders all 4 trust items', () => {
    renderWithIntl(<Hero />)
    // 09.3 : « 12K+ athlètes » (audience inventée) → essai Pro réel, vérifiable
    // dans le code (TRIAL_DAYS = 7) et dans l'offre « sans carte ».
    expect(screen.getByText(/essai pro 7 jours/i)).toBeInTheDocument()
    // « Coaching IA » apparaît aussi dans les badges flottants
    expect(screen.getAllByText(/coaching ia/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/accès illimité/i)).toBeInTheDocument()
    // « 30 jours » : garantie commerciale réelle, CGV art. 10 (abonnement Pro
    // + guides digitaux). Conservée à dessein.
    expect(screen.getAllByText(/30 jours/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the floating stat badges', () => {
    renderWithIntl(<Hero />)
    // 09.3 : « +12 000 membres » et « 4.9 / 5 » remplacés par des faits
    // vérifiables — 10 disciplines (DISCIPLINE_SLUGS) et le suivi d'activité
    // par capteur du téléphone (TodayActivity, devicemotion).
    expect(screen.getByText(/10 disciplines/i)).toBeInTheDocument()
    expect(screen.getByText(/suivi d’activité/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Coaching IA/i).length).toBeGreaterThanOrEqual(1)
  })

  it('n’affiche plus d’audience ni de note agrégée', () => {
    renderWithIntl(<Hero />)
    expect(screen.queryByText(/12[\s.,]?000/)).not.toBeInTheDocument()
    expect(screen.queryByText(/12K\+/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/4[.,]9/)).not.toBeInTheDocument()
    expect(screen.queryByText(/3[\s.,]?200/)).not.toBeInTheDocument()
  })
})
