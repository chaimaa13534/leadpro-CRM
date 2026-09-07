import { type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface FormFieldShellProps {
  fieldId: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: ReactNode;
}

/**
 * Chrome partagé (label, description, message d'erreur) par
 * `LeadTextField`, `LeadSelect`, `LeadPhoneInput` et `LeadNotes` — évite
 * de dupliquer quatre fois le même balisage label/erreur. Composant
 * interne, non exporté depuis le barrel `features/leads/forms` : un
 * détail d'implémentation, pas une primitive à réutiliser telle quelle
 * ailleurs (contrairement à `components/ui/`).
 */
export function FormFieldShell({
  fieldId,
  label,
  required,
  description,
  error,
  children,
}: FormFieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className={cn(
          'text-[13px] font-medium leading-none tracking-tight',
          error ? 'text-danger-600' : 'text-text-primary',
        )}
      >
        {label}
        {required ? (
          <span className="ml-0.5 text-danger-500">*</span>
        ) : null}
      </label>
      {description ? (
        <p className="text-[12px] leading-relaxed text-text-tertiary">
          {description}
        </p>
      ) : null}
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key={`${fieldId}-error`}
            id={`${fieldId}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex items-center gap-1 text-[12px] leading-tight text-danger-600"
          >
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
