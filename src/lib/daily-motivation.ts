// ──────────────────────────────────────────────────────────────────────
// Motivation quotidienne - contenu court pour les notifications push.
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
    { title: '☀️ Nouveau départ', body: 'Ta semaine commence aujourd\'hui - une courte séance et tu prends de l\'avance !' },
    { title: '💪 Lundi, jour de force', body: 'Les champions ne choisissent pas leurs jours. Ouvre Xenotif et donne tout.' },
    { title: '🔥 Garde le rythme', body: 'Mardi, c\'est là que la régularité se gagne. Ne lâche rien !' },
    { title: '⚡ À mi-chemin', body: 'Mercredi : franchis le cap de la semaine, ton corps suit ton mental.' },
    { title: '🎯 Presque vendredi', body: 'L\'effort d\'aujourd\'hui, c\'est ta transformation de demain. Pousse encore !' },
    { title: '🏆 Termine en beauté', body: 'Vendredi : dernière séance de la semaine, repousse tes limites !' },
    { title: '🌟 Samedi actif', body: 'Bouge dehors ou fais une séance légère - 30 min suffisent pour garder le cap.' },
  ],
  en: [
    { title: '☀️ Fresh start', body: 'Your week begins today - a short session and you\'re already ahead!' },
    { title: '💪 Monday is strength day', body: 'Champions don\'t pick their days. Open Xenotif and give it all.' },
    { title: '🔥 Keep the pace', body: 'Tuesday is where consistency is won. Don\'t let up!' },
    { title: '⚡ Halfway there', body: 'Wednesday: clear the midweek hurdle - your body follows your mind.' },
    { title: '🎯 Almost Friday', body: 'Today\'s effort is tomorrow\'s transformation. Push a little more!' },
    { title: '🏆 Finish strong', body: 'Friday: the week\'s last session - push your limits!' },
    { title: '🌟 Active Saturday', body: 'Move outside or do a light session - 30 min is enough to stay on track.' },
  ],
  de: [
    { title: '☀️ Neustart', body: 'Deine Woche beginnt heute - eine kurze Einheit und du bist voraus!' },
    { title: '💪 Montag ist Krafttag', body: 'Champions wählen ihre Tage nicht. Öffne Xenotif und gib alles.' },
    { title: '🔥 Halt das Tempo', body: 'Dienstag entscheidet über Beständigkeit. Bleib dran!' },
    { title: '⚡ Halbzeit', body: 'Mittwoch: nimm die Wochenmitte - dein Körper folgt deinem Kopf.' },
    { title: '🎯 Fast Freitag', body: 'Der Einsatz von heute ist deine Veränderung von morgen. Gib noch mehr!' },
    { title: '🏆 Stark zu Ende bringen', body: 'Freitag: die letzte Einheit der Woche - überschreite deine Grenzen!' },
    { title: '🌟 Aktiver Samstag', body: 'Beweg dich draußen oder mach eine leichte Einheit - 30 Min reichen.' },
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

// ──────────────────────────────────────────────────────────────────────
// Rappel du soir - 2ᵉ créneau quotidien (push uniquement, pas d'email).
// Ton « avant de finir la journée » : as-tu bougé, garde ta série, note ta
// progression. Une phrase par jour, change chaque jour, en fr / en / de.
// ──────────────────────────────────────────────────────────────────────
const EVENING_PUSH: Record<PushLocale, DailyPushContent[]> = {
  fr: [
    { title: '🌙 Dimanche soir', body: 'Prépare ta semaine : choisis ta séance de demain dans Xenotif.' },
    { title: '🌙 Ta séance du jour ?', body: 'Pas encore bougé ? 15 minutes suffisent pour valider ta journée.' },
    { title: '🌙 Garde ta série', body: 'Ne casse pas la chaîne - une courte séance ce soir et c\'est gagné.' },
    { title: '🌙 Petit effort, grand impact', body: 'Même 10 min ce soir comptent. Ouvre Xenotif et bouge.' },
    { title: '🌙 Avant de te reposer', body: 'Note ta journée et ta progression dans Xenotif.' },
    { title: '🌙 Termine la semaine fort', body: 'Une dernière séance avant le week-end ? Tu ne le regretteras pas.' },
    { title: '🌙 Récup\' du soir', body: 'Étire-toi 10 min et récupère - ton corps te dira merci demain.' },
  ],
  en: [
    { title: '🌙 Sunday evening', body: 'Plan your week: pick tomorrow\'s session in Xenotif.' },
    { title: '🌙 Trained today?', body: 'Not yet? 15 minutes is enough to make the day count.' },
    { title: '🌙 Keep your streak', body: 'Don\'t break the chain - a short session tonight and you\'re set.' },
    { title: '🌙 Small effort, big impact', body: 'Even 10 min tonight counts. Open Xenotif and move.' },
    { title: '🌙 Before you rest', body: 'Log your day and progress in Xenotif.' },
    { title: '🌙 End the week strong', body: 'One last session before the weekend? You won\'t regret it.' },
    { title: '🌙 Evening recovery', body: 'Stretch for 10 min and recover - your body will thank you tomorrow.' },
  ],
  de: [
    { title: '🌙 Sonntagabend', body: 'Plane deine Woche: wähle die Einheit für morgen in Xenotif.' },
    { title: '🌙 Heute trainiert?', body: 'Noch nicht? 15 Minuten reichen, damit der Tag zählt.' },
    { title: '🌙 Halte deine Serie', body: 'Brich die Kette nicht - eine kurze Einheit heute Abend genügt.' },
    { title: '🌙 Kleiner Aufwand, große Wirkung', body: 'Auch 10 Min heute Abend zählen. Öffne Xenotif und beweg dich.' },
    { title: '🌙 Bevor du ruhst', body: 'Halte deinen Tag und Fortschritt in Xenotif fest.' },
    { title: '🌙 Stark ins Wochenende', body: 'Eine letzte Einheit vor dem Wochenende? Du wirst es nicht bereuen.' },
    { title: '🌙 Erholung am Abend', body: 'Dehne dich 10 Min und erhol dich - dein Körper dankt es dir morgen.' },
  ],
}

/**
 * Renvoie le titre + le corps du rappel du soir, dans la langue demandée
 * (fr par défaut). `date` est injectable pour les tests.
 */
export function getEveningPushContent(
  rawLocale: string | null | undefined,
  date: Date = new Date(),
): DailyPushContent {
  const locale: PushLocale = rawLocale === 'en' ? 'en' : rawLocale === 'de' ? 'de' : 'fr'
  return EVENING_PUSH[locale][date.getDay()]
}
