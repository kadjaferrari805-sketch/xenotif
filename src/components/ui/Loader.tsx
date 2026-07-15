import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Loader({
  size = 20,
  label,
  className,
}: {
  size?: number
  /** Texte visible + accessible (sinon un aria-label générique "Chargement" est utilisé). */
  label?: string
  className?: string
}) {
  return (
    <div role="status" className={cn('inline-flex items-center gap-2 text-sport-gray', className)}>
      <Loader2 size={size} className="animate-spin text-sport-orange" aria-hidden="true" />
      {label ? <span className="text-sm">{label}</span> : <span className="sr-only">Chargement</span>}
    </div>
  )
}
