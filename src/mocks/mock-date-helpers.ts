/**
 * Générateurs de dates relatives, utilisés uniquement par les fichiers
 * `mocks/*.mock.ts` pour que les données de démonstration paraissent
 * toujours actuelles (aujourd'hui, il y a 2h, dans 3 jours…) plutôt que
 * figées à une date de génération.
 */

export function todayAt(hours: number, minutes = 0): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export function inDaysAt(
  daysFromNow: number,
  hours: number,
  minutes = 0,
): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}
