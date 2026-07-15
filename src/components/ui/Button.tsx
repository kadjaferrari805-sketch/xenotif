import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'secondary-photo' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  'secondary-photo': 'btn-secondary-photo',
  ghost: 'relative inline-flex items-center justify-center gap-2 rounded-full font-bold text-sport-fg hover:bg-sport-fg/5 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-fg/30 focus-visible:ring-offset-2 focus-visible:ring-offset-sport-dark',
}

// btn-primary/btn-secondary/btn-secondary-photo (globals.css) sont déjà calibrés en
// px-6 py-3.5 text-sm (taille "md") - les variants sm/lg surchargent juste padding/texte.
const SIZE_CLASS: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { sm: 'px-4 py-2 text-xs', md: '', lg: 'px-8 py-4 text-base' },
  secondary: { sm: 'px-4 py-2 text-xs', md: '', lg: 'px-8 py-4 text-base' },
  'secondary-photo': { sm: 'px-4 py-2 text-xs', md: '', lg: 'px-8 py-4 text-base' },
  ghost: { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Rend le style sur l'enfant direct (ex. `<Link>`) plutôt que sur un `<button>`. */
  asChild?: boolean
}

export function Button({ variant = 'primary', size = 'md', asChild = false, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(VARIANT_CLASS[variant], SIZE_CLASS[variant][size], className)} {...props} />
}
