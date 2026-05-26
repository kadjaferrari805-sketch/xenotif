'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function DashboardGuard() {
  const router = useRouter()

  useEffect(() => {
    function onPopState() {
      if (!window.location.pathname.startsWith('/dashboard')) {
        // User is navigating back outside the dashboard — block it
        window.history.pushState(null, '', '/dashboard')
        router.replace('/dashboard')
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [router])

  return null
}
