'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

async function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  const buffer = await file.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return { data: btoa(binary), mimeType: file.type || 'image/png' }
}

export function NanoBananaStudio() {
  const [prompt, setPrompt] = useState('')
  const [reference, setReference] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [caption, setCaption] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    setStatus('loading')
    setError(null)
    setImage(null)
    setCaption(null)

    try {
      const body: Record<string, string> = { prompt }
      if (reference) {
        const { data, mimeType } = await fileToBase64(reference)
        body.image = data
        body.mimeType = mimeType
      }
      const res = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Generation failed.')
      setImage(json.image)
      setCaption(json.text ?? null)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.')
      setStatus('error')
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold mb-2">Nano Banana</h1>
        <p className="text-sm text-gray-600">
          Génération et édition d&apos;images via Gemini 2.5 Flash Image.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nb-prompt" className="block text-sm font-bold mb-1">
            Prompt
          </label>
          <textarea
            id="nb-prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={4}
            required
            placeholder="Un masseur cervical neckZen posé sur un bureau minimaliste, lumière naturelle…"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="nb-image" className="block text-sm font-bold mb-1">
            Image de référence <span className="font-normal text-gray-500">(optionnel)</span>
          </label>
          <input
            id="nb-image"
            type="file"
            accept="image/*"
            onChange={e => setReference(e.target.files?.[0] ?? null)}
            className="block text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold disabled:opacity-60"
        >
          {status === 'loading' ? 'Génération…' : 'Générer'}
        </button>
      </form>

      {status === 'error' && error && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          {error}
        </p>
      )}

      {image && (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={prompt} className="w-full rounded-xl shadow-lg" />
          {caption && <figcaption className="mt-2 text-xs text-gray-600">{caption}</figcaption>}
        </figure>
      )}
    </section>
  )
}
