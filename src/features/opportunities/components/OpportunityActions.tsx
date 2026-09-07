import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { Icons } from '@/components/ui/icons';

export interface OpportunityActionsProps {
  opportunityName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OpportunityActions({
  opportunityName,
  onView,
  onEdit,
  onDelete,
}: OpportunityActionsProps) {
  const { isOpen, setIsOpen, containerRef } = useDropdown<HTMLDivElement>();

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Actions pour ${opportunityName}`}
        className="flex size-8 items-center justify-center rounded-md text-text-secondary/60 transition-colors duration-150 hover:bg-muted hover:text-text-primary"
      >
        <Icons.more className="size-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="menu"
            aria-label={`Actions pour ${opportunityName}`}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
            className="absolute top-full right-0 mt-1 w-40 overflow-hidden rounded-lg border border-border/80 bg-surface shadow-md"
            style={{ zIndex: 'var(--z-popover)' }}
          >
            <div className="p-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onView();
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body text-text-primary transition-colors duration-150 hover:bg-muted"
              >
                <Icons.show className="size-4 text-text-secondary" aria-hidden="true" />
                Voir
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body text-text-primary transition-colors duration-150 hover:bg-muted"
              >
                <Icons.edit className="size-4 text-text-secondary" aria-hidden="true" />
                Modifier
              </button>
            </div>
            <div className="border-t border-border/50" />
            <div className="p-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body text-danger-600 transition-colors duration-150 hover:bg-danger-50"
              >
                <Icons.delete className="size-4" aria-hidden="true" />
                Supprimer
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

