import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { FormFieldShell } from '@/features/leads/forms/FormFieldShell';
import { cn } from '@/lib/cn';

export interface LeadNotesProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id'
> {
  label: string;
  error?: string;
  description?: string;
  maxLength?: number;
  id?: string;
}

/** Champ Notes avec compteur de caractères, aligné sur `maxLength`. */
export const LeadNotes = forwardRef<HTMLTextAreaElement, LeadNotesProps>(
  (
    { label, error, description, maxLength = 500, id, value, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const currentLength = typeof value === 'string' ? value.length : 0;
    const percentage = maxLength > 0 ? (currentLength / maxLength) * 100 : 0;
    const isNearLimit = currentLength > maxLength * 0.9;
    const isOverLimit = currentLength > maxLength;
    const describedBy = [error ? `${fieldId}-error` : null, `${fieldId}-count`]
      .filter(Boolean)
      .join(' ');

    return (
      <FormFieldShell
        fieldId={fieldId}
        label={label}
        description={description}
        error={error}
      >
        <Textarea
          id={fieldId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          hasError={Boolean(error) || isOverLimit}
          aria-invalid={Boolean(error) || isOverLimit || undefined}
          aria-describedby={describedBy}
          {...props}
        />
        <div className="flex items-center justify-between gap-3">
          {/* Progress bar */}
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                isOverLimit
                  ? 'bg-danger-500'
                  : isNearLimit
                    ? 'bg-warning-500'
                    : 'bg-success-500',
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
              role="progressbar"
              aria-valuenow={currentLength}
              aria-valuemin={0}
              aria-valuemax={maxLength}
            />
          </div>
          <p
            id={`${fieldId}-count`}
            className={cn(
              'shrink-0 text-[11px] font-medium tabular-nums',
              isOverLimit
                ? 'text-danger-600'
                : isNearLimit
                  ? 'text-warning-600'
                  : 'text-text-tertiary',
            )}
          >
            {currentLength}/{maxLength}
          </p>
        </div>
      </FormFieldShell>
    );
  },
);

LeadNotes.displayName = 'LeadNotes';
