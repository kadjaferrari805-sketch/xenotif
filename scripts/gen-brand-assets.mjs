// Génère tous les assets bitmap de la marque depuis un SVG unique.
// Lancer : node scripts/gen-brand-assets.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const ROOT = process.cwd()
const TITANE =
  '<linearGradient id="xeno-titane" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">' +
  '<stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#9ca3af"/>' +
  '<stop offset="100%" stop-color="#e5e7eb"/></linearGradient>'

// Corps de la marque (sans <svg>). hex = couleur hexagone, x = couleur du X.
const markBody = (hex = 'url(#xeno-titane)', x = '#FF4500') =>
  `<defs>${TITANE}</defs>` +
  `<polygon points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5" fill="none" stroke="${hex}" stroke-width="2.4" stroke-linejoin="round"/>` +
  `<g stroke="${x}" stroke-width="4.6" stroke-linecap="round">` +
  '<line x1="17.5" y1="17.5" x2="30.5" y2="30.5"/><line x1="30.5" y1="17.5" x2="17.5" y2="30.5"/></g>'

// Marque seule, fond transparent.
const plainSvg = (hex, x) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">${markBody(hex, x)}</svg>`

// Tuile sombre arrondie + marque centrée (icônes d'app). pad/radius en fraction de la taille.
const tileSvg = (px, pad, radius) => {
  const r = Math.round(px * radius)
  const inner = px * (1 - 2 * pad)
  const off = px * pad
  const scale = inner / 48
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">` +
    `<rect width="${px}" height="${px}" rx="${r}" fill="#0A0B0F"/>` +
    `<g transform="translate(${off},${off}) scale(${scale})">${markBody()}</g></svg>`
  )
}

async function writeText(rel, content) {
  const abs = join(ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await writeFile(abs, content)
  console.log('svg ', rel)
}

async function writePng(rel, svg, px) {
  const abs = join(ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await sharp(Buffer.from(svg)).resize(px, px).png().toFile(abs)
  console.log('png ', rel, `${px}x${px}`)
}

// SVG sources de vérité
await writeText('public/brand/xenotif-mark.svg', plainSvg())
await writeText('public/brand/xenotif-mark-mono.svg', plainSvg('currentColor', 'currentColor'))
await writeText('src/app/icon.svg', plainSvg())

// Favicon raster + icônes d'app (tuile sombre)
await writePng('src/app/icon.png', plainSvg(), 32)
await writePng('src/app/apple-icon.png', tileSvg(180, 0.19, 0.22), 180)
await writePng('public/icon-192.png', tileSvg(192, 0.19, 0.22), 192)
await writePng('public/icon-512.png', tileSvg(512, 0.19, 0.22), 512)
// Maskable : fond plein (rx 0) + marge de sécurité ~28 % (zone sûre).
await writePng('public/icon-maskable-512.png', tileSvg(512, 0.28, 0), 512)

console.log('Assets de marque générés.')
