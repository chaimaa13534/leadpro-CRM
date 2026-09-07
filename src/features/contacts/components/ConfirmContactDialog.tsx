import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmContactDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactName: string;
  isLoading?: boolean;
}

/**
 * Boîte de confirmation de suppression d'un contact. Ne supprime jamais
 * sans confirmation explicite de l'utilisateur.
 */
export function ConfirmContactDialog({
  open,
  onClose,
  onConfirm,
  contactName,
  isLoading = false,
}: ConfirmContactDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Supprimer ce contact ?" size="sm">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-5"
      >
        <p className="text-[13px] leading-relaxed text-text-tertiary">
          Are you sure you want to delete this contact? Cette action
          supprimera «&nbsp;{contactName}&nbsp;» définitivement.
        </p>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            Supprimer
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
}
