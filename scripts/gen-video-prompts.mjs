#!/usr/bin/env node
// Génère un prompt de génération vidéo (Higgsfield / text-to-video) par exercice,
// à partir de scripts/exercise-names.json. Sortie : docs/higgsfield-exercise-prompts.md
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DB = JSON.parse(readFileSync(join(ROOT, 'scripts/exercise-names.json'), 'utf8'))
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Pattern de mouvement (mêmes règles que lib/exercices/details.ts).
const RULES = [
  ['jumpingjack', /jumping|burpee|mountain|climber|high knee|skater|sprint|talon|corde|montees de genoux|genou/],
  ['plank', /gainage|plank|superman|hollow/],
  ['crunch', /crunch|abdo|relev|sit-?up|russian|roue abdominal|leg raise|jambes suspendu/],
  ['curl', /curl|biceps|marteau/],
  ['press', /developpe militaire|militaire|overhead|elevation|epaule|pike|shoulder/],
  ['pushup', /pompes|push|dips|developpe (couche|incline)|pec/],
  ['pull', /traction|tirage|rowing|pull-over|pull|face pull/],
  ['hinge', /souleve|deadlift|romanian|hip thrust|pont fessier|good morning|hinge/],
  ['lunge', /fente|lunge|split squat|bulgar|montee/],
  ['squat', /squat|chaise|wall sit|presse|leg (press|extension|curl)|goblet|mollet|pistol|fessier/],
]
const patternFor = (name) => { const n = norm(name); for (const [p, re] of RULES) if (re.test(n)) return p; return 'squat' }

const MOVE = {
  squat: 'lowering into a controlled squat and standing back up, knees tracking over the toes, chest up',
  pushup: 'in a straight-body plank, lowering the chest toward the floor and pressing back up',
  plank: 'holding a steady forearm plank, body in one straight line, core braced',
  crunch: 'lying on the back, curling the upper torso up toward the knees and lowering with control',
  curl: 'standing tall, curling the weight up by bending the elbows, then lowering slowly',
  press: 'standing, pressing the weights from the shoulders straight overhead and back down',
  jumpingjack: 'performing jumping jacks, arms and legs opening out and returning together in rhythm',
  lunge: 'stepping forward into a lunge, front knee bending to about 90 degrees, then returning',
  hinge: 'hinging at the hips with a flat neutral back, lowering the weight and driving the hips forward to stand',
  pull: 'pulling the elbows back and down in a rowing motion, squeezing the shoulder blades together',
}

const TERM = {
  squat: 'squat', pushup: 'push-up', plank: 'plank hold', crunch: 'ab crunch',
  curl: 'biceps curl', press: 'overhead shoulder press', jumpingjack: 'jumping-jack cardio move',
  lunge: 'forward lunge', hinge: 'hip-hinge / deadlift', pull: 'back row / pulling exercise',
}
const rows = DB.map(({ slug, names }) => {
  const fr = names[0]
  const pattern = patternFor(names.join(' '))
  const prompt = `Cinematic fitness demonstration: a fit athlete in fitted black sportswear performing a ${TERM[pattern]} ("${fr}") on a seamless bright white studio background, full body visible and centered, ${MOVE[pattern]}, smooth continuous controlled repetitions, soft even studio lighting with a soft floor shadow, front three-quarter camera angle, sharp focus, photorealistic, 5-second seamless loop, no text, no logos, no captions.`
  return { slug, fr, pattern, prompt }
})

let md = `# Prompts vidéo par exercice — Higgsfield / text-to-video\n\n`
md += `Généré automatiquement (${rows.length} exercices). Colle chaque prompt dans Higgsfield (sur claude.ai ou l'app), génère un clip **~5 s, fond blanc studio, boucle**, puis **télécharge le fichier en le nommant \`<slug>.mp4\`**.\n\n`
md += `Ensuite : mets tous les \`.mp4\` dans un dossier et lance :\n\n\`\`\`bash\nnode scripts/import-exercise-videos.mjs "<dossier>" --commit && git push\n\`\`\`\n\n`
md += `> Réglages Higgsfield conseillés : format vertical 9:16 ou carré 1:1, 5 s, fond blanc, plan large (full body). Reste cohérent (même style d'athlète/éclairage) sur tous les clips.\n\n---\n\n`
for (const r of rows) {
  md += `### ${r.fr}\n`
  md += `- **Fichier** : \`${r.slug}.mp4\`  ·  **Mouvement** : ${r.pattern}\n`
  md += `- **Prompt** :\n\n> ${r.prompt}\n\n`
}

mkdirSync(join(ROOT, 'docs'), { recursive: true })
writeFileSync(join(ROOT, 'docs/higgsfield-exercise-prompts.md'), md)
writeFileSync(join(ROOT, 'scripts/exercise-video-prompts.json'), JSON.stringify(rows, null, 2) + '\n')
console.log(`✅ ${rows.length} prompts → docs/higgsfield-exercise-prompts.md (+ scripts/exercise-video-prompts.json)`)
console.log('exemples :')
for (const r of rows.filter((x) => ['squat', 'developpe-militaire', 'tractions', 'burpee'].includes(x.slug))) console.log(`  • ${r.slug} (${r.pattern})`)
