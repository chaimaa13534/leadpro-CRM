/**
 * Simule la latence d'un appel réseau, en attendant qu'une vraie API soit
 * branchée. Toute la couche `services/` s'appuie sur ce helper afin que le
 * remplacement futur par de vrais appels HTTP ne change pas la signature
 * (toujours une `Promise`) ni le comportement asynchrone perçu par les
 * appelants (hooks, composants).
 */
export function simulateRequest<T>(data: T, delayMs = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

/** Variante qui simule un échec réseau, utile pour tester les états d'erreur. */
export function simulateRequestFailure(
  message = 'Une erreur réseau est survenue.',
  delayMs = 400,
): Promise<never> {
  return new Promise((_resolve, reject) => {
    setTimeout(() => reject(new Error(message)), delayMs);
  });
}
