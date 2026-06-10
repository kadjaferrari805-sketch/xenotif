// ──────────────────────────────────────────────────────────────────────
// Motivation quotidienne — contenu court pour les notifications push.
// Une phrase punchy par jour de la semaine, qui change donc chaque jour
// (à l'image de l'email quotidien et des cartes in-app), en fr / en / de.
//
// Index 0 = dimanche … 6 = samedi (aligné sur Date.prototype.getDay()).
// Le push est volontairement plus court que l'email : un titre + une ligne.
// ──────────────────────────────────────────────────────────────────────

type PushLocale = 'fr' | 'en' | 'de'

export type DailyPushContent = { title: string; body: string }

const DAILY_PUSH: Record<PushLocale, DailyPushContent[]> = {
  fr: [
    { title: '☀️ Nouveau départ', body: 'Ta semaine commence aujourd\'hui — une courte séance et tu prends de l\'avance !' },
    { title: '💪 Lundi, jour de force', body: 'Les champions ne choisissent pas leurs jours. Ouvre Xenotif et donne tout.' },
    { title: '🔥 Garde le rythme', body: 'Mardi, c\'est là que la régularité se gagne. Ne lâche rien !' },
    { title: '⚡ À mi-chemin', body: 'Mercredi : franchis le cap de la semaine, ton corps suit ton mental.' },
    { title: '🎯 Presque vendredi', body: 'L\'effort d\'aujourd\'hui, c\'est ta transformation de demain. Pousse encore !' },
    { title: '🏆 Termine en beauté', body: 'Vendredi : dernière séance de la semaine, repousse tes limites !' },
    { title: '🌟 Samedi actif', body: 'Bouge dehors ou fais une séance légère — 30 min suffisent pour garder le cap.' },
  ],
  en: [
    { title: '☀️ Fresh start', body: 'Your week begins today — a short session and you\'re already ahead!' },
    { title: '💪 Monday is strength day', body: 'Champions don\'t pick their days. Open Xenotif and give it all.' },
    { title: '🔥 Keep the pace', body: 'Tuesday is where consistency is won. Don\'t let up!' },
    { title: '⚡ Halfway there', body: 'Wednesday: clear the midweek hurdle — your body follows your mind.' },
    { title: '🎯 Almost Friday', body: 'Today\'s effort is tomorrow\'s transformation. Push a little more!' },
    { title: '🏆 Finish strong', body: 'Friday: the week\'s last session — push your limits!' },
    { title: '🌟 Active Saturday', body: 'Move outside or do a light session — 30 min is enough to stay on track.' },
  ],
  de: [
    { title: '☀️ Neustart', body: 'Deine Woche beginnt heute — eine kurze Einheit und du bist voraus!' },
    { title: '💪 Montag ist Krafttag', body: 'Champions wählen ihre Tage nicht. Öffne Xenotif und gib alles.' },
    { title: '🔥 Halt das Tempo', body: 'Dienstag entscheidet über Beständigkeit. Bleib dran!' },
    { title: '⚡ Halbzeit', body: 'Mittwoch: nimm die Wochenmitte — dein Körper folgt deinem Kopf.' },
    { title: '🎯 Fast Freitag', body: 'Der Einsatz von heute ist deine Veränderung von morgen. Gib noch mehr!' },
    { title: '🏆 Stark zu Ende bringen', body: 'Freitag: die letzte Einheit der Woche — überschreite deine Grenzen!' },
    { title: '🌟 Aktiver Samstag', body: 'Beweg dich draußen oder mach eine leichte Einheit — 30 Min reichen.' },
  ],
}

/**
 * Renvoie le titre + le corps du push de motivation du jour, dans la langue
 * demandée (fr par défaut). `date` est injectable pour les tests.
 */
export function getDailyPushContent(
  rawLocale: string | null | undefined,
  date: Date = new Date(),
): DailyPushContent {
  const locale: PushLocale = rawLocale === 'en' ? 'en' : rawLocale === 'de' ? 'de' : 'fr'
  return DAILY_PUSH[locale][date.getDay()]
}
