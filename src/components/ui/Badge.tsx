import { cn } from '@/lib/utils'

export type BadgeVariant = 'orange' | 'neutral' | 'success' | 'outline'

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  orange: 'bg-sport-orange/10 border-sport-orange/30 text-sport-orange',
  neutral: 'bg-sport-gray-light border-sport-border text-sport-fg',
  success: 'bg-emerald-50 border-emerald-200 text-[#1E7F5A]',
  outline: 'bg-transparent border-sport-border text-sport-gray',
}

export function Badge({
  variant = 'orange',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    />
  )
}
