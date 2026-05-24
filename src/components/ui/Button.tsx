import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary'
}

export function Button({ variant, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-full font-bold text-sm cursor-pointer transition-all duration-200',
        variant === 'primary' &&
          'bg-sport-orange text-white shadow-lg hover:bg-orange-600 hover:shadow-xl',
        variant === 'secondary' &&
          'bg-transparent text-white border-2 border-sport-border hover:border-sport-orange hover:text-sport-orange',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
