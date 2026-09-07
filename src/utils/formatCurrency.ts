const DEFAULT_LOCALE = 'fr-FR';
const DEFAULT_CURRENCY = 'MAD';

/**
 * Formate un montant numérique en devise, ex: `formatCurrency(42500)`
 * → "42 500,00 MAD".
 *
 * @param amount        Montant brut (unité principale, pas de centimes).
 * @param currency      Code devise ISO 4217 (par défaut `MAD`).
 * @param locale        Locale BCP 47 (par défaut `fr-FR`).
 * @param maximumFractionDigits Nombre de décimales affichées (0 par défaut
 *                              pour des montants ronds, mettre 2 sinon).
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(amount);
}
