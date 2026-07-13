'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sport-dark px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
        <AlertTriangle size={36} className="text-red-400" />
      </div>
      <h1 className="mb-2 text-2xl font-black text-sport-fg">Une erreur est survenue</h1>
      <p className="mb-8 text-sport-gray max-w-md">
        Quelque chose s&apos;est mal passé. Si le problème persiste, contacte notre support.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-sport-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors">
          <RefreshCw size={14} /> Réessayer
        </button>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-sport-border px-5 py-2.5 text-sm font-bold text-sport-fg hover:bg-sport-card transition-colors">
          <Home size={14} /> Accueil
        </Link>
      </div>
    </div>
  )
}
