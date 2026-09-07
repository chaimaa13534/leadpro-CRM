import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { ROUTES } from '@/lib/constants/routes.constants';
import { Icons } from '@/components/ui/icons';
import { getInitials } from '@/utils/getInitials';

/**
 * Menu utilisateur de la Topbar, connecté à la session réelle (voir
 * `useAuth`, Jour 6). "Mon Profil" et "Mon Compte" restent des actions
 * inertes : aucune page profil/compte n'existe encore. Seuls
 * "Paramètres" (navigation) et "Déconnexion" (appel à `logout()`) sont
 * pleinement fonctionnels.
 */
export function UserMenu() {
  const { isOpen, setIsOpen, containerRef } = useDropdown<HTMLDivElement>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { info } = useNotifications();

  if (!user) {
    return null;
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      info('Vous avez été déconnecté.');
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menu utilisateur"
        className="flex size-9 items-center justify-center rounded-full bg-accent-subtle text-label font-semibold text-accent transition-colors duration-150 ease-standard hover:bg-accent-muted"
      >
        {getInitials(`${user.firstName} ${user.lastName}`)}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="menu"
            aria-label="Menu utilisateur"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
            className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-border bg-surface p-1 shadow-lg"
            style={{ zIndex: 'var(--z-popover)' }}
          >
            <div className="border-b border-border px-3 py-2">
              <p className="text-body font-medium text-text-primary">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-caption text-text-secondary">{user.email}</p>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body text-text-primary transition-colors duration-150 hover:bg-muted"
            >
              <Icons.user
                className="size-4 text-text-secondary"
                aria-hidden="true"
              />
              Mon Profil
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body text-text-primary transition-colors duration-150 hover:bg-muted"
            >
              <Icons.account
                className="size-4 text-text-secondary"
                aria-hidden="true"
              />
              Mon Compte
            </button>

            <Link
              to={ROUTES.SETTINGS}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-body text-text-primary transition-colors duration-150 hover:bg-muted"
            >
              <Icons.settings
                className="size-4 text-text-secondary"
                aria-hidden="true"
              />
              Paramètres
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body text-danger-600 transition-colors duration-150 hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Icons.spinner
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Icons.logout className="size-4" aria-hidden="true" />
              )}
              Déconnexion
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
