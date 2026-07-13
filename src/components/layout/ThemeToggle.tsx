'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Passer au thème sombre' : 'Passer au thème clair'}
      title={isLight ? 'Thème sombre' : 'Thème clair'}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-full border border-sport-border text-sport-gray hover:text-sport-fg hover:border-sport-fg/30 transition-all ${className}`}
    >
      {isLight ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
    </button>
  )
}
