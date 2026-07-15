import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Loader({
  size = 20,
  label,
  className,
  iconClassName,
}: {
  size?: number
  /** Texte visible + accessible (sinon un aria-label générique "Chargement" est utilisé). */
  label?: string
  className?: string
  /** Surcharge la couleur de l'icône (défaut text-sport-orange) - ex. "text-white" sur un bouton orange. */
  iconClassName?: string
}) {
  return (
    <div role="status" className={cn('inline-flex items-center gap-2 text-sport-gray', className)}>
      <Loader2 size={size} className={cn('animate-spin text-sport-orange', iconClassName)} aria-hidden="true" />
      {label ? <span className="text-sm">{label}</span> : <span className="sr-only">Chargement</span>}
    </div>
  )
}
