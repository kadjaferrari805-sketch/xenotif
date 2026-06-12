export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function validateImage(file: { type: string; size: number } | null): { ok: boolean; reason?: 'missing' | 'type' | 'size' } {
  if (!file) return { ok: false, reason: 'missing' }
  if (!file.type.startsWith('image/')) return { ok: false, reason: 'type' }
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, reason: 'size' }
  return { ok: true }
}

export function extFromType(type: string): string {
  return type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
}

export type TransformationItem = {
  id: string
  displayName: string | null
  caption: string | null
  weeks: number | null
  beforeUrl: string
  afterUrl: string
}
