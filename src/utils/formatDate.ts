const DEFAULT_LOCALE = 'fr-FR';

export type DateFormatStyle = 'short' | 'medium' | 'long' | 'datetime';

/**
 * Formate une date (ISO string, timestamp ou `Date`) pour l'affichage.
 *
 * @param date   Valeur à formater.
 * @param style  `'short'` → 16/07/2026, `'medium'` → 16 juil. 2026,
 *               `'long'` → 16 juillet 2026, `'datetime'` → 16/07/2026 14:30.
 * @param locale Locale BCP 47 (par défaut `fr-FR`).
 */
export function formatDate(
  date: string | number | Date,
  style: DateFormatStyle = 'medium',
  locale: string = DEFAULT_LOCALE,
): string {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const optionsByStyle: Record<DateFormatStyle, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    datetime: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };

  return new Intl.DateTimeFormat(locale, optionsByStyle[style]).format(
    parsedDate,
  );
}
