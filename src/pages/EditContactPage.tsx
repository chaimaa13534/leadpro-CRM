import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { useContactDetails } from '@/features/contacts/hooks/useContactDetails';
import { ContactForm } from '@/features/contacts/components/ContactForm';
import { ContactTimeline } from '@/features/contacts/components/ContactTimeline';

/**
 * Page d'édition d'un Contact — réutilise `ContactForm` en mode édition.
 * Charge le contact existant, affiche un formulaire pré-rempli,
 * détecte les modifications, et affiche l'historique des modifications.
 */
export function EditContactPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const { contact, status, retry } = useContactDetails(contactId);

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
      <div className="flex flex-col gap-2">
        <h1 className="text-h3 text-text-primary">Modifier le contact</h1>
        <p className="text-body text-text-secondary">
          {contact.firstName} {contact.lastName} — {contact.company ?? 'Entreprise non renseignée'}
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <ContactForm contact={contact} />

        <ContactTimeline compact />
      </div>
    </div>
  );
}

