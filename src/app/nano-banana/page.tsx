import type { Metadata } from 'next'
import { NanoBananaStudio } from '@/components/nano-banana/NanoBananaStudio'

export const metadata: Metadata = {
  title: 'Nano Banana — Studio Xenotif',
  description: "Génération d'images avec Gemini 2.5 Flash Image (Nano Banana).",
}

export default function NanoBananaPage() {
  return <NanoBananaStudio />
}
