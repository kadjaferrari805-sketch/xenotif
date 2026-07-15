import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const VARIANT_STYLE: Record<AlertVariant, { wrap: string; icon: React.ElementType }> = {
  info: { wrap: 'bg-sport-gray-light border-sport-border text-sport-fg', icon: Info },
  success: { wrap: 'bg-emerald-50 border-emerald-200 text-[#1E7F5A]', icon: CheckCircle2 },
  warning: { wrap: 'bg-amber-50 border-amber-200 text-amber-800', icon: AlertTriangle },
  error: { wrap: 'bg-red-50 border-red-200 text-red-700', icon: XCircle },
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

// Alerte de flux critique (erreur de paiement, échec d'auth) : icône dédiée par
// variant, contenu accessible via role="alert" (annoncé par les lecteurs d'écran).
export function Alert({ variant = 'info', title, className, children, ...props }: AlertProps) {
  const { wrap, icon: Icon } = VARIANT_STYLE[variant]
  return (
    <div role="alert" className={cn('flex items-start gap-3 rounded-xl border p-4 text-sm', wrap, className)} {...props}>
      <Icon size={18} aria-hidden="true" className="shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-bold mb-0.5">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  )
}
