import { cn } from '@/lib/utils'

// Pulsation neutre (bg-sport-gray-light) - respecte prefers-reduced-motion via
// animate-pulse de Tailwind, qui se désactive déjà avec la classe motion-reduce
// globale de Tailwind v4 (motion-safe/motion-reduce variants natifs).
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('motion-safe:animate-pulse rounded-lg bg-sport-gray-light', className)}
      {...props}
    />
  )
}
