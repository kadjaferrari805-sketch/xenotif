#!/usr/bin/env node
// Génère, à partir des vraies vidéos importées (public/videos/exercises/<slug>.mp4),
// 5 frames "étape par étape" réelles par exercice — de vrais humains, pas des
// silhouettes générées. L'animation en boucle réutilise directement le mp4
// (voir LoopBlock dans ExerciceDetail.tsx), pas besoin de GIF.
//   public/steps/<slug>-1..5.jpg  (5 positions clés, réparties sur la durée)
//
// Usage :
//   node scripts/gen-exercise-frames.mjs [--height 480] [--commit] [--only <slug>]

import { spawnSync } from 'node:child_process'
import { readdirSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'public/videos/exercises')
const STEPS = join(ROOT, 'public/steps')

const argv = process.argv.slice(2)
const flags = {}
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--commit') flags.commit = true
  else if (a.startsWith('--')) flags[a.slice(2)] = argv[++i]
}
const HEIGHT = +(flags.height || 480)
const ONLY = flags.only

mkdirSync(STEPS, { recursive: true })

const files = readdirSync(SRC).filter((f) => extname(f).toLowerCase() === '.mp4')
const slugs = files.map((f) => basename(f, '.mp4')).filter((s) => !ONLY || s === ONLY)

console.log(`🖼️  ${slugs.length} vidéo(s) → 5 étapes réelles (h=${HEIGHT}px)\n`)

let ok = 0
for (const slug of slugs) {
  const input = join(SRC, `${slug}.mp4`)
  const dur = parseFloat(
    spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', input], { encoding: 'utf8' }).stdout
  ) || 4

  // 5 frames réparties sur la durée (évite 0.0 et la toute fin, souvent figées)
  const fracs = [0.04, 0.28, 0.5, 0.72, 0.94]
  let steps = true
  fracs.forEach((f, i) => {
    const jpg = join(STEPS, `${slug}-${i + 1}.jpg`)
    const r = spawnSync('ffmpeg', [
      '-y', '-ss', (dur * f).toFixed(2), '-i', input,
      '-frames:v', '1', '-vf', `scale=-2:${HEIGHT}`, '-q:v', '3',
      jpg,
    ], { encoding: 'utf8' })
    if (r.status !== 0 || !existsSync(jpg)) steps = false
  })

  if (steps) { console.log(`  ✅ ${slug}  5 étapes`); ok++ }
  else console.log(`  ❌ ${slug}  échec`)
}

console.log(`\n—— ${ok}/${slugs.length} OK ——`)

if (flags.commit) {
  spawnSync('git', ['add', STEPS], { cwd: ROOT, stdio: 'inherit' })
  const msg = `feat(exercices): vraies frames humaines pour l'étape par étape (${ok} exercices)`
  const c = spawnSync('git', ['commit', '-q', '-m', msg], { cwd: ROOT, encoding: 'utf8' })
  console.log(c.status === 0 ? `\n✅ commité : ${msg}` : `\n⚠️ commit : ${c.stderr || c.stdout}`)
}
