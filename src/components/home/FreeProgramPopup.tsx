'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { X, Gift, Download, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'

// Pop-up intelligent « programme fitness gratuit » : capture email → /api/subscribe
// (qui envoie l'email de bienvenue avec le lien PDF) puis propose le téléchargement
// immédiat. Déclenché par TIMING (≈18 s) ou EXIT-INTENT desktop (souris vers le haut),
// UNE SEULE FOIS par visiteur (localStorage). Exclut auth/checkout/dashboard/admin.
// Respecte prefers-reduced-motion (pas d'animation de glissement). Fermable (X, Échap,
// clic sur le fond).
const STORAGE_KEY = 'xenotif_lead_popup_seen'
const SHOW_DELAY_MS = 18_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EXCLUDED = ['/auth', '/dashboard', '/admin', '/boutique/panier', '/boutique/succes', '/success']

type Status = 'idle' | 'loading' | 'success' | 'error'

export function FreeProgramPopup() {
  const t = useTranslations('home.leadPopup')
  const locale = useLocale()
  const pathname = usePathname()
  const excluded = EXCLUDED.some((p) => pathname.includes(p))

  const [open, setOpen] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const armedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Armement des déclencheurs (timing + exit-intent), une seule fois par visiteur.
  useEffect(() => {
    if (excluded || typeof window === 'undefined') return
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      return
    }

    const onMouseOut = (e: MouseEvent) => {
      // Exit-intent desktop : la souris sort par le haut de la fenêtre.
      if (e.clientY <= 0 && !e.relatedTarget) trigger()
    }
    function cleanup() {
      clearTimeout(timer)
      document.removeEventListener('mouseout', onMouseOut)
    }
    function trigger() {
      if (armedRef.current) return
      armedRef.current = true
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* stockage indisponible */
      }
      // Lu au déclenchement (callback, pas corps d'effet) → pas de cascade de rendus.
      try {
        setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false)
      } catch {
        /* matchMedia indisponible */
      }
      setOpen(true)
      cleanup()
    }

    const timer = setTimeout(trigger, SHOW_DELAY_MS)
    document.addEventListener('mouseout', onMouseOut)
    return cleanup
  }, [excluded])

  // Échap pour fermer + focus sur le champ à l'ouverture.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const id = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(id)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      setErrorMsg(t('errorInvalid'))
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error ?? t('errorGeneric'))
      } else {
        setStatus('success')
      }
    } catch {
      setStatus('error')
      setErrorMsg(t('errorNetwork'))
    }
  }

  const cardAnim = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 40, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 40, scale: 0.96 } }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden={false}
        >
          {/* Fond */}
          <button
            type="button"
            aria-label={t('close')}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Carte */}
          <motion.div
            {...cardAnim}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-popup-title"
            className="relative w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl border border-sport-border bg-sport-card shadow-2xl"
          >
            {/* Lueur premium */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-sport-orange/20 blur-3xl" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-sport-dark/70 text-sport-gray hover:text-sport-fg transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>

            <div className="relative p-7 sm:p-8">
              {status === 'success' ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sport-lime/15 border border-sport-lime/30">
                    <CheckCircle size={26} className="text-sport-lime" aria-hidden="true" />
                  </div>
                  <h2 id="lead-popup-title" className="text-2xl font-black text-sport-fg mb-2">{t('successTitle')}</h2>
                  <p className="text-sport-gray text-sm mb-6">{t('successText')}</p>
                  <a
                    href={`/api/free-program?locale=${locale}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center"
                  >
                    <Download size={16} aria-hidden="true" /> {t('download')}
                  </a>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-sport-border px-6 py-3 text-sm font-bold text-sport-fg hover:border-sport-orange/40 transition-all"
                  >
                    {t('signup')} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
                    <Gift size={22} className="text-sport-orange" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-sport-orange">{t('eyebrow')}</span>
                  <h2 id="lead-popup-title" className="mt-1 text-2xl font-black leading-tight text-sport-fg">{t('title')}</h2>
                  <p className="mt-2 text-sm text-sport-fg">{t('subtitle')}</p>

                  <ul className="mt-4 space-y-1.5">
                    {(t.raw('perks') as string[]).map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-xs text-sport-fg/85">
                        <CheckCircle size={13} className="text-sport-lime shrink-0" aria-hidden="true" /> {perk}
                      </li>
                    ))}
                  </ul>

                  <form onSubmit={handleSubmit} className="mt-5">
                    <label htmlFor="lead-popup-email" className="sr-only">{t('emailPlaceholder')}</label>
                    <input
                      ref={inputRef}
                      id="lead-popup-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                      placeholder={t('emailPlaceholder')}
                      className="w-full rounded-xl border border-sport-border bg-sport-dark px-4 py-3 text-sm text-sport-fg placeholder:text-sport-gray focus:border-sport-orange/60 focus:outline-none"
                    />
                    {status === 'error' && <p className="mt-2 text-xs text-red-400">{errorMsg}</p>}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary mt-3 w-full justify-center disabled:opacity-70"
                    >
                      {status === 'loading'
                        ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> {t('loading')}</>
                        : <>{t('cta')} <ArrowRight size={15} aria-hidden="true" /></>}
                    </button>
                  </form>

                  <p className="mt-3 text-center text-[11px] text-sport-gray">{t('privacy')}</p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
