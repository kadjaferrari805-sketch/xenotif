'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

export function DisciplineFAQSection({ items, accentColor }: { items: FAQItem[]; accentColor: string }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-sport-dark border border-sport-border rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-sm font-bold text-sport-fg pr-4">{item.q}</span>
            <span aria-hidden="true" className={`shrink-0 ${accentColor}`}>
              {open === i ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-sport-gray leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
