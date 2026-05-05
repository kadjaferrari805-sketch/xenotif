import React from 'react'
import { TRUST_ITEMS } from '@/lib/constants'

export function ProofBar() {
  return (
    <div className="bg-primary py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around gap-4">
        {TRUST_ITEMS.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <div className="hidden md:block w-px bg-white/20" />}
            <div className="flex items-center gap-2 text-white text-sm">
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
              <span className="text-white/80">{item.sublabel}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
