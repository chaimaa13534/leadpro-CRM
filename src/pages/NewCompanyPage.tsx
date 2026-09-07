import { CompanyHeader } from '@/features/companies/components/CompanyHeader';
import { CompanyForm } from '@/features/companies/components/CompanyForm';

/**
 * Page "Nouvelle Entreprise" — utilise `MainLayout` (via le routeur).
 * Accessible depuis le module Companies.
 */
export function NewCompanyPage() {
  return (
    <div className="flex flex-col gap-6">
      <CompanyHeader />
      <div className="mx-auto w-full max-w-3xl">
        <CompanyForm />
      </div>
    </div>
  );
}

