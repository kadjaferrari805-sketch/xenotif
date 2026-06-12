'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bot, User, Sparkles, RotateCcw, ArrowRight } from 'lucide-react'

type Msg = { role: 'user' | 'coach'; text: string }

// Démo scriptée du Coach IA (#2) — aucune API, aucun coût, aucune auth.
export function CoachDemo() {
  const t = useTranslations('coachDemo')
  const chips = t.raw('chips') as { q: string; a: string }[]
  const [messages, setMessages] = useState<Msg[]>([{ role: 'coach', text: t('intro') }])
  const [asked, setAsked] = useState<number[]>([])

  function ask(i: number) {
    if (asked.includes(i)) return
    setAsked(prev => [...prev, i])
    setMessages(prev => [...prev, { role: 'user', text: chips[i].q }, { role: 'coach', text: chips[i].a }])
  }
  function replay() {
    setAsked([])
    setMessages([{ role: 'coach', text: t('intro') }])
  }

  return (
    <section className="px-6 py-20 bg-sport-dark" aria-label={t('title')}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-sport-orange bg-sport-orange/10 border border-sport-orange/20 rounded-full px-3 py-1">
            <Sparkles size={12} aria-hidden="true" /> {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-4">{t('title')}</h2>
          <p className="text-sport-gray text-sm mt-2 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="bg-sport-card border border-sport-border rounded-2xl p-4 md:p-6">
          <div className="space-y-3 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${m.role === 'coach' ? 'bg-sport-orange/15' : 'bg-white/10'}`}>
                  {m.role === 'coach' ? <Bot size={15} className="text-sport-orange" aria-hidden="true" /> : <User size={15} className="text-white" aria-hidden="true" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'coach' ? 'bg-sport-dark text-white' : 'bg-sport-orange text-white'}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">{m.role === 'coach' ? t('coach') : t('you')}</span>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
              !asked.includes(i) && (
                <button key={i} onClick={() => ask(i)}
                  className="text-xs font-bold border border-sport-border text-sport-gray hover:text-white hover:border-sport-orange rounded-full px-3 py-2 transition-all">
                  {c.q}
                </button>
              )
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={replay} className="inline-flex items-center gap-1.5 text-xs font-bold text-sport-gray hover:text-white transition-colors">
            <RotateCcw size={13} aria-hidden="true" /> {t('replay')}
          </button>
          <Link href="/auth/signup?plan=pro" className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all">
            {t('ctaTry')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
