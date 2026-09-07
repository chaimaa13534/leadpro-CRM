import { Link } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { ROUTES } from '@/lib/constants/routes.constants';

/**
 * Bouton de notifications de la Topbar. Le badge est une valeur simulée
 * (pas de service de notifications aujourd'hui) — il redirige vers la
 * page Notifications déjà routée au Jour 2, encore vide.
 */
const SIMULATED_UNREAD_COUNT = 3;

export function NotificationButton() {
  return (
    <Link
      to={ROUTES.NOTIFICATIONS}
      aria-label={`Notifications (${SIMULATED_UNREAD_COUNT} non lues)`}
      className="relative flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 ease-standard hover:bg-muted hover:text-text-primary"
    >
      <Icons.notifications className="size-[18px]" aria-hidden="true" />
      {SIMULATED_UNREAD_COUNT > 0 ? (
        <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger-600 text-[10px] font-semibold text-white">
          {SIMULATED_UNREAD_COUNT}
        </span>
      ) : null}
    </Link>
  );
}
