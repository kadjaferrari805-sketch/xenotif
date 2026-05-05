'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-r from-primary to-teal-500 text-center">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-extrabold text-white mb-2">Conseils bien-être dans votre boîte mail</h2>
        <p className="text-white/80 text-sm mb-6">Rejoignez 3 200+ abonnés — conseils cervicaux, offres exclusives, nouveautés Xenotif</p>
        {submitted ? (
          <p className="text-white font-bold text-lg">✓ Merci ! Vous êtes inscrit(e).</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
            <label htmlFor="newsletter-email" className="sr-only">Email</label>
            <input
              id="newsletter-email"
              type="email"
              aria-label="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-5 py-3 rounded-full text-sm outline-none"
              required
            />
            <button type="submit" className="bg-primary-darker text-white px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap">
              Je m&apos;abonne →
            </button>
          </form>
        )}
        <p className="text-white/50 text-xs mt-4">Pas de spam. Désinscription en 1 clic.</p>
      </div>
    </section>
  )
}
