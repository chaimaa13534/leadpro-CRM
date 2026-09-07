import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne des classes conditionnelles (`clsx`) en résolvant les conflits
 * d'utilitaires Tailwind (`twMerge`) — par exemple `cn('px-2', 'px-4')`
 * renvoie `'px-4'` plutôt que les deux classes concaténées.
 *
 * Utilisé par tous les composants de `components/ui/` pour accepter une
 * prop `className` qui surcharge proprement les styles par défaut.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
