import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useLeadDetails } from '@/features/leads/hooks/useLeadDetails';
import { LeadDetailHeader } from '@/features/leads/components/LeadDetailHeader';
import {
  LeadTabs,
  type LeadDetailTab,
} from '@/features/leads/components/LeadTabs';
import { LeadOverview } from '@/features/leads/components/LeadOverview';
import { LeadTimeline } from '@/features/leads/components/LeadTimeline';
import { LeadNotesPanel } from '@/features/leads/components/LeadNotesPanel';
import { LeadActivities } from '@/features/leads/components/LeadActivities';
import { LeadDocuments } from '@/features/leads/components/LeadDocuments';

/**
 * Page de consultation d'un Lead — utilise `MainLayout` (via le routeur,
 * route `/leads/:leadId`). Toutes les données viennent de `leadsMock`
 * via `leadService.getLeadById` (voir `useLeadDetails`) ; aucune API
 * réelle. Aucune modification n'est développée aujourd'hui, brief
 * explicite — "Modifier" reste simulé (voir `LeadQuickActions`).
 */
export function LeadDetailsPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const { lead, status, retry } = useLeadDetails(leadId);
  const [activeTab, setActiveTab] = useState<LeadDetailTab>('overview');

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
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
          Impossible de charger ce lead. Veuillez réessayer.
        </ErrorAlert>
        <Button variant="outline" onClick={retry}>
          Réessayer
        </Button>
      </Card>
    );
  }

  if (status === 'not_found' || !lead) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.leads className="size-6" aria-hidden="true" />}
          title="Lead introuvable"
          description="Ce lead n'existe pas ou a été supprimé."
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <LeadDetailHeader lead={lead} />

      <LeadTabs activeTab={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'overview' ? <LeadOverview lead={lead} /> : null}
          {activeTab === 'timeline' ? <LeadTimeline lead={lead} /> : null}
          {activeTab === 'notes' ? <LeadNotesPanel lead={lead} /> : null}
          {activeTab === 'activities' ? <LeadActivities lead={lead} /> : null}
          {activeTab === 'documents' ? <LeadDocuments lead={lead} /> : null}
          {activeTab === 'history' ? (
            <LeadTimeline lead={lead} compact />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
