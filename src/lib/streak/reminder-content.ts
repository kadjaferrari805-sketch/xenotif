type Locale = 'fr' | 'en' | 'de'

function loc(raw: string | null | undefined): Locale {
  return raw === 'en' ? 'en' : raw === 'de' ? 'de' : 'fr'
}

// remaining = séances restantes pour valider la semaine ; streak = série courante.
export function getStreakReminderContent(
  rawLocale: string | null | undefined,
  remaining: number,
  streak: number,
): { title: string; body: string } {
  const l = loc(rawLocale)
  const s = remaining > 1
  const map = {
    fr: {
      title: '🔥 Sauve ta série',
      body: `Plus que ${remaining} séance${s ? 's' : ''} pour valider ta semaine et garder ta série de ${streak}.`,
    },
    en: {
      title: '🔥 Save your streak',
      body: `Just ${remaining} more session${s ? 's' : ''} to complete your week and keep your ${streak}-week streak.`,
    },
    de: {
      title: '🔥 Rette deine Serie',
      body: `Nur noch ${remaining} Einheit${s ? 'en' : ''}, um deine Woche zu schaffen und deine ${streak}-Wochen-Serie zu halten.`,
    },
  }
  return map[l]
}
