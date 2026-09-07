import { Link } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { ROUTES } from '@/lib/constants/routes.constants';

/**
 * En-tête de la page "Nouveau Lead" : lien de retour vers la liste,
 * titre, sous-titre. Distinct de `LeadsHeader` (Jour 8, en-tête de la
 * liste avec KPI et actions) — ici, une simple en-tête de formulaire.
 */
export function LeadHeader() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        to={ROUTES.LEADS}
        className="flex w-fit items-center gap-1.5 text-caption text-text-secondary transition-colors duration-150 hover:text-text-primary"
      >
        <Icons.chevronLeft className="size-3.5" aria-hidden="true" />
        Retour aux leads
      </Link>
      <div>
        <h1 className="text-h3 text-text-primary">Nouveau Lead</h1>
        <p className="text-body text-text-secondary">
          Renseignez les informations ci-dessous pour créer un nouveau lead.
        </p>
      </div>
    </div>
  );
}
