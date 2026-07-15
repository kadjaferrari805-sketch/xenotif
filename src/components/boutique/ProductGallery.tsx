'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  alt: string
  badge?: string | null
  discountLabel?: string | null
  imageFit?: 'cover' | 'contain'
  imagePosition?: string
  /** Photo produit fond blanc → tuile blanche + object-contain (produit entièrement visible). */
  lightTile?: boolean
}

/**
 * Galerie produit premium : grande image + miniatures + zoom au survol
 * (loupe interne « inner-zoom » : l'image grossit autour du curseur).
 * Sur mobile, le zoom au survol ne s'applique pas - la navigation se fait
 * via les miniatures défilantes. Style cohérent e-commerce haut de gamme.
 */
export function ProductGallery({ images, alt, badge, discountLabel, imageFit, imagePosition, lightTile }: ProductGalleryProps) {
  const list = images.length ? images : ['']
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const frameRef = useRef<HTMLDivElement>(null)

  const contain = lightTile || imageFit === 'contain'
  const fitClass = contain ? 'object-contain p-4' : 'object-cover'

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = frameRef.current?.getBoundingClientRect()
    if (!r) return
    setPos({
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Image principale grand format + zoom au survol */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMove}
        className={`group relative aspect-square overflow-hidden rounded-2xl border border-sport-border cursor-zoom-in ${lightTile ? 'bg-white' : 'bg-sport-card'}`}
      >
        <Image
          key={active}
          src={list[active] ?? ''}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`${fitClass} transition-transform duration-200 ease-out`}
          style={{
            transform: zoom ? 'scale(2.1)' : 'scale(1)',
            transformOrigin: `${pos.x}% ${pos.y}%`,
            objectPosition: imagePosition,
          }}
        />
        {badge && (
          <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-sport-orange px-3 py-1 text-sm font-black text-white shadow-lg">{badge}</span>
        )}
        {discountLabel && (
          <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-sm font-black text-white shadow-lg">{discountLabel}</span>
        )}
        {/* Indice « zoom » discret */}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-sport-dark/70 px-2.5 py-1 text-[11px] font-semibold text-sport-fg/90 opacity-0 transition-opacity group-hover:opacity-100">
          🔍 Survol pour zoomer
        </span>
      </div>

      {/* Miniatures (si galerie) */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={`Vue ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${lightTile ? 'bg-white' : ''} ${
                i === active ? 'border-sport-orange ring-2 ring-sport-orange/30' : 'border-sport-border hover:border-sport-gray'
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className={contain ? 'object-contain p-1' : 'object-cover'} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
