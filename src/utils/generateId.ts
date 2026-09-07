/**
 * Génère un identifiant unique côté client.
 * Utilise `crypto.randomUUID()` quand disponible (tous les navigateurs
 * modernes et Node ≥ 19), avec un repli simple sinon.
 */
export function generateId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
