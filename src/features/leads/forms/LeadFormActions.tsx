import { motion } from 'framer-motion';
import { Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface LeadFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

/**
 * Barre d'actions du formulaire (Annuler / Créer). Premium design
 * with gradient button, micro-interactions, and loading shimmer state.
 */
export function LeadFormActions({
  onCancel,
  isSubmitting,
  submitLabel = 'Créer ',
}: LeadFormActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 rounded-b-2xl border-t border-border/50 bg-surface/80 px-6 py-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-end gap-3">
        {/* Cancel button */}
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5',
            'text-[13px] font-medium text-text-secondary',
            'transition-all duration-150',
            'hover:border-border-hover hover:bg-surface-hover hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Annuler
        </motion.button>

        {/* Submit button — premium gradient */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={isSubmitting ? {} : { scale: 1.02, y: -1 }}
          whileTap={isSubmitting ? {} : { scale: 0.98 }}
          className={cn(
            'relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5',
            'text-[13px] font-semibold text-white',
            'bg-gradient-to-r from-accent to-primary-600',
            'shadow-lg shadow-accent/25',
            'transition-all duration-200',
            'hover:shadow-xl hover:shadow-accent/30',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
            'disabled:pointer-events-none disabled:opacity-60',
          )}
        >
          {/* Shimmer overlay on hover */}
          <span className="absolute inset-0 -translate-x-full animate-none rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer-fast" />

          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Traitement en cours...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              {submitLabel}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
