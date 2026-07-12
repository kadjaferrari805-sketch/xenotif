#!/usr/bin/env node
// Génère 5 images "étape par étape" par pattern de mouvement (silhouette studio),
// dérivées de l'animation : public/steps/<pattern>-1..5.jpg
// (positions départ / descente / basse / remontée / finale).
import { mkdirSync } from 'node:fs'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/steps')
mkdirSync(OUT, { recursive: true })
const W = 400, H = 400
const sin = (d) => Math.sin(d * Math.PI / 180)
const cos = (d) => Math.cos(d * Math.PI / 180)
const ease = (t) => (1 - Math.cos(t * 2 * Math.PI)) / 2

// Poses (profil, face à droite ; y bas) — identiques au générateur de GIF.
// Coord de base en 300 px, on translate ensuite dans le canvas 400.
function pose(pattern, t) {
  const d = ease(t); const P = {}
  if (pattern === 'squat') {
    P.ankle = [150, 286]; P.hip = [150 - 8 * d, 188 + 44 * d]; P.knee = [150 + 28 * d, 244 - 2 * d]
    const lean = 26 * d; P.shoulder = [P.hip[0] + sin(lean) * 82, P.hip[1] - cos(lean) * 82]
    P.head = [P.shoulder[0] + sin(lean) * 24, P.shoulder[1] - cos(lean) * 24]
    P.hand = [P.shoulder[0] + 52, P.shoulder[1] + 22 - 30 * d]; P.elbow = [(P.shoulder[0] + P.hand[0]) / 2 + 4, (P.shoulder[1] + P.hand[1]) / 2 - 6]
  } else if (pattern === 'pushup') {
    P.ankle = [258, 262]; P.knee = [222, 250]; P.hip = [190, 236]; const low = 30 * d
    P.shoulder = [122, 214 + low]; P.head = [98, 210 + low]; P.hand = [104, 264]; P.elbow = [110, 238 + low - 4 - 14 * (1 - d)]
  } else if (pattern === 'plank') {
    const b = 3 * Math.sin(t * 2 * Math.PI)
    P.ankle = [258, 258]; P.knee = [222, 250]; P.hip = [190, 236 + b]; P.shoulder = [120, 224 + b]; P.head = [98, 222 + b]; P.hand = [104, 262]; P.elbow = [104, 244]
  } else if (pattern === 'crunch') {
    P.hip = [150, 250]; P.knee = [110, 232]; P.ankle = [78, 258]; const up = 40 * d
    P.shoulder = [188 - 6 * d, 250 - up]; P.head = [206 - 8 * d, 244 - up * 1.05]; P.elbow = [200, 232 - up * 0.7]; P.hand = [206, 220 - up * 0.5]
  } else if (pattern === 'curl') {
    P.ankle = [150, 286]; P.knee = [150, 240]; P.hip = [150, 190]; P.shoulder = [150, 110]; P.head = [150, 86]; P.elbow = [150, 150]
    const a = 150 * d; P.hand = [P.elbow[0] + sin(a) * 40, P.elbow[1] + cos(a) * 40]
  } else if (pattern === 'press') {
    P.ankle = [150, 286]; P.knee = [150, 240]; P.hip = [150, 190]; P.shoulder = [150, 112]; P.head = [150, 88]; const up = d
    P.elbow = [150 + 20 * (1 - up) + 6, 96 - 20 * up]; P.hand = [150 + 8 * (1 - up), 70 - 40 * up]
  } else if (pattern === 'jumpingjack') {
    P.front = true; const s = d
    P.hip = [150, 200]; P.shoulder = [150, 120]; P.head = [150, 96]
    P.knee = [150 - 22 * s, 244]; P.ankle = [150 - 40 * s, 288]; P.kneeR = [150 + 22 * s, 244]; P.ankleR = [150 + 40 * s, 288]
    P.elbow = [150 - 34 - 6 * s, 120 - 20 * s]; P.hand = [150 - 44 - 18 * s, 120 - 46 * s]; P.elbowR = [150 + 34 + 6 * s, 120 - 20 * s]; P.handR = [150 + 44 + 18 * s, 120 - 46 * s]
  } else if (pattern === 'lunge') {
    P.hip = [150, 196 + 26 * d]; P.knee = [150 + 40, 236 + 20 * d]; P.ankle = [150 + 44, 286]
    P.kneeR = [150 - 34, 250 + 18 * d]; P.ankleR = [150 - 60, 286]
    P.shoulder = [P.hip[0] + 2, P.hip[1] - 80]; P.head = [P.shoulder[0], P.shoulder[1] - 24]; P.elbow = [P.shoulder[0], P.shoulder[1] + 40]; P.hand = [P.shoulder[0], P.shoulder[1] + 76]; P.front = true
  } else if (pattern === 'pull') {
    P.ankle = [150, 286]; P.knee = [150, 240]; P.hip = [150, 190]; P.shoulder = [150, 112]; P.head = [150, 88]
    P.elbow = [150 - 22 * d, 150]; P.hand = [150 + (54 - 44 * d), 152]
  } else {
    P.ankle = [150, 286]; P.knee = [150 - 4, 240]; P.hip = [150, 190]; const bend = 62 * d
    P.shoulder = [P.hip[0] + sin(bend) * 80, P.hip[1] - cos(bend) * 80]; P.head = [P.shoulder[0] + sin(bend) * 24, P.shoulder[1] - cos(bend) * 24]
    P.hand = [P.shoulder[0] + 6, P.shoulder[1] + 46 - 10 * d]; P.elbow = [(P.shoulder[0] + P.hand[0]) / 2, (P.shoulder[1] + P.hand[1]) / 2]
  }
  return P
}

