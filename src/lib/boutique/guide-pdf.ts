import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Guide } from './guides'

const A4 = { w: 595.28, h: 841.89 }
const M = { left: 56, right: 56, top: 72, bottom: 64 }
const CONTENT_W = A4.w - M.left - M.right

const COL = {
  dark: rgb(0.039, 0.043, 0.059),
  orange: rgb(1, 0.27, 0),
  white: rgb(1, 1, 1),
  ink: rgb(0.12, 0.13, 0.15),
  grey: rgb(0.40, 0.43, 0.48),
  subtitle: rgb(0.60, 0.63, 0.68),
  rule: rgb(0.85, 0.86, 0.88),
  noteBg: rgb(1, 0.95, 0.91),
  cardBg: rgb(0.965, 0.968, 0.975),
  lightRule: rgb(0.89, 0.90, 0.92),
  green: rgb(0.13, 0.62, 0.40),
  blue: rgb(0.15, 0.39, 0.92),
  red: rgb(0.84, 0.22, 0.18),
}

// Couleur du badge de difficulté d'un exercice.
function levelColor(level: string) {
  const l = level.toLowerCase()
  if (l.includes('avanc') || l.includes('advanced') || l.includes('fortgeschritten')) return COL.red
  if (l.includes('inter') || l.includes('mittel')) return COL.orange
  return COL.green // débutant / beginner / anfänger / tous niveaux
}

// Caractères supportés par l'encodage WinAnsi au-delà du Latin-1
const HIGH_OK = new Set([0x20ac, 0x2026, 0x2014, 0x2013, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2039, 0x203a, 0x0152, 0x0153, 0x2122])
function safe(t: string): string {
  let out = ''
  for (const ch of t) {
    const c = ch.codePointAt(0) ?? 0
    if (c <= 0xff || HIGH_OK.has(c)) out += ch
    else if (c === 0x2212 || c === 0x2192) out += '-' // − (moins) et → (flèche) non WinAnsi
    // sinon (emojis, etc.) → ignoré
  }
  return out
}

interface Ctx {
  doc: PDFDocument
  page: PDFPage
  y: number
  reg: PDFFont
  bold: PDFFont
  ital: PDFFont
  guide: Guide
  pageNo: number
  locale: string
}

// Mention légale de couverture, localisée (fr par défaut).
const COVER_NOTICE: Record<string, string> = {
  fr: 'Guide officiel — © Xenotif® — Réservé à ton usage personnel.',
  en: 'Official guide — © Xenotif® — For your personal use only.',
  de: 'Offizieller Leitfaden — © Xenotif® — Nur für deinen persönlichen Gebrauch.',
}

const lh = (size: number) => size * 1.42

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = safe(text).split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (line && font.widthOfTextAtSize(test, size) > maxW) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function footer(ctx: Ctx) {
  const p = ctx.page
  p.drawRectangle({ x: M.left, y: M.bottom - 16, width: CONTENT_W, height: 0.5, color: COL.rule })
  p.drawText('XENOTIF®', { x: M.left, y: M.bottom - 28, size: 8, font: ctx.bold, color: COL.grey })
  p.drawText(safe(ctx.guide.title), { x: M.left + 60, y: M.bottom - 28, size: 8, font: ctx.reg, color: COL.grey })
  const ps = String(ctx.pageNo)
  p.drawText(ps, { x: A4.w - M.right - ctx.reg.widthOfTextAtSize(ps, 8), y: M.bottom - 28, size: 8, font: ctx.reg, color: COL.grey })
}

function newPage(ctx: Ctx) {
  ctx.page = ctx.doc.addPage([A4.w, A4.h])
  ctx.pageNo += 1
  footer(ctx)
  ctx.y = A4.h - M.top
}

function ensure(ctx: Ctx, need: number) {
  if (ctx.y - need < M.bottom) newPage(ctx)
}

function drawLines(ctx: Ctx, lines: string[], font: PDFFont, size: number, color = COL.ink, x = M.left) {
  for (const ln of lines) {
    ensure(ctx, lh(size))
    ctx.page.drawText(ln, { x, y: ctx.y - size, size, font, color })
    ctx.y -= lh(size)
  }
}

function drawH1(ctx: Ctx, text: string) {
  // Chaque chapitre démarre sur une nouvelle page (convention ebook),
  // sauf si la page courante est encore vierge.
  if (ctx.y < A4.h - M.top - 1) newPage(ctx)
  const size = 20
  drawLines(ctx, wrap(text, ctx.bold, size, CONTENT_W), ctx.bold, size, COL.orange)
  ctx.y -= 5
  ctx.page.drawRectangle({ x: M.left, y: ctx.y, width: 48, height: 3, color: COL.orange })
  ctx.y -= 20
}

