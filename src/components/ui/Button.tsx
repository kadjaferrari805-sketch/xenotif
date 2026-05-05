import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary'
}

export function Button({ variant, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-full font-bold text-sm cursor-pointer transition-all',
        variant === 'primary' && 'bg-primary text-white shadow-lg hover:bg-primary-dark',
        variant === 'secondary' && 'bg-white text-primary border-2 border-primary hover:bg-primary-light',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
