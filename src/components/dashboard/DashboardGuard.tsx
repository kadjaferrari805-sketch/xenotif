'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function DashboardGuard() {
  const router = useRouter()

  useEffect(() => {
    // Push a duplicate entry so the first "back" stays within the dashboard
    window.history.pushState(null, '', window.location.href)

    function onPopState() {
      if (!window.location.pathname.startsWith('/dashboard')) {
        // Navigating outside dashboard — push back and redirect
        window.history.pushState(null, '', '/dashboard')
        router.replace('/dashboard')
      } else {
        // Navigating within dashboard — add a new barrier entry
        // so the next back also stays inside
        window.history.pushState(null, '', window.location.href)
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [router])

  return null
}
