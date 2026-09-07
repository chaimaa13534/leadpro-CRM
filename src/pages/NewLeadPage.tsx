import { LeadHeader } from '@/features/leads/forms/LeadHeader';
import { LeadForm } from '@/features/leads/forms/LeadForm';

/**
 * Page "Nouveau Lead" — utilise `MainLayout` (via le routeur).
 * Accessible depuis le Dashboard, le module Leads, et son propre lien
 * "Retour aux leads" (voir `LeadHeader`).
 */
export function NewLeadPage() {
  return (
    <div className="flex flex-col gap-6">
      <LeadHeader />
      <div className="mx-auto w-full max-w-3xl">
        <LeadForm />
      </div>
    </div>
  );
}
