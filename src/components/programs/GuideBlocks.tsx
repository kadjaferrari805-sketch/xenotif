import { CheckCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { GuideBlock } from '@/lib/boutique/guides'

// Rendu HTML des blocs d'un guide programme, pour les pages publiques SEO.
// Server component (pas de 'use client'). Gère les blocs texte (h1/h2/p/list/
// note/meta/table/exercise). Les blocs propres au PDF (photo locale, tracker,
// checklist, chapter) sont ignorés dans l'aperçu web.
// Les h1/h2 du guide sont rendus en h2/h3 (le titre de page = h1).
export async function GuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  const t = await getTranslations('programs')
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h1':
            return <h2 key={i} className="text-2xl md:text-3xl font-black text-sport-fg pt-6">{b.text}</h2>
          case 'h2':
            return <h3 key={i} className="text-lg font-black text-sport-orange pt-2">{b.text}</h3>
          case 'p':
            return <p key={i} className="text-sm text-sport-gray leading-relaxed">{b.text}</p>
          case 'list':
            return (
              <ul key={i} className="space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-sport-gray leading-relaxed">
                    <CheckCircle size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-sport-orange" /> {it}
                  </li>
                ))}
              </ul>
            )
          case 'note':
            return <p key={i} className="text-sm text-sport-fg bg-sport-orange/10 border border-sport-orange/25 rounded-xl px-4 py-3">{b.text}</p>
          case 'meta':
            return (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {b.items.map((m, j) => (
                  <div key={j} className="bg-sport-card border border-sport-border rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-sport-gray">{m.label}</p>
                    <p className="text-sm font-bold text-sport-fg mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
            )
          case 'table':
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-sport-border">
                      {b.headers.map((h, j) => (
                        <th key={j} className="py-2 pr-4 text-[11px] uppercase tracking-wider text-sport-gray font-bold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-b border-sport-border/50">
                        {r.map((c, k) => (
                          <td key={k} className={`py-2 pr-4 align-top ${k === 0 ? 'font-bold text-sport-fg' : 'text-sport-gray'}`}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'exercise':
            return (
              <div key={i} className="bg-sport-card border border-sport-border rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="font-black text-sport-fg">{b.name}</h4>
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-sport-orange/10 text-sport-orange">{b.level}</span>
                </div>
                <p className="text-[11px] text-sport-gray mb-2">{b.muscles}</p>
                <p className="text-sm text-sport-gray leading-relaxed"><strong className="text-sport-fg">{t('technique')}</strong>{b.technique}</p>
                {b.mistakes && <p className="text-sm text-sport-gray leading-relaxed mt-1.5"><strong className="text-sport-fg">{t('mistakes')}</strong>{b.mistakes}</p>}
              </div>
            )
          default:
            // photo / tracker / checklist / chapter : non rendus dans l'aperçu web
            return null
        }
      })}
    </div>
  )
}
