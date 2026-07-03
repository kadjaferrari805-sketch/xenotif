import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { getDevicePushRecipients } from '@/lib/push-recipients'
import { getEveningPushContent } from '@/lib/daily-motivation'
import { getStreak } from '@/lib/streak/service'
import { getStreakReminderContent } from '@/lib/streak/reminder-content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 2ᵉ créneau quotidien : rappel du soir, PUSH uniquement (pas de 2ᵉ email),
// envoyé à TOUS les appareils enregistrés (natif Expo + Web Push PWA), quel que
// soit l'abonnement. Contenu localisé qui change chaque jour.
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const recipients = await getDevicePushRecipients(supabase)

  if (recipients.length === 0) {
    return NextResponse.json({ pushed: 0, devices: 0 })
  }

  let pushed = 0
  const errors: string[] = []

  for (const { userId, locale } of recipients) {
    // Rappel de série si la semaine (UTC) se termine bientôt et reste atteignable.
    let content: { title: string; body: string } = getEveningPushContent(locale)
    let data: Record<string, string> = { type: 'evening_reminder' }
    let url = '/dashboard/notifications'
    let tag = 'evening_reminder'
    try {
      const streak = await getStreak(supabase, userId)
      const dow = new Date().getUTCDay() // 0 = dimanche, 6 = samedi
      const daysLeft = dow === 0 ? 1 : dow === 6 ? 2 : 0 // seulement sam/dim
      const remaining = streak.weeklyGoal - streak.activeDaysThisWeek
      if (daysLeft > 0 && remaining > 0 && remaining <= daysLeft) {
        content = getStreakReminderContent(locale, remaining, streak.currentStreak)
        data = { type: 'streak_reminder' }
        url = '/dashboard/progression'
        tag = 'streak_reminder'
      }
    } catch (e) {
      errors.push(`streak ${userId}: ${e}`)
    }

    const { title, body } = content
    try {
      pushed += await sendPushToUser(userId, { title, body, data })
    } catch (e) {
      errors.push(`push ${userId}: ${e}`)
    }
    try {
      pushed += await sendWebPushToUser(userId, { title, body, url, tag })
    } catch (e) {
      errors.push(`webpush ${userId}: ${e}`)
    }
  }

  console.log(`[evening-reminder] push=${pushed} devices=${recipients.length} errors=${errors.length}`)
  return NextResponse.json({ pushed, devices: recipients.length, errors })
}
