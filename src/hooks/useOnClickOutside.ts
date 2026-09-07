import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Appelle `handler` lorsqu'un clic (ou un `touchstart`) a lieu en dehors
 * de l'élément référencé par `ref`. Utilisé par `UserMenu` et
 * `MobileDrawer` pour se fermer au clic extérieur, en plus de la touche
 * Échap gérée séparément par chaque composant.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  isActive = true,
): void {
  useEffect(() => {
    if (!isActive) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      handler();
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [ref, handler, isActive]);
}
