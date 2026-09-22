/**
 * Détection explicite des erreurs d'écriture Supabase.
 *
 * POURQUOI CE HELPER EXISTE (K8.12) : postgrest-js ne lève pas sur erreur SQL.
 * `shouldThrowOnError` vaut `false` par défaut et la levée y est conditionnée
 * (`if (error && this.shouldThrowOnError) throw …`). Un `await supabase…update()`
 * dont le retour n'est pas inspecté se comporte donc comme un succès, même quand
 * l'écriture a échoué — exactement le même piège que le `{ data, error }` de
 * Resend traité en K8.11.
 *
 * Ce contrôle existait déjà, mais enfermé dans `webhook/stripe/route.ts`, où il
 * couvre 8 écritures depuis sa mise en place. Il est extrait ici SANS AUCUNE
 * MODIFICATION DE COMPORTEMENT — même signature, même message, même séparateur —
 * afin que le webhook reste strictement identique et que les crons puissent s'en
 * servir à leur tour.
 *
 * Volontairement PAS de `throwOnError()` global : cela changerait le contrat de
 * TOUTES les requêtes du projet, y compris les lectures qui traitent déjà leur
 * `error` explicitement.
 */
export function assertNoError(label: string, error: { message: string } | null): void {
  if (error) throw new Error(`${label} : ${error.message}`)
}
