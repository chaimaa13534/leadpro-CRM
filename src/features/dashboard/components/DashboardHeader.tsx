import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { ROUTES } from '@/lib/constants/routes.constants';

const CURRENT_USER_FIRST_NAME = 'Alex';

/**
 * En-tête du Dashboard : salutation, date du jour, et deux actions
 * rapides. "Exporter" reste purement visuel (pas de service d'export) ;
 * "Créer un Lead" navigue réellement vers `NewLeadPage` depuis le
 * Jour 9.
 */
export function DashboardHeader() {
  const navigate = useNavigate();
  const today = formatDate(new Date(), 'long');
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
      <div>
        <h1 className="text-h3 text-text-primary">
          Bonjour
        </h1>
        <p className="text-body text-text-secondary">{capitalizedToday}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          leadingIcon={<Icons.export className="size-4" />}
        >
          Exporter
        </Button>
        <Button
          leadingIcon={<Icons.add className="size-4" />}
          onClick={() => navigate(ROUTES.NEW_LEAD)}
        >
          Créer un Lead
        </Button>
      </div>
    </div>
  );
}
