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
}

// Caractères supportés par l'encodage WinAnsi au-delà du Latin-1
const HIGH_OK = new Set([0x20ac, 0x2026, 0x2014, 0x2013, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2039, 0x203a, 0x0152, 0x0153, 0x2122])
function safe(t: string): string {
  let out = ''
  for (const ch of t) {
    const c = ch.codePointAt(0) ?? 0
    if (c <= 0xff || HIGH_OK.has(c)) out += ch
    else if (c === 0x2212) out += '-'
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
  // Pied de couverture
  p.drawText(safe(ctx.guide.author), { x: 56, y: 96, size: 10.5, font: ctx.bold, color: COL.orange })
  p.drawText('Guide officiel — © Xenotif® — Réservé à ton usage personnel.', { x: 56, y: 74, size: 8.5, font: ctx.reg, color: rgb(0.4, 0.42, 0.46) })
}

export async function generateGuidePdf(guide: Guide): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(safe(guide.title))
  doc.setAuthor('Xenotif')
  doc.setSubject(safe(guide.subtitle))

  const reg = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const ital = await doc.embedFont(StandardFonts.HelveticaOblique)

  const cover = doc.addPage([A4.w, A4.h])
  const ctx: Ctx = { doc, page: cover, y: 0, reg, bold, ital, guide, pageNo: 1 }
  drawCover(ctx)
  newPage(ctx)

  for (const block of guide.blocks) {
    switch (block.type) {
      case 'h1': drawH1(ctx, block.text); break
      case 'h2': drawH2(ctx, block.text); break
      case 'p': drawParagraph(ctx, block.text); break
      case 'list': drawList(ctx, block.items); break
      case 'note': drawNote(ctx, block.text); break
    }
  }

  return doc.save()
}