function drawH2(ctx: Ctx, text: string) {
  ctx.y -= 7
  const size = 12.5
  ensure(ctx, lh(size))
  drawLines(ctx, wrap(text, ctx.bold, size, CONTENT_W), ctx.bold, size, COL.ink)
  ctx.y -= 4
}

function drawParagraph(ctx: Ctx, text: string) {
  const size = 10.5
  drawLines(ctx, wrap(text, ctx.reg, size, CONTENT_W), ctx.reg, size, COL.ink)
  ctx.y -= 7
}

function drawList(ctx: Ctx, items: string[]) {
  const size = 10.5
  const textIndent = 28
  for (const item of items) {
    const lines = wrap(item, ctx.reg, size, CONTENT_W - textIndent)
    ensure(ctx, lh(size))
    ctx.page.drawText('•', { x: M.left + 14, y: ctx.y - size, size: size + 1, font: ctx.bold, color: COL.orange })
    ctx.page.drawText(lines[0] ?? '', { x: M.left + textIndent, y: ctx.y - size, size, font: ctx.reg, color: COL.ink })
    ctx.y -= lh(size)
    drawLines(ctx, lines.slice(1), ctx.reg, size, COL.ink, M.left + textIndent)
    ctx.y -= 2.5
  }
  ctx.y -= 5
}

function drawNote(ctx: Ctx, text: string) {
  const size = 10
  const padX = 16
  const padY = 11
  const lines = wrap(text, ctx.ital, size, CONTENT_W - padX * 2 - 6)
  const boxH = lines.length * lh(size) + padY * 2 - (lh(size) - size)
  ctx.y -= 6
  ensure(ctx, boxH + 8)
  const top = ctx.y
  ctx.page.drawRectangle({ x: M.left, y: top - boxH, width: CONTENT_W, height: boxH, color: COL.noteBg })
  ctx.page.drawRectangle({ x: M.left, y: top - boxH, width: 4, height: boxH, color: COL.orange })
  let yy = top - padY
  for (const ln of lines) {
    ctx.page.drawText(ln, { x: M.left + padX + 6, y: yy - size, size, font: ctx.ital, color: COL.ink })
    yy -= lh(size)
  }
  ctx.y = top - boxH - 12
}

// Libellés internes localisés (fiches exercices).
const EX_LBL: Record<string, { muscles: string; technique: string; mistakes: string }> = {
  fr: { muscles: 'Muscles', technique: 'TECHNIQUE', mistakes: 'ERREURS À ÉVITER' },
  en: { muscles: 'Muscles', technique: 'TECHNIQUE', mistakes: 'COMMON MISTAKES' },
  de: { muscles: 'Muskeln', technique: 'TECHNIK', mistakes: 'HÄUFIGE FEHLER' },
}

// Cartes info (Niveau / Durée / Matériel / Objectif…) en grille 2 colonnes.
function drawMeta(ctx: Ctx, items: { label: string; value: string }[]) {
  const gap = 12
  const colW = (CONTENT_W - gap) / 2
  ctx.y -= 4
  for (let i = 0; i < items.length; i += 2) {
    const pair = items.slice(i, i + 2)
    const heights = pair.map((it) => 30 + wrap(it.value, ctx.bold, 11, colW - 24).length * lh(11))
    const h = Math.max(...heights, 46)
    ensure(ctx, h + 8)
    const top = ctx.y
    pair.forEach((it, j) => {
      const x = M.left + j * (colW + gap)
      ctx.page.drawRectangle({ x, y: top - h, width: colW, height: h, color: COL.cardBg, borderColor: COL.lightRule, borderWidth: 1 })
      ctx.page.drawText(safe(it.label).toUpperCase(), { x: x + 12, y: top - 18, size: 7.5, font: ctx.bold, color: COL.grey })
      let vy = top - 34
      for (const ln of wrap(it.value, ctx.bold, 11, colW - 24)) {
        ctx.page.drawText(ln, { x: x + 12, y: vy, size: 11, font: ctx.bold, color: COL.ink })
        vy -= lh(11)
      }
    })
    ctx.y = top - h - gap
  }
  ctx.y -= 2
}

