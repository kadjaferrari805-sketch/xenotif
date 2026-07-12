#!/usr/bin/env node
// Import de vidéos de démonstration d'exercices.
//
// Usage :
//   node scripts/import-exercise-videos.mjs "<dossier-source>" [options]
//
// Options :
//   --out <dir>     dossier de sortie (défaut: public/videos/exercises)
//   --height <px>   hauteur cible (défaut: 720)
//   --crf <n>       qualité H.264, + petit = + net/+ lourd (défaut: 30)
//   --min <score>   score de correspondance minimal 0-100 (défaut: 55)
//   --commit        git add + commit du dossier de sortie après import
//   --dry           n'écrit rien, montre seulement les correspondances
//
// Le script prend chaque vidéo du dossier, la mappe à un exercice (par slug ou
// par nom fr/en/de), l'optimise (H.264 muet, faststart), génère un poster .jpg,
// et l'écrit en <slug>.mp4 / <slug>.jpg. Astuce : le plus sûr est de nommer ton
// fichier directement <slug>.mp4 (ex. squat.mp4, developpe-militaire.mp4).

import { spawnSync } from 'node:child_process'
import { readdirSync, existsSync, mkdirSync, statSync, readFileSync } from 'node:fs'
import { join, basename, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DB = JSON.parse(readFileSync(join(ROOT, 'scripts/exercise-names.json'), 'utf8'))
const VID_EXT = new Set(['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'])

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const flags = {}
const positional = []
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--commit' || a === '--dry') flags[a.slice(2)] = true
  else if (a.startsWith('--')) flags[a.slice(2)] = argv[++i]
  else positional.push(a)
}
const SRC = positional[0]
const OUT = flags.out || join(ROOT, 'public/videos/exercises')
const HEIGHT = +(flags.height || 720)
const CRF = +(flags.crf || 30)
const MIN = +(flags.min || 55)

if (!SRC || !existsSync(SRC)) {
  console.error('❌ Dossier source introuvable.\n   Usage : node scripts/import-exercise-videos.mjs "<dossier>" [--out … --height 720 --crf 30 --commit --dry]')
  process.exit(1)
}

// ── correspondance ───────────────────────────────────────────────────────────
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const toks = (s) => norm(s).split('-').filter((t) => t.length > 1)
function jaccard(aTok, bTok) {
  const A = new Set(aTok), B = new Set(bTok)
  const inter = [...A].filter((x) => B.has(x)).length
  const uni = new Set([...A, ...B]).size
  return uni ? inter / uni : 0
}
function matchSlug(fileBase) {
  const fn = norm(fileBase), ftok = toks(fileBase)
  let best = { slug: null, score: 0, reason: '' }
  const bump = (slug, score, reason) => { if (score > best.score) best = { slug, score, reason } }
  for (const { slug, names } of DB) {
    if (fn === slug) bump(slug, 100, 'slug exact')
    else if (fn.includes(slug) || slug.includes(fn)) bump(slug, 90, 'slug inclus')
    bump(slug, Math.round(jaccard(ftok, toks(slug)) * 72), 'tokens')
    for (const name of names) {
      const nn = norm(name)
      if (fn === nn) bump(slug, 96, 'nom exact')
      else if (fn.includes(nn) || nn.includes(fn)) bump(slug, 86, 'nom inclus')
      bump(slug, Math.round(jaccard(ftok, toks(name)) * 74), 'tokens (nom)')
    }
  }
  return best
}

// ── collecte + résolution ────────────────────────────────────────────────────
const files = readdirSync(SRC).filter((f) => VID_EXT.has(extname(f).toLowerCase()))
if (files.length === 0) { console.error('❌ Aucune vidéo dans le dossier (mp4/mov/m4v/webm/avi/mkv).'); process.exit(1) }

const claimed = new Map() // slug -> {file, score}
const plan = []           // {file, slug|null, score, reason}
for (const f of files) {
  const m = matchSlug(basename(f, extname(f)))
  if (m.slug && m.score >= MIN) {
    const prev = claimed.get(m.slug)
    if (prev && prev.score >= m.score) { plan.push({ file: f, slug: null, score: m.score, reason: `déjà pris par ${prev.file}` }) }
    else {
      if (prev) { const p = plan.find((x) => x.file === prev.file); if (p) { p.slug = null; p.reason = `remplacé par ${f}` } }
      claimed.set(m.slug, { file: f, score: m.score })
      plan.push({ file: f, slug: m.slug, score: m.score, reason: m.reason })
    }
  } else {
    plan.push({ file: f, slug: null, score: m.score, reason: m.slug ? `trop faible (≈${m.slug} ${m.score})` : 'aucune correspondance' })
  }
}

console.log(`\n📁 Source : ${SRC}`)
console.log(`🎯 Sortie : ${OUT}   (h=${HEIGHT}px, crf=${CRF}, min=${MIN})\n`)
for (const p of plan) {
  if (p.slug) console.log(`  ✅ ${p.file}  →  ${p.slug}.mp4   (${p.reason} ${p.score})`)
  else console.log(`  ⏭️  ${p.file}  →  NON MAPPÉ   (${p.reason})`)
}
const toImport = plan.filter((p) => p.slug)
console.log(`\n${toImport.length}/${files.length} vidéo(s) mappée(s).`)
if (flags.dry) { console.log('\n(--dry : rien écrit.)'); process.exit(0) }
if (toImport.length === 0) { console.log('Renomme les fichiers en <slug>.mp4 (voir scripts/exercise-names.json) et relance.'); process.exit(0) }

// ── encodage ─────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true })
const kb = (p) => Math.round(statSync(p).size / 1024)
for (const p of toImport) {
  const input = join(SRC, p.file)
  const mp4 = join(OUT, `${p.slug}.mp4`)
  const jpg = join(OUT, `${p.slug}.jpg`)
  const dur = parseFloat(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', input], { encoding: 'utf8' }).stdout) || 4
  const r1 = spawnSync('ffmpeg', ['-y', '-i', input, '-an', '-vf', `scale=-2:${HEIGHT}`, '-c:v', 'libx264', '-crf', String(CRF), '-preset', 'veryfast', '-movflags', '+faststart', '-pix_fmt', 'yuv420p', mp4], { encoding: 'utf8' })
  spawnSync('ffmpeg', ['-y', '-ss', String((dur * 0.4).toFixed(2)), '-i', input, '-frames:v', '1', '-vf', `scale=-2:${HEIGHT}`, jpg], { encoding: 'utf8' })
  if (r1.status === 0 && existsSync(mp4)) console.log(`  🎬 ${p.slug}.mp4 (${kb(mp4)} Ko) + poster`)
  else console.log(`  ❌ échec encodage ${p.file}\n${r1.stderr?.split('\n').slice(-3).join('\n')}`)
}

// ── commit ───────────────────────────────────────────────────────────────────
if (flags.commit) {
  spawnSync('git', ['add', OUT], { cwd: ROOT, stdio: 'inherit' })
  const msg = `feat(exercices): import ${toImport.length} vidéo(s) de démonstration`
  const c = spawnSync('git', ['commit', '-q', '-m', msg], { cwd: ROOT, encoding: 'utf8' })
  console.log(c.status === 0 ? `\n✅ commité : ${msg}\n   (push : git push, puis Vercel rebuild → vidéos en ligne)` : `\n⚠️ commit : ${c.stderr || c.stdout}`)
} else {
  console.log(`\n➡️  Pour publier : git add ${OUT} && git commit -m "import vidéos exercices" && git push`)
}
