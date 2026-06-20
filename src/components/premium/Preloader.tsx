import { XenotifMark } from '@/components/ui/Logo'

// Préchargement premium — rendu CÔTÉ SERVEUR (visible dès le 1er paint → aucun
// flash de contenu) et animé 100 % en CSS (keyframes). Auto-disparition même
// sans JS (animation `pl-out` forwards). Affiché UNE fois par session
// (classe `html.preloaded` posée avant le paint par le script du layout) et
// désactivé en `prefers-reduced-motion`. Voir les keyframes dans globals.css.
export function Preloader() {
  return (
    <div id="preloader" aria-hidden="true">
      <div className="pl-glow" />
      <div className="pl-logo">
        <XenotifMark size={66} />
        <div className="pl-word">
          XENOTIF<span className="pl-r">®</span>
          <span className="pl-shine" />
        </div>
        <div className="pl-bar"><i /></div>
      </div>
    </div>
  )
}