// Tableau bordé (planning semaine / jour).
function drawTable(ctx: Ctx, headers: string[], rows: string[][]) {
  const n = headers.length
  const colW = CONTENT_W / n
  const pad = 6
  const size = 8.5
  ctx.y -= 6
  const drawRow = (cells: string[], header: boolean) => {
    const wrapped = cells.map((c) => wrap(c ?? '', header ? ctx.bold : ctx.reg, size, colW - pad * 2))
    const rowH = Math.max(1, ...wrapped.map((w) => w.length)) * lh(size) + pad * 2 - (lh(size) - size)
    ensure(ctx, rowH)
    const top = ctx.y
    if (header) ctx.page.drawRectangle({ x: M.left, y: top - rowH, width: CONTENT_W, height: rowH, color: COL.orange })
    for (let c = 0; c < n; c++) {
      const x = M.left + c * colW
      ctx.page.drawRectangle({ x, y: top - rowH, width: colW, height: rowH, borderColor: COL.lightRule, borderWidth: 0.7 })
      let cy = top - pad - size
      for (const ln of (wrapped[c] ?? [])) {
        ctx.page.drawText(ln, { x: x + pad, y: cy, size, font: header ? ctx.bold : ctx.reg, color: header ? COL.white : COL.ink })
        cy -= lh(size)
      }
    }
    ctx.y = top - rowH
  }
  drawRow(headers, true)
  for (const r of rows) drawRow(r, false)
  ctx.y -= 8
}

// Fiche exercice : nom + badge difficulté + muscles + technique + erreurs.
function drawExercise(ctx: Ctx, ex: { name: string; muscles: string; level: string; technique: string; mistakes: string }) {
  const padX = 14, padY = 12, size = 9.5
  const innerW = CONTENT_W - padX * 2
  const lbl = EX_LBL[ctx.locale] ?? EX_LBL.fr
  const techLines = wrap(ex.technique, ctx.reg, size, innerW)
  const errLines = wrap(ex.mistakes, ctx.reg, size, innerW)
  const h = padY + 16 + 16 + 14 + techLines.length * lh(size) + 14 + errLines.length * lh(size) + padY
  ctx.y -= 4
  if (ctx.y - h < M.bottom) newPage(ctx)
  const top = ctx.y
  ctx.page.drawRectangle({ x: M.left, y: top - h, width: CONTENT_W, height: h, color: COL.cardBg, borderColor: COL.lightRule, borderWidth: 1 })
  ctx.page.drawRectangle({ x: M.left, y: top - h, width: 3.5, height: h, color: COL.orange })
  let yy = top - padY - 11
  ctx.page.drawText(safe(ex.name), { x: M.left + padX, y: yy, size: 12, font: ctx.bold, color: COL.ink })
  const bl = safe(ex.level)
  const blw = ctx.bold.widthOfTextAtSize(bl, 7.5) + 14
  const lc = levelColor(ex.level)
  ctx.page.drawRectangle({ x: A4.w - M.right - padX - blw, y: yy - 4, width: blw, height: 15, color: lc, opacity: 0.16, borderColor: lc, borderWidth: 0.8 })
  ctx.page.drawText(bl, { x: A4.w - M.right - padX - blw + 7, y: yy, size: 7.5, font: ctx.bold, color: lc })
  yy -= 18
  ctx.page.drawText(safe(`${lbl.muscles} : ${ex.muscles}`), { x: M.left + padX, y: yy, size: 8.5, font: ctx.ital, color: COL.grey })
  yy -= 16
  ctx.page.drawText(lbl.technique, { x: M.left + padX, y: yy, size: 7.5, font: ctx.bold, color: COL.orange })
  yy -= 12
  for (const ln of techLines) { ctx.page.drawText(ln, { x: M.left + padX, y: yy, size, font: ctx.reg, color: COL.ink }); yy -= lh(size) }
  yy -= 3
  ctx.page.drawText(lbl.mistakes, { x: M.left + padX, y: yy, size: 7.5, font: ctx.bold, color: COL.red })
  yy -= 12
  for (const ln of errLines) { ctx.page.drawText(ln, { x: M.left + padX, y: yy, size, font: ctx.reg, color: COL.ink }); yy -= lh(size) }
  ctx.y = top - h - 10
}

// Checklist à cocher (cases vides).
function drawChecklist(ctx: Ctx, items: string[]) {
  const size = 10.5, box = 10, indent = 26
  ctx.y -= 2
  for (const item of items) {
    const lines = wrap(item, ctx.reg, size, CONTENT_W - indent)
    ensure(ctx, lh(size) + 3)
    const top = ctx.y
    ctx.page.drawRectangle({ x: M.left + 2, y: top - size - 1, width: box, height: box, borderColor: COL.grey, borderWidth: 1 })
    ctx.page.drawText(lines[0] ?? '', { x: M.left + indent, y: top - size, size, font: ctx.reg, color: COL.ink })
    ctx.y -= lh(size)
    drawLines(ctx, lines.slice(1), ctx.reg, size, COL.ink, M.left + indent)
    ctx.y -= 4
  }
  ctx.y -= 5
}

