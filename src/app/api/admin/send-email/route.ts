import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const service = await createServiceClient()
  const { data: isAdmin } = await service.from('admin_users').select('id').eq('id', user.id).single()
  if (!isAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { subject, message, target } = await req.json() as {
    subject: string; message: string; target: 'all' | 'active' | 'trialing'
  }

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Sujet et message requis.' }, { status: 400 })
  }

  let query = service.from('subscriptions').select('user_id')
  if (target === 'active') query = query.eq('status', 'active')
  else if (target === 'trialing') query = query.eq('status', 'trialing')

  const { data: subs } = await query
  if (!subs?.length) return NextResponse.json({ sent: 0 })

  const userIds = subs.map(s => s.user_id)
  const { data: allUsers } = await service.auth.admin.listUsers()
  const emails = allUsers?.users
    ?.filter(u => userIds.includes(u.id))
    .map(u => u.email)
    .filter(Boolean) as string[]

  if (!emails.length) return NextResponse.json({ sent: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY!)
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="background:#0A0B0F;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:#F97316;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;">X</div>
      <span style="font-weight:900;font-size:16px;letter-spacing:2px;color:#fff;">XENOTIF®</span>
    </div>
    <div style="background:#111218;border:1px solid #1F2937;border-radius:16px;padding:24px;">
      ${message.split('\n').map(line => `<p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 12px;">${line}</p>`).join('')}
    </div>
    <p style="color:#374151;font-size:11px;margin-top:32px;">Xenotif® · contact@xenotif.com</p>
  </div>
</body></html>`

  let sent = 0
  for (const email of emails) {
    try {
      await resend.emails.send({ from: 'Xenotif® <noreply@xenotif.com>', to: email, subject, html })
      sent++
    } catch {
      // continue
    }
  }

  return NextResponse.json({ sent })
}
