'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Plus, Minus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'

type FaqItem = { q: string; a: string }

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const answerId = `faq-answer-${index}`

  return (
    <Tilt3D max={6} glare={false} className="relative mb-3 rounded-xl">
    <div className="rounded-xl border border-sport-border/70 bg-sport-card/50 px-5 backdrop-blur-sm transition-colors hover:border-sport-orange/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={answerId}
        className="w-full flex items-center justify-between py-5 text-left text-sm font-bold text-white hover:text-sport-orange transition-colors gap-4"
      >
        <span>{q}</span>
        <span
          aria-hidden="true"
          className="shrink-0 w-6 h-6 rounded-full border border-sport-border flex items-center justify-center text-sport-gray transition-colors"
        >
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            role="region"
            aria-label={q}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-sport-gray text-xs leading-relaxed pb-5 pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </Tilt3D>
  )
}

export function FAQ() {
  const t = useTranslations('home.faq')
  const items = t.raw('items') as FaqItem[]

  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-2xl mx-auto">
        <SectionHeader
          id="faq-title"
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
          size="lg"
        />

        <div className="mt-12">
          {items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        <p className="text-center text-sport-gray text-xs mt-10">
          {t('moreQuestions')}{' '}
          <a
            href="mailto:contact@xenotif.com"
            className="text-sport-orange hover:underline font-bold"
          >
            contact@xenotif.com
          </a>
        </p>
      </div>
    </section>
  )
}