// Grille de suivi vide à remplir (poids, mensurations, perfs…).
function drawTracker(ctx: Ctx, columns: string[], rows: number) {
  const n = columns.length
  const colW = CONTENT_W / n
  const pad = 6, size = 8.5, rowH = 22
  ctx.y -= 6
  ensure(ctx, rowH * 2)
  let top = ctx.y
  ctx.page.drawRectangle({ x: M.left, y: top - rowH, width: CONTENT_W, height: rowH, color: COL.orange })
  for (let c = 0; c < n; c++) {
    const x = M.left + c * colW
    ctx.page.drawRectangle({ x, y: top - rowH, width: colW, height: rowH, borderColor: COL.lightRule, borderWidth: 0.7 })
    ctx.page.drawText(safe(columns[c]), { x: x + pad, y: top - pad - size, size, font: ctx.bold, color: COL.white })
  }
  ctx.y = top - rowH
  for (let r = 0; r < rows; r++) {
    ensure(ctx, rowH)
    top = ctx.y
    for (let c = 0; c < n; c++) {
      const x = M.left + c * colW
      ctx.page.drawRectangle({ x, y: top - rowH, width: colW, height: rowH, borderColor: COL.lightRule, borderWidth: 0.7 })
    }
    ctx.y = top - rowH
  }
  ctx.y -= 8
}

function drawCover(ctx: Ctx) {
  const p = ctx.page
  p.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: COL.dark })
  // Logo + marque
  p.drawRectangle({ x: 56, y: A4.h - 96, width: 32, height: 32, color: COL.orange })
  p.drawText('X', { x: 66, y: A4.h - 88, size: 19, font: ctx.bold, color: COL.white })
  p.drawText('XENOTIF®', { x: 98, y: A4.h - 86, size: 15, font: ctx.bold, color: COL.white })
  // Barre d'accent
  p.drawRectangle({ x: 56, y: A4.h - 300, width: 64, height: 5, color: COL.orange })
  // Titre
  const titleSize = 33
  let ty = A4.h - 340
  for (const ln of wrap(ctx.guide.title, ctx.bold, titleSize, A4.w - 112)) {
    p.drawText(ln, { x: 56, y: ty - titleSize, size: titleSize, font: ctx.bold, color: COL.white })
    ty -= titleSize * 1.16
  }
  // Sous-titre
  ty -= 14
  const subSize = 14
  for (const ln of wrap(ctx.guide.subtitle, ctx.reg, subSize, A4.w - 112)) {
    p.drawText(ln, { x: 56, y: ty - subSize, size: subSize, font: ctx.reg, color: COL.subtitle })
    ty -= subSize * 1.45
  }
  // Badges niveau / durée
  const badges = [ctx.guide.level, ctx.guide.duration].filter(Boolean) as string[]
  if (badges.length) {
    ty -= 24
    let bx = 56
    for (const b of badges) {
      const t = safe(b)
      const bw = ctx.bold.widthOfTextAtSize(t, 9) + 22
      p.drawRectangle({ x: bx, y: ty - 20, width: bw, height: 24, color: COL.orange, opacity: 0.16, borderColor: COL.orange, borderWidth: 1 })
      p.drawText(t, { x: bx + 11, y: ty - 13, size: 9, font: ctx.bold, color: COL.orange })
      bx += bw + 8
    }
  }
  // Pied de couverture
  p.drawText(safe(ctx.guide.author), { x: 56, y: 96, size: 10.5, font: ctx.bold, color: COL.orange })
  p.drawText(safe(COVER_NOTICE[ctx.locale] ?? COVER_NOTICE.fr), { x: 56, y: 74, size: 8.5, font: ctx.reg, color: rgb(0.4, 0.42, 0.46) })
}

export async function generateGuidePdf(guide: Guide, locale: string = 'fr'): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(safe(guide.title))
  doc.setAuthor('Xenotif')
  doc.setSubject(safe(guide.subtitle))

  const reg = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const ital = await doc.embedFont(StandardFonts.HelveticaOblique)

  const cover = doc.addPage([A4.w, A4.h])
  const ctx: Ctx = { doc, page: cover, y: 0, reg, bold, ital, guide, pageNo: 1, locale }
  drawCover(ctx)
  newPage(ctx)

  for (const block of guide.blocks) {
    switch (block.type) {
      case 'h1': drawH1(ctx, block.text); break
      case 'h2': drawH2(ctx, block.text); break
      case 'p': drawParagraph(ctx, block.text); break
      case 'list': drawList(ctx, block.items); break
      case 'note': drawNote(ctx, block.text); break
      case 'meta': drawMeta(ctx, block.items); break
      case 'table': drawTable(ctx, block.headers, block.rows); break
      case 'exercise': drawExercise(ctx, block); break
      case 'checklist': drawChecklist(ctx, block.items); break
      case 'tracker': drawTracker(ctx, block.columns, block.rows); break
    }
  }

  return doc.save()
}
