import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/ui/icons';
import { FormFieldShell } from '@/features/leads/forms/FormFieldShell';
import { cn } from '@/lib/cn';

export interface LeadPhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'type'
> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  id?: string;
}

/**
 * Champ téléphone : même chrome que `LeadTextField`, avec une icône
 * dédiée et `type="tel"` (clavier numérique sur mobile). Le format n'est
 * pas contraint ici — la validation (regex tolérante) vit dans
 * `schemas/newLead.schema.ts`.
 */
export const LeadPhoneInput = forwardRef<HTMLInputElement, LeadPhoneInputProps>(
  ({ label, error, description, required, id, className, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FormFieldShell
        fieldId={fieldId}
        label={label}
        required={required}
        description={description}
        error={error}
      >
        <div className="relative">
          <Icons.phone
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <Input
            id={fieldId}
            ref={ref}
            type="tel"
            hasError={Boolean(error)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn('pl-9', className)}
            {...props}
          />
        </div>
      </FormFieldShell>
    );
  },
);

LeadPhoneInput.displayName = 'LeadPhoneInput';
