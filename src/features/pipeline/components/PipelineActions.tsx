/**
 * Menu d'actions pour une carte Kanban.
 * Propose Modifier, Voir, Supprimer, et des actions rapides.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

interface PipelineActionsProps {
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function PipelineActions({ onEdit, onView, onDelete, className }: PipelineActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void | undefined) => {
    return () => {
      action();
      setIsOpen(false);
    };
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
        aria-label="Actions"
        aria-expanded={isOpen}
      >
        <Icons.more className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -2 }}
              transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-border bg-surface p-1 shadow-lg"
            >
              {onView && (
                <button
                  onClick={handleAction(onView)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <Icons.externalLink className="h-3.5 w-3.5" />
                  Voir
                </button>
              )}
              {onEdit && (
                <button
                  onClick={handleAction(onEdit)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <Icons.edit className="h-3.5 w-3.5" />
                  Modifier
                </button>
              )}
              {onDelete && (
                <>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={handleAction(onDelete)}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10 transition-colors"
                  >
                    <Icons.delete className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

