import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes.constants';
import { PageFallback } from '@/routes/PageFallback';

/**
 * Protège les routes privées (Dashboard, Leads…) : redirige vers
 * `/login` si aucune session active n'existe. Utilisé comme route
 * "layout" enveloppant `MainLayout` dans `router.tsx`.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
