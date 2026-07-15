import { render, screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { XenotifMark, XenotifWordmark, Logo, LogoVertical } from './Logo'

describe('XenotifMark', () => {
  it('rend les 4 segments du X', () => {
    const { container } = render(<XenotifMark />)
    expect(container.querySelectorAll('polygon')).toHaveLength(4)
  })

  it('utilise l’orange de marque (#FF6B00) pour les segments droite en bi-ton', () => {
    const { container } = render(<XenotifMark variant="biton" />)
    expect(container.innerHTML).toContain('#FF6B00')
  })

  it('n’utilise pas d’orange en mono-white', () => {
    const { container } = render(<XenotifMark variant="mono-white" />)
    expect(container.innerHTML).not.toContain('#FF6B00')
  })

  it('ajoute la classe d’animation quand animated', () => {
    const { container } = render(<XenotifMark animated />)
    expect(container.querySelector('.xeno-mark--animated')).toBeInTheDocument()
  })
})

describe('XenotifWordmark', () => {
  it('rend XENOTIF (nœud texte séparé) et ®', () => {
    render(<XenotifWordmark />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
    expect(screen.getByText('®')).toBeInTheDocument()
  })
})

describe('Logo', () => {
  it('rend un lien', () => {
    renderWithIntl(<Logo />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('masque le wordmark quand showText est false', () => {
    renderWithIntl(<Logo showText={false} />)
    expect(screen.queryByText('XENOTIF')).not.toBeInTheDocument()
  })
})

describe('LogoVertical', () => {
  it('rend la marque et le wordmark', () => {
    const { container } = renderWithIntl(<LogoVertical />)
    expect(container.querySelector('polygon')).toBeInTheDocument()
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })
})
