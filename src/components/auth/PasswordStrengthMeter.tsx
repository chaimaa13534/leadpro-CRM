import { cn } from '@/lib/cn';
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABELS,
  type PasswordStrength,
} from '@/schemas/resetPassword.schema';

export interface PasswordStrengthMeterProps {
  password: string;
}

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  0: 'bg-neutral-200',
  1: 'bg-danger-500',
  2: 'bg-warning-500',
  3: 'bg-info-500',
  4: 'bg-success-500',
};

const STRENGTH_TEXT_COLOR: Record<PasswordStrength, string> = {
  0: 'text-text-secondary',
  1: 'text-danger-600',
  2: 'text-warning-600',
  3: 'text-info-600',
  4: 'text-success-600',
};

/** Indicateur visuel de force du mot de passe, 4 segments + libellé. */
export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-200 ease-standard',
              segment <= strength ? STRENGTH_COLOR[strength] : 'bg-muted',
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className={cn('text-caption', STRENGTH_TEXT_COLOR[strength])}>
        {password
          ? PASSWORD_STRENGTH_LABELS[strength]
          : 'Force du mot de passe'}
      </p>
    </div>
  );
}
