import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useCompanyDetails } from '@/features/companies/hooks/useCompanyDetails';
import { CompanyDetailHeader } from '@/features/companies/components/CompanyDetailHeader';
import {
  CompanyTabs,
  type CompanyDetailTab,
} from '@/features/companies/components/CompanyTabs';
import { CompanyOverview } from '@/features/companies/components/CompanyOverview';
import { CompanyContacts } from '@/features/companies/components/CompanyContacts';
import { CompanyLeads } from '@/features/companies/components/CompanyLeads';
import { CompanyOpportunities } from '@/features/companies/components/CompanyOpportunities';
import { CompanyTimeline } from '@/features/companies/components/CompanyTimeline';
import { CompanyDocuments } from '@/features/companies/components/CompanyDocuments';
import { CompanyNotes } from '@/features/companies/components/CompanyNotes';

/**
 * Page de consultation d'une Entreprise — utilise `MainLayout` (via le routeur,
 * route `/companies/:companyId`). Toutes les données viennent de
 * `companiesMock` via `companyService.getCompanyById`.
 */
export function CompanyDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, status, retry } = useCompanyDetails(companyId);
  const [activeTab, setActiveTab] = useState<CompanyDetailTab>('overview');

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
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
      <CompanyDetailHeader company={company} />

      <CompanyTabs activeTab={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'overview' ? <CompanyOverview company={company} /> : null}
          {activeTab === 'contacts' ? (
            <CompanyContacts linkedContactIds={company.linkedContactIds} />
          ) : null}
          {activeTab === 'leads' ? (
            <CompanyLeads linkedLeadIds={company.linkedLeadIds} />
          ) : null}
          {activeTab === 'opportunities' ? (
            <CompanyOpportunities linkedOpportunityIds={company.linkedOpportunityIds} />
          ) : null}
          {activeTab === 'timeline' ? <CompanyTimeline /> : null}
          {activeTab === 'documents' ? <CompanyDocuments /> : null}
          {activeTab === 'notes' ? <CompanyNotes notes={company.notes} /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

