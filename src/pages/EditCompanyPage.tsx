import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useCompanyDetails } from '@/features/companies/hooks/useCompanyDetails';
import { CompanyForm } from '@/features/companies/components/CompanyForm';
import { CompanyTimeline } from '@/features/companies/components/CompanyTimeline';

/**
 * Page d'édition d'une Entreprise — réutilise `CompanyForm` en mode édition.
 * Charge l'entreprise existante, affiche un formulaire pré-rempli,
 * détecte les modifications, et affiche l'historique des modifications.
 */
export function EditCompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, status, retry } = useCompanyDetails(companyId);

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <ErrorAlert>
          Impossible de charger cette entreprise. Veuillez réessayer.
        </ErrorAlert>
        <Button variant="outline" onClick={retry}>
          Réessayer
        </Button>
      </Card>
    );
  }

  if (status === 'not_found' || !company) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.companies className="size-6" aria-hidden="true" />}
          title="Entreprise introuvable"
          description="Cette entreprise n'existe pas ou a été supprimée."
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 text-text-primary">Modifier l'entreprise</h1>
        <p className="text-body text-text-secondary">
          {company.name} — {company.industry ?? 'Secteur non renseigné'}
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <CompanyForm company={company} />

        <CompanyTimeline compact />
      </div>
    </div>
  );
}

