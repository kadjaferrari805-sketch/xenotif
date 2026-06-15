// Génère tous les assets bitmap de la marque depuis un SVG unique.
// Lancer : node scripts/gen-brand-assets.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const ROOT = process.cwd()

// Symbole « X » XENOTIF : 4 segments épais (espace négatif central), bouts coupés nets.
// left = couleur des 2 segments gauche, right = couleur des 2 segments droite.
const markBody = (left = '#ffffff', right = '#FF6A00') =>
  `<polygon points="48.73,38.54 14.43,4.25 4.25,14.43 38.54,48.73" fill="${left}"/>` +
  `<polygon points="38.54,51.27 4.25,85.57 14.43,95.75 48.73,61.46" fill="${left}"/>` +
  `<polygon points="61.46,48.73 95.75,14.43 85.57,4.25 51.27,38.54" fill="${right}"/>` +
  `<polygon points="51.27,61.46 85.57,95.75 95.75,85.57 61.46,51.27" fill="${right}"/>`

// Marque seule, fond transparent.
const plainSvg = (left, right) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">${markBody(left, right)}</svg>`

// Tuile sombre arrondie + marque centrée (favicon + icônes d'app). pad/radius en fraction.
const tileSvg = (px, pad, radius) => {
  const r = Math.round(px * radius)
  const inner = px * (1 - 2 * pad)
  const off = px * pad
  const scale = inner / 100
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
await writeText('public/brand/xenotif-mark.svg', plainSvg()) // bi-ton, fond transparent (surfaces sombres)
await writeText('public/brand/xenotif-mark-mono.svg', plainSvg('currentColor', 'currentColor'))
// Favicon SVG = tuile sombre → toujours visible (onglet clair ou sombre).
await writeText('src/app/icon.svg', tileSvg(100, 0.16, 0.22))

// Favicon raster + icônes d'app (tuile sombre)
await writePng('src/app/icon.png', tileSvg(128, 0.14, 0.22), 32)
await writePng('src/app/apple-icon.png', tileSvg(180, 0.19, 0.22), 180)
await writePng('public/icon-192.png', tileSvg(192, 0.19, 0.22), 192)
await writePng('public/icon-512.png', tileSvg(512, 0.19, 0.22), 512)
// Maskable : fond plein (rx 0) + marge de sécurité ~28 % (zone sûre).
await writePng('public/icon-maskable-512.png', tileSvg(512, 0.28, 0), 512)

console.log('Assets de marque générés.')
