'use client'

import { useEffect, useRef } from 'react'
import { trackMeta, type MetaEvent } from '@/lib/meta-pixel'

// Déclenche un événement Meta Pixel une seule fois au montage.
// Permet de tracker une conversion depuis un Server Component (pages de succès).
export function MetaTrack({
  event,
  value,
  currency = 'EUR',
  contentName,
  contentIds,
  eventId,
}: {
  event: MetaEvent
  value?: number
  currency?: string
  contentName?: string
  contentIds?: string[]
  eventId?: string
}) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackMeta(
      event,
      {
        ...(value !== undefined ? { value, currency } : {}),
        ...(contentName ? { content_name: contentName } : {}),
        ...(contentIds ? { content_ids: contentIds, content_type: 'product' } : {}),
      },
      eventId,
    )
  }, [event, value, currency, contentName, contentIds, eventId])
  return null
}
