import { useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

/**
 * Logique commune à tout menu déroulant contrôlé par un clic (ouverture/
 * fermeture, clic extérieur, touche Échap) — utilisée par `UserMenu` et
 * `LeadActions`. Ne gère aucun rendu : chaque appelant reste libre de
 * son propre balisage/animation.
 */
export function useDropdown<T extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<T>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return { isOpen, setIsOpen, containerRef };
}
