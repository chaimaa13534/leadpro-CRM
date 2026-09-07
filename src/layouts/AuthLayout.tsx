import { Outlet } from 'react-router-dom';

/**
 * Layout des pages d'authentification (connexion, mot de passe oublié,
 * réinitialisation). Volontairement séparé de `MainLayout` puisqu'il
 * n'affiche ni Sidebar ni Topbar.
 *
 * Fond légèrement teinté (`bg-muted`) plutôt qu'un simple blanc : la
 * `AuthCard` (Jour 6) se détache mieux avec son ombre, effet "produit
 * SaaS premium" demandé par le brief sans surcharger le design.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Outlet />
    </div>
  );
}
