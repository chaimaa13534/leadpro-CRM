import { forwardRef, useId, type ReactNode } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { Select } from '@/components/ui/Select';
import { FormFieldShell } from '@/features/leads/forms/FormFieldShell';

export interface LeadSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id'
> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  id?: string;
  leftIcon?: ReactNode;
}

/** Champ `<select>` du formulaire Lead — même chrome que `LeadTextField`. */
export const LeadSelect = forwardRef<HTMLSelectElement, LeadSelectProps>(
  ({ label, error, description, required, id, leftIcon, children, ...props }, ref) => {
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
        <Select
          id={fieldId}
          ref={ref}
          hasError={Boolean(error)}
          leftIcon={leftIcon}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        >
          {children}
        </Select>
      </FormFieldShell>
    );
  },
);

LeadSelect.displayName = 'LeadSelect';
