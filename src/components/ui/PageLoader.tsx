import { Spinner } from '@/components/ui/Spinner';

export interface PageLoaderProps {
  /** Hauteur minimale du conteneur ; `'screen'` pour une page complète. */
  minHeight?: string;
}

/**
 * Repli de chargement générique pleine largeur, centré verticalement.
 * Utilisé par `routes/PageFallback` (Suspense au niveau des routes) et
 * réutilisable partout ailleurs qu'un chargement de section est
 * nécessaire.
 */
export function PageLoader({ minHeight = '50vh' }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight }}>
      <Spinner size="lg" />
    </div>
  );
}
