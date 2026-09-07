/**
 * Hash simple et déterministe d'une chaîne vers un entier positif.
 * Utilisé par les mocks de la fiche Lead (`timeline.mock.ts`,
 * `activities.mock.ts`…) pour faire varier les données générées selon
 * `leadId`, sans avoir à stocker un jeu de données par lead.
 */
export function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}
