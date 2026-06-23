'use client'

import { useEffect, useRef } from 'react'
import { trackPurchase } from '@/lib/analytics'

// Déclenche l'événement GA4 « purchase » une seule fois au montage.
// Permet de tracker une conversion depuis un Server Component (pages de succès),
// pendant GA4 du <MetaTrack event="Purchase" />.
export function GtagPurchase({
  value,
  currency = 'EUR',
  transactionId,
  items,
}: {
  value: number
  currency?: string
  transactionId?: string
  items?: { item_id: string; item_name: string }[]
}) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackPurchase({ value, currency, transactionId, items })
  }, [value, currency, transactionId, items])
  return null
}
