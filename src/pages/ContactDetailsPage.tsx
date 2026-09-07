import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useContactDetails } from '@/features/contacts/hooks/useContactDetails';
import { ContactDetailHeader } from '@/features/contacts/components/ContactDetailHeader';
import {
  ContactTabs,
  type ContactDetailTab,
} from '@/features/contacts/components/ContactTabs';
import { ContactOverview } from '@/features/contacts/components/ContactOverview';
import { ContactTimeline } from '@/features/contacts/components/ContactTimeline';
import { ContactNotes } from '@/features/contacts/components/ContactNotes';
import { ContactActivity } from '@/features/contacts/components/ContactActivity';
import { ContactDocuments } from '@/features/contacts/components/ContactDocuments';

/**
 * Page de consultation d'un Contact — utilise `MainLayout` (via le routeur,
 * route `/contacts/:contactId`). Toutes les données viennent de
 * `contactsMock` via `contactService.getContactById`.
 */
export function ContactDetailsPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const { contact, status, retry } = useContactDetails(contactId);
  const [activeTab, setActiveTab] = useState<ContactDetailTab>('overview');

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
          Impossible de charger ce contact. Veuillez réessayer.
        </ErrorAlert>
        <Button variant="outline" onClick={retry}>
          Réessayer
        </Button>
      </Card>
    );
  }

  if (status === 'not_found' || !contact) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.contacts className="size-6" aria-hidden="true" />}
          title="Contact introuvable"
          description="Ce contact n'existe pas ou a été supprimé."
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ContactDetailHeader contact={contact} />

      <ContactTabs activeTab={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'overview' ? <ContactOverview contact={contact} /> : null}
          {activeTab === 'timeline' ? <ContactTimeline /> : null}
          {activeTab === 'notes' ? <ContactNotes notes={contact.notes} /> : null}
          {activeTab === 'activities' ? <ContactActivity /> : null}
          {activeTab === 'documents' ? <ContactDocuments /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

