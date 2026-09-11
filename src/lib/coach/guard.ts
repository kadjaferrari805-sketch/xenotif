// Garde-fous du coach IA : chaque message déclenche un appel payant au modèle,
// et l'essai Pro s'ouvre sans carte à tout nouveau compte. Pure et testable.

export type CoachLocale = 'fr' | 'en' | 'de'
export type CoachMessage = { role: 'user' | 'assistant'; content: string }

// Messages envoyés au coach par membre et par jour (UTC). Les admins en sont exemptés.
export const COACH_DAILY_LIMIT = 30

export const MAX_HISTORY = 20
export const MAX_USER_CHARS = 4000
export const MAX_ASSISTANT_CHARS = 12000
export const MAX_TOTAL_CHARS = 60000

export type SanitizeResult =
  | { ok: true; messages: CoachMessage[] }
  | { ok: false; error: 'messages_required' | 'invalid_message' | 'message_too_long' | 'last_message_must_be_user' }

const totalChars = (messages: CoachMessage[]) => messages.reduce((sum, m) => sum + m.content.length, 0)

// Valide l'historique fourni par le client, puis le borne : seuls les échanges les
// plus récents sont transmis, en commençant toujours par un message utilisateur.
export function sanitizeCoachMessages(input: unknown): SanitizeResult {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: 'messages_required' }

  const messages: CoachMessage[] = []
  for (const item of input) {
    if (!item || typeof item !== 'object') return { ok: false, error: 'invalid_message' }
    const { role, content } = item as Record<string, unknown>
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return { ok: false, error: 'invalid_message' }
    }
    if (content.length > (role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS)) {
      return { ok: false, error: 'message_too_long' }
    }
    if (!content.trim()) continue
    messages.push({ role, content })
  }

  if (messages.at(-1)?.role !== 'user') return { ok: false, error: 'last_message_must_be_user' }

  let kept = messages.slice(-MAX_HISTORY)
  while (kept.length > 1 && (kept[0].role !== 'user' || totalChars(kept) > MAX_TOTAL_CHARS)) {
    kept = kept.slice(1)
  }
  return { ok: true, messages: kept }
}

export function asCoachLocale(value: unknown): CoachLocale | null {
  return value === 'fr' || value === 'en' || value === 'de' ? value : null
}
