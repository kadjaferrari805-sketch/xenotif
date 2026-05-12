import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NanoBananaStudio } from './NanoBananaStudio'

describe('NanoBananaStudio', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the prompt input and submit button', () => {
    render(<NanoBananaStudio />)
    expect(screen.getByLabelText(/prompt/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /générer/i })).toBeInTheDocument()
  })

  it('posts the prompt to /api/nano-banana and renders the image', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ image: 'data:image/png;base64,AAA', text: null }),
    })

    render(<NanoBananaStudio />)
    await user.type(screen.getByLabelText(/prompt/i), 'a banana')
    await user.click(screen.getByRole('button', { name: /générer/i }))

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/nano-banana',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(await screen.findByAltText('a banana')).toHaveAttribute(
      'src',
      'data:image/png;base64,AAA',
    )
  })

  it('shows the error returned by the API', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'quota exceeded' }),
    })

    render(<NanoBananaStudio />)
    await user.type(screen.getByLabelText(/prompt/i), 'a banana')
    await user.click(screen.getByRole('button', { name: /générer/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('quota exceeded')
  })
})
