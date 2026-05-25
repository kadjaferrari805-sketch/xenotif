'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const FAQS = [
  {
    q: 'Xenotif® est-il adapté aux débutants ?',
    a: 'Absolument. Xenotif® propose des programmes pour tous les niveaux, du grand débutant à l\'athlète confirmé. Notre IA adapte chaque programme à ton profil dès l\'inscription — niveau, objectifs, disponibilités.',
  },
  {
    q: 'Puis-je annuler mon abonnement à tout moment ?',
    a: 'Oui, sans conditions ni frais cachés. Tu peux annuler depuis ton espace membre en 2 clics. L\'accès reste actif jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Comment fonctionne le coaching IA ?',
    a: 'Notre IA analyse ton profil (niveau, objectifs, temps disponible, éventuelles blessures) et génère un programme sur mesure. Il s\'adapte chaque semaine selon tes retours et performances.',
  },
  {
    q: 'Ai-je besoin de matériel spécifique ?',
    a: 'Non. Xenotif® propose des séances adaptées à tous les équipements — en salle, à la maison, ou en extérieur. Au moment de choisir ton programme, tu indiques ce dont tu disposes.',
  },
  {
    q: 'Que comprend la garantie satisfait ou remboursé ?',
    a: 'Si tu n\'es pas satisfait(e) dans les 30 premiers jours, on te rembourse intégralement — sans question. Il suffit de nous contacter à contact@xenotif.com.',
  },
  {
    q: 'Les programmes fonctionnent-ils sur mobile ?',
    a: 'Oui. Xenotif® est entièrement responsive et accessible sur smartphone, tablette et ordinateur. Tes séances te suivent partout, même hors-ligne (mode hors-connexion disponible sur le plan Pro).',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const answerId = `faq-answer-${index}`

  return (
    <div className="border-b border-sport-border last:border-0">
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
  )
}

export function FAQ() {
  return (
    <section aria-labelledby="faq-title" className="py-24 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-2xl mx-auto">
        <SectionHeader
          id="faq-title"
          label="FAQ"
          title="Questions fréquentes"
          subtitle="Tout ce que tu dois savoir avant de commencer"
        />

        <div className="mt-12">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        <p className="text-center text-sport-gray text-xs mt-10">
          D&apos;autres questions ?{' '}
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
