/**
 * Retarde l'exécution de `fn` jusqu'à ce que `delayMs` millisecondes se
 * soient écoulées sans nouvel appel. Utile pour les champs de recherche,
 * les validations de formulaire déclenchées à la frappe, etc.
 *
 * La fonction retournée conserve le typage des paramètres de `fn`.
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs = 300,
): (...args: TArgs) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
