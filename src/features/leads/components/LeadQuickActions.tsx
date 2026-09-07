import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Icons } from '@/components/ui/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { deleteLead } from '@/services/lead.service';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { Lead } from '@/types/lead.types';

export interface LeadQuickActionsProps {
  lead: Lead;
}

/**
 * Actions rapides de la fiche Lead : "Modifier" reste simulé (aucune
 * page d'édition aujourd'hui, brief explicite), "Supprimer" retire
 * réellement le lead des données simulées (même service CRUD que la
 * liste, Jour 8) après confirmation, "Retour à la liste" navigue.
 */
export function LeadQuickActions({ lead }: LeadQuickActionsProps) {
  const navigate = useNavigate();
  const { info, success, error: notifyError } = useNotifications();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteLead(lead.id);
      success(`${lead.firstName} ${lead.lastName} a été supprimé.`);
      navigate(ROUTES.LEADS);
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
          onClick={() => navigate(ROUTES.LEADS)}
          leadingIcon={<Icons.chevronLeft className="size-4" />}
        >
          Retour à la liste
        </Button>
        <Button
          variant="outline"
          leadingIcon={<Icons.edit className="size-4" />}
          onClick={() => info("La modification d'un lead arrive bientôt.")}
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
        title="Supprimer ce lead ?"
      >
        <p className="text-body text-text-secondary">
          Cette action supprimera définitivement "{lead.firstName}{' '}
          {lead.lastName}" de la liste. Cette action est simulée et n'affecte
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
