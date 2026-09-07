import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes.constants';
import { PageFallback } from '@/routes/PageFallback';

/**
 * Garde d'accès réservé aux administrateurs.
 *
 * - Sans session authentifiée → redirige vers `/login`.
 * - Authentifié mais non-admin → redirige vers `/403`.
 * - Authentifié et admin → rend les routes enfants.
 *
 * Complément UI de la sécurité backend : celle-ci reste la source de
 * vérité (les endpoints `/api/users` sont protégés par `requireRole`).
 */
export function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading || !user) {
    return <PageFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
}
