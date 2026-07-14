'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

const noopSubscribe = () => () => {}

// Le serveur ne connaît jamais le vrai thème (pas d'accès à localStorage), il
// rend toujours comme si isLight=false. Le script anti-flash pose déjà le bon
// data-theme avant hydratation, donc ThemeProvider lit la vraie valeur dès le
// premier rendu client — mais l'afficher immédiatement ferait diverger le
// HTML client de celui du serveur (icône Sun vs Moon) et déclenche une erreur
// d'hydratation React. getServerSnapshot force `false` au rendu serveur ET à
// la passe d'hydratation client (React les compare), puis un re-rendu bascule
// sur la vraie valeur (flip d'icône imperceptible en thème clair).
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const mounted = useHasMounted()
  const isLight = mounted && theme === 'light'

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
