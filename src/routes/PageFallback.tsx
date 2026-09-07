import { PageLoader } from '@/components/ui/PageLoader';

/**
 * Repli affiché pendant le chargement d'une page en lazy loading.
 * Fine enveloppe autour de `PageLoader` (Jour 7) — gardée comme fichier
 * séparé pour que `router.tsx` n'ait pas à connaître les détails de la
 * primitive utilisée.
 */
export function PageFallback() {
  return <PageLoader minHeight="50vh" />;
}
