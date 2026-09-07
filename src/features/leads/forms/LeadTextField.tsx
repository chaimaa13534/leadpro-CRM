import { forwardRef, useId, type ReactNode } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/Input';
import { FormFieldShell } from '@/features/leads/forms/FormFieldShell';

export interface LeadTextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id'
> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  id?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Champ texte du formulaire Lead : label + description optionnelle +
 * message d'erreur, autour du `Input` générique du Design System.
 * `forwardRef` pour rester compatible avec `register()` de React Hook
 * Form.
 */
export const LeadTextField = forwardRef<HTMLInputElement, LeadTextFieldProps>(
  ({ label, error, description, required, id, leftIcon, rightIcon, ...props }, ref) => {
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
        <Input
          id={fieldId}
          ref={ref}
          hasError={Boolean(error)}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
      </FormFieldShell>
    );
  },
);

LeadTextField.displayName = 'LeadTextField';
