import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Icons } from '@/components/ui/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { deleteContact } from '@/services/contact.service';
import { ROUTES, buildEditContactPath } from '@/lib/constants/routes.constants';
import type { Contact } from '@/types/contact.types';

export interface ContactQuickActionsProps {
  contact: Contact;
}

export function ContactQuickActions({ contact }: ContactQuickActionsProps) {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotifications();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteContact(contact.id);
      success(`${contact.firstName} ${contact.lastName} a été supprimé.`);
      navigate(ROUTES.CONTACTS);
    } catch {
      notifyError('La suppression a échoué. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.CONTACTS)}
          leadingIcon={<Icons.chevronLeft className="size-4" />}
        >
          Retour à la liste
        </Button>
        <Button
          variant="outline"
          leadingIcon={<Icons.edit className="size-4" />}
          onClick={() => navigate(buildEditContactPath(contact.id))}
        >
          Modifier
        </Button>
        <Button
          variant="danger"
          leadingIcon={<Icons.delete className="size-4" />}
          onClick={() => setIsConfirmOpen(true)}
        >
          Supprimer
        </Button>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Supprimer ce contact ?"
      >
        <p className="text-body text-text-secondary">
          Cette action supprimera définitivement "{contact.firstName}{' '}
          {contact.lastName}" de la liste. Cette action est simulée et n'affecte
          aucune base de données réelle.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            isLoading={isDeleting}
            onClick={handleConfirmDelete}
          >
            Supprimer
          </Button>
        </div>
      </Modal>
    </>
  );
}

