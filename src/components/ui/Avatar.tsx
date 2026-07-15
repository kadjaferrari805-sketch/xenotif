'use client'

import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  src?: string | null
  /** Nom complet ou email - sert à générer les initiales de repli et l'alt text. */
  name: string
  size?: number
  className?: string
}

export function Avatar({ src, name, size = 36, className }: AvatarProps) {
  const initials = name.trim().slice(0, 2).toUpperCase()
  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-sport-orange/20 border border-sport-orange/40 select-none shrink-0',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src && <RadixAvatar.Image src={src} alt={name} className="h-full w-full object-cover" />}
      <RadixAvatar.Fallback className="font-black text-sport-orange" style={{ fontSize: size * 0.38 }} delayMs={src ? 400 : 0}>
        {initials}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
