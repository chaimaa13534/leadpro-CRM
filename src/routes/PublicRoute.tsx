import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes.constants';

/**
 * Protège les routes publiques (Login, Forgot/Reset Password) : un
 * utilisateur déjà connecté est redirigé vers le Dashboard plutôt que de
 * revoir l'écran de connexion.
 */
export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
