// Génère tous les assets bitmap de la marque depuis un SVG unique.
// Lancer : node scripts/gen-brand-assets.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const ROOT = process.cwd()

// Symbole « X » XENOTIF : 4 segments épais (espace négatif central), bouts coupés nets.
// left = couleur des 2 segments gauche, right = couleur des 2 segments droite.
const markBody = (left = '#ffffff', right = '#FF6A00') =>
  `<polygon points="49.65,37.63 15.35,3.33 3.33,15.35 37.63,49.65" fill="${left}"/>` +
  `<polygon points="37.63,50.35 3.33,84.65 15.35,96.67 49.65,62.37" fill="${left}"/>` +
  `<polygon points="62.37,49.65 96.67,15.35 84.65,3.33 50.35,37.63" fill="${right}"/>` +
  `<polygon points="50.35,62.37 84.65,96.67 96.67,84.65 62.37,50.35" fill="${right}"/>`

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
