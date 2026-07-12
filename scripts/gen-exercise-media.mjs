#!/usr/bin/env node
// Génère les médias d'animation des exercices : silhouette HUMAINE (corps galbé)
// sur fond blanc studio, par pattern de mouvement.
//   public/gifs/<pattern>.gif        (animation bouclée)
//   public/steps/<pattern>-1..5.jpg  (5 positions clés)
// Pipeline : SVG (corps humain posé par cinématique) → sharp → gif (ffmpeg) / jpg.
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const GIFS = join(ROOT, 'public/gifs')
const STEPS = join(ROOT, 'public/steps')
mkdirSync(GIFS, { recursive: true }); mkdirSync(STEPS, { recursive: true })
const W = 360, H = 400, DX = 30, DY = 20, N = 18, FPS = 14
const sin = (d) => Math.sin(d * Math.PI / 180)
const cos = (d) => Math.cos(d * Math.PI / 180)
const ease = (t) => (1 - Math.cos(t * 2 * Math.PI)) / 2

// ── Poses (profil face à droite ; y bas) ────────────────────────────────────
function pose(pattern, t) {
  const d = ease(t); const P = { dir: 1 }
  if (pattern === 'squat') {
    P.ankle = [150, 286]; P.hip = [150 - 8 * d, 188 + 44 * d]; P.knee = [150 + 28 * d, 244 - 2 * d]
    const lean = 26 * d; P.shoulder = [P.hip[0] + sin(lean) * 82, P.hip[1] - cos(lean) * 82]
    P.head = [P.shoulder[0] + sin(lean) * 26, P.shoulder[1] - cos(lean) * 26]
    P.hand = [P.shoulder[0] + 52, P.shoulder[1] + 22 - 30 * d]; P.elbow = [(P.shoulder[0] + P.hand[0]) / 2 + 4, (P.shoulder[1] + P.hand[1]) / 2 - 6]
  } else if (pattern === 'pushup') {
    P.ankle = [258, 262]; P.knee = [222, 250]; P.hip = [190, 236]; const low = 30 * d
    P.shoulder = [122, 214 + low]; P.head = [96, 210 + low]; P.hand = [104, 264]; P.elbow = [110, 238 + low - 4 - 14 * (1 - d)]; P.dir = -1
  } else if (pattern === 'plank') {
    const b = 3 * Math.sin(t * 2 * Math.PI)
    P.ankle = [258, 258]; P.knee = [222, 250]; P.hip = [190, 236 + b]; P.shoulder = [120, 224 + b]; P.head = [96, 222 + b]; P.hand = [104, 262]; P.elbow = [104, 244]; P.dir = -1
  } else if (pattern === 'crunch') {
    P.hip = [150, 250]; P.knee = [110, 232]; P.ankle = [78, 258]; const up = 40 * d
    P.shoulder = [188 - 6 * d, 250 - up]; P.head = [206 - 8 * d, 244 - up * 1.05]; P.elbow = [200, 232 - up * 0.7]; P.hand = [206, 220 - up * 0.5]
  } else if (pattern === 'curl') {
    P.ankle = [150, 286]; P.knee = [150, 240]; P.hip = [150, 190]; P.shoulder = [150, 110]; P.head = [150, 84]; P.elbow = [150, 150]
    const a = 150 * d; P.hand = [P.elbow[0] + sin(a) * 40, P.elbow[1] + cos(a) * 40]
  } else if (pattern === 'press') {
    P.ankle = [150, 286]; P.knee = [150, 240]; P.hip = [150, 190]; P.shoulder = [150, 112]; P.head = [150, 86]; const up = d
    P.elbow = [150 + 20 * (1 - up) + 6, 96 - 20 * up]; P.hand = [150 + 8 * (1 - up), 70 - 40 * up]
  } else if (pattern === 'jumpingjack') {
    P.front = true; const s = d
    P.hip = [150, 200]; P.shoulder = [150, 118]; P.head = [150, 92]
    P.knee = [150 - 22 * s, 244]; P.ankle = [150 - 40 * s, 288]; P.kneeR = [150 + 22 * s, 244]; P.ankleR = [150 + 40 * s, 288]
    P.elbow = [150 - 34 - 6 * s, 118 - 20 * s]; P.hand = [150 - 44 - 18 * s, 118 - 46 * s]; P.elbowR = [150 + 34 + 6 * s, 118 - 20 * s]; P.handR = [150 + 44 + 18 * s, 118 - 46 * s]
  } else if (pattern === 'lunge') {
    P.front = true; P.hip = [150, 196 + 26 * d]; P.knee = [150 + 40, 236 + 20 * d]; P.ankle = [150 + 44, 286]
    P.kneeR = [150 - 34, 250 + 18 * d]; P.ankleR = [150 - 60, 286]
    P.shoulder = [P.hip[0] + 2, P.hip[1] - 82]; P.head = [P.shoulder[0], P.shoulder[1] - 26]; P.elbow = [P.shoulder[0], P.shoulder[1] + 40]; P.hand = [P.shoulder[0], P.shoulder[1] + 76]
  } else if (pattern === 'pull') {
    P.ankle = [150, 286]; P.knee = [150, 240]; P.hip = [150, 190]; P.shoulder = [150, 112]; P.head = [150, 86]
    P.elbow = [150 - 22 * d, 150]; P.hand = [150 + (54 - 44 * d), 152]
  } else {
    P.ankle = [150, 286]; P.knee = [150 - 4, 240]; P.hip = [150, 190]; const bend = 62 * d
    P.shoulder = [P.hip[0] + sin(bend) * 80, P.hip[1] - cos(bend) * 80]; P.head = [P.shoulder[0] + sin(bend) * 26, P.shoulder[1] - cos(bend) * 26]
    P.hand = [P.shoulder[0] + 6, P.shoulder[1] + 46 - 10 * d]; P.elbow = [(P.shoulder[0] + P.hand[0]) / 2, (P.shoulder[1] + P.hand[1]) / 2]
  }
  return P
}

