import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export const runtime = 'nodejs'

type GeneratePayload = {
  prompt?: unknown
  image?: unknown
  mimeType?: unknown
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 },
    )
  }

  let payload: GeneratePayload
  try {
    payload = (await request.json()) as GeneratePayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : ''
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 })
  }

  const inputImage = typeof payload.image === 'string' ? payload.image : null
  const inputMime = typeof payload.mimeType === 'string' ? payload.mimeType : 'image/png'

  const ai = new GoogleGenAI({ apiKey })

  const contents: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
    { text: prompt },
  ]
  if (inputImage) {
    contents.push({ inlineData: { data: inputImage, mimeType: inputMime } })
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
    })

    const parts = response.candidates?.[0]?.content?.parts ?? []
    let imageBase64: string | null = null
    let imageMime: string | null = null
    let text: string | null = null
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data
        imageMime = part.inlineData.mimeType ?? 'image/png'
      } else if (typeof part.text === 'string') {
        text = (text ?? '') + part.text
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image returned by the model.', text },
        { status: 502 },
      )
    }

    return NextResponse.json({
      image: `data:${imageMime};base64,${imageBase64}`,
      text,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
