import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  isLoading?: boolean;
}

/**
 * Boîte de confirmation de suppression d'un lead. Ne supprime jamais sans
 * confirmation explicite de l'utilisateur (soft delete côté backend).
 */
export function ConfirmLeadDialog({
  open,
  onClose,
  onConfirm,
  leadName,
  isLoading = false,
}: ConfirmLeadDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title="Supprimer ce lead ?" size="sm">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-5"
      >
        <p className="text-[13px] leading-relaxed text-text-tertiary">
          Cette action supprimera le lead «&nbsp;{leadName}&nbsp;»
          définitivement.
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