// ── Silhouette humaine (corps galbé, membres tronconiques + articulations) ───
const FIG = '#17171b'
const tp = (p) => [p[0] + DX, p[1] + DY]
function circle(p, r) { const q = tp(p); return `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${r.toFixed(1)}"/>` }
function seg(a, b, wa, wb) {
  const A = tp(a), B = tp(b), dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L
  const P = (pt, w, s) => `${(pt[0] + nx * w / 2 * s).toFixed(1)},${(pt[1] + ny * w / 2 * s).toFixed(1)}`
  return `<polygon points="${P(A, wa, 1)} ${P(B, wb, 1)} ${P(B, wb, -1)} ${P(A, wa, -1)}"/>` + circle(a, wa / 2) + circle(b, wb / 2)
}
function foot(ankle, dir) { const q = tp(ankle); return `<ellipse cx="${(q[0] + 10 * dir).toFixed(1)}" cy="${(q[1] + 4).toFixed(1)}" rx="13" ry="6"/>` }

function svg(P) {
  const feet = [P.ankle, P.ankleR].filter(Boolean)
  const shx = (feet.length ? feet.reduce((s, f) => s + f[0], 0) / feet.length : 150) + DX
  const b = [`<g fill="${FIG}">`]
  // jambe(s)
  if (P.front && P.kneeR) { b.push(seg(P.hip, P.kneeR, 26, 18), seg(P.kneeR, P.ankleR, 17, 10), foot(P.ankleR, -1)) }
  if (P.knee) { b.push(seg(P.hip, P.knee, 26, 18), seg(P.knee, P.ankle, 17, 10), foot(P.ankle, P.front ? 1 : P.dir)) }
  // torse (épaules larges → taille)
  b.push(seg(P.hip, P.shoulder, 30, 36))
  // bras
  if (P.front && P.elbowR) { b.push(seg(P.shoulder, P.elbowR, 15, 12), seg(P.elbowR, P.handR, 12, 8), circle(P.handR, 5)) }
  if (P.elbow) { b.push(seg(P.shoulder, P.elbow, 15, 12), seg(P.elbow, P.hand, 12, 8), circle(P.hand, 5)) }
  // cou + tête (ovale)
  b.push(seg(P.shoulder, P.head, 13, 11))
  const hd = tp(P.head); b.push(`<ellipse cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" rx="15" ry="18"/>`)
  b.push('</g>')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8e8ee"/></linearGradient></defs>`
    + `<rect width="${W}" height="${H}" fill="url(#bg)"/>`
    + `<ellipse cx="${shx.toFixed(0)}" cy="${313 + DY}" rx="72" ry="9" fill="rgba(20,20,25,0.12)"/>`
    + b.join('') + `</svg>`
}

const PATTERNS = ['squat', 'pushup', 'plank', 'crunch', 'curl', 'press', 'jumpingjack', 'lunge', 'hinge', 'pull']
const PHASES = [0, 0.28, 0.5, 0.72, 0.92]

for (const p of PATTERNS) {
  // GIF
  const dir = mkdtempSync(join(tmpdir(), 'gif-'))
  for (let i = 0; i < N; i++) writeFileSync(join(dir, `f${String(i).padStart(3, '0')}.png`), await sharp(Buffer.from(svg(pose(p, i / N)))).png().toBuffer())
  spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', join(dir, 'f%03d.png'), '-vf', 'split[s0][s1];[s0]palettegen=stats_mode=full[pl];[s1][pl]paletteuse=dither=bayer', '-loop', '0', join(GIFS, `${p}.gif`)], { encoding: 'utf8' })
  // Étapes
  for (let i = 0; i < PHASES.length; i++) writeFileSync(join(STEPS, `${p}-${i + 1}.jpg`), await sharp(Buffer.from(svg(pose(p, PHASES[i])))).jpeg({ quality: 84 }).toBuffer())
  console.log('✅', p)
}
console.log('done — gifs + steps régénérés (silhouette humaine)')
