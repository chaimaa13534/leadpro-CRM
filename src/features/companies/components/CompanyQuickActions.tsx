import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Icons } from '@/components/ui/icons';
import { useNotifications } from '@/hooks/useNotifications';
import { deleteCompany } from '@/services/company.service';
import { ROUTES, buildEditCompanyPath } from '@/lib/constants/routes.constants';
import type { Company } from '@/types/company.types';

export interface CompanyQuickActionsProps {
  company: Company;
}

export function CompanyQuickActions({ company }: CompanyQuickActionsProps) {
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotifications();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteCompany(company.id);
      success(`${company.name} a été supprimée.`);
      navigate(ROUTES.COMPANIES);
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
          onClick={() => navigate(ROUTES.COMPANIES)}
          leadingIcon={<Icons.chevronLeft className="size-4" />}
        >
          Retour à la liste
        </Button>
        <Button
          variant="outline"
          leadingIcon={<Icons.edit className="size-4" />}
          onClick={() => navigate(buildEditCompanyPath(company.id))}
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
        title="Supprimer cette entreprise ?"
      >
        <p className="text-body text-text-secondary">
          Cette action supprimera définitivement "{company.name}" de la liste.
          Cette action est simulée et n'affecte aucune base de données réelle.
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

