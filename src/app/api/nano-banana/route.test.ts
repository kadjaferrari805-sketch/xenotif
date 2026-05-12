/**
 * @jest-environment node
 */
import { POST } from './route'

const generateContent = jest.fn()

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: { generateContent: (...args: unknown[]) => generateContent(...args) },
  })),
}))

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/nano-banana', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/nano-banana', () => {
  const originalKey = process.env.GEMINI_API_KEY

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key'
    generateContent.mockReset()
  })

  afterAll(() => {
    process.env.GEMINI_API_KEY = originalKey
  })

  it('returns 400 when the prompt is missing', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 500 when the API key is missing', async () => {
    delete process.env.GEMINI_API_KEY
    const res = await POST(makeRequest({ prompt: 'hi' }))
    expect(res.status).toBe(500)
  })

  it('returns the generated image as a data URL', async () => {
    generateContent.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              { text: 'here you go' },
              { inlineData: { data: 'AAA', mimeType: 'image/png' } },
            ],
          },
        },
      ],
    })

    const res = await POST(makeRequest({ prompt: 'a banana' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.image).toBe('data:image/png;base64,AAA')
    expect(json.text).toBe('here you go')
    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.5-flash-image' }),
    )
  })

  it('forwards an optional reference image to the model', async () => {
    generateContent.mockResolvedValue({
      candidates: [
        { content: { parts: [{ inlineData: { data: 'BBB', mimeType: 'image/png' } }] } },
      ],
    })

    await POST(
      makeRequest({ prompt: 'edit this', image: 'REFBASE64', mimeType: 'image/jpeg' }),
    )

    const call = generateContent.mock.calls[0][0]
    expect(call.contents).toEqual([
      { text: 'edit this' },
      { inlineData: { data: 'REFBASE64', mimeType: 'image/jpeg' } },
    ])
  })

  it('returns 502 when the model returns no image', async () => {
    generateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: 'sorry' }] } }],
    })
    const res = await POST(makeRequest({ prompt: 'a banana' }))
    expect(res.status).toBe(502)
  })
})