const FIG = '#1c1c22', DX = 50, DY = 30 // translation pour centrer dans 400
const tp = (p) => [p[0] + DX, p[1] + DY]
const line = (a, b, w) => { const A = tp(a), B = tp(b); return `<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" stroke="${FIG}" stroke-width="${w}" stroke-linecap="round"/>` }
function svg(P) {
  const feet = [P.ankle, P.ankleR].filter(Boolean); const shx = (feet.length ? feet.reduce((s, f) => s + f[0], 0) / feet.length : 150) + DX
  const parts = [
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8e8ee"/></linearGradient></defs>`,
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>`,
    `<ellipse cx="${shx.toFixed(0)}" cy="${(293 + DY)}" rx="70" ry="9" fill="rgba(20,20,25,0.12)"/>`,
  ]
  if (P.front) {
    if (P.kneeR) { parts.push(line(P.hip, P.kneeR, 22)); parts.push(line(P.kneeR, P.ankleR, 16)) }
    if (P.elbowR) { parts.push(line(P.shoulder, P.elbowR, 15)); parts.push(line(P.elbowR, P.handR, 12)) }
  }
  if (P.knee) { parts.push(line(P.hip, P.knee, 22)); parts.push(line(P.knee, P.ankle, 16)) }
  parts.push(line(P.hip, P.shoulder, 30))
  if (P.elbow) { parts.push(line(P.shoulder, P.elbow, 15)); parts.push(line(P.elbow, P.hand, 12)) }
  const hd = tp(P.head); parts.push(`<circle cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" r="18" fill="${FIG}"/>`)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`
}

const PHASES = [0, 0.28, 0.5, 0.72, 0.92] // départ, descente, basse, remontée, finale
const patterns = ['squat', 'pushup', 'plank', 'crunch', 'curl', 'press', 'jumpingjack', 'lunge', 'hinge', 'pull']
for (const p of patterns) {
  for (let i = 0; i < PHASES.length; i++) {
    const buf = await sharp(Buffer.from(svg(pose(p, PHASES[i])))).jpeg({ quality: 84 }).toBuffer()
    writeFileSync(join(OUT, `${p}-${i + 1}.jpg`), buf)
  }
  console.log('✅', p)
}
console.log('done →', OUT)
