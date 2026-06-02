import type { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'
import { getLegalDoc } from '@/lib/legal'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const doc = getLegalDoc('terms', locale)
  return { title: { absolute: doc.metaTitle }, description: doc.metaDescription }
}

export default async function CGVPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalDocument {...getLegalDoc('terms', locale)} />
}
