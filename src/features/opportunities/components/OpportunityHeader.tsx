import { Link } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { ROUTES } from '@/lib/constants/routes.constants';

export function OpportunityHeader() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        to={ROUTES.OPPORTUNITIES}
        className="flex w-fit items-center gap-1.5 text-caption text-text-secondary transition-colors duration-150 hover:text-text-primary"
      >
        <Icons.chevronLeft className="size-3.5" aria-hidden="true" />
        Retour aux opportunités
      </Link>
      <div>
        <h1 className="text-h3 text-text-primary">Nouvelle Opportunité</h1>
        <p className="text-body text-text-secondary">
          Renseignez les informations ci-dessous pour créer une nouvelle opportunité.
        </p>
      </div>
    </div>
  );
}

