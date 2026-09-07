/* ═════════════════════════════════════════════════════════════════════
   Settings — PasswordStrengthIndicator
   Indicateur de force du mot de passe (aucune donnée n’est stockée).
   ═════════════════════════════════════════════════════════════════════ */

import { cn } from '@/lib/cn';
import { computePasswordStrength } from '@/features/settings/utils/password-utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

/* ═══════════════════════════════════════════════════════ */
export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = computePasswordStrength(password ?? '');

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full bg-border transition-colors duration-300',
              index < strength.score && 'bg-current',
            )}
            style={{
              color:
                strength.score <= 2
                  ? 'var(--color-danger-400)'
                  : strength.score === 3
                    ? 'var(--color-warning-400)'
                    : strength.score === 4
                      ? 'var(--color-info-400)'
                      : 'var(--color-success-500)',
            }}
          />
        ))}
      </div>
      <p
        className={cn(
          'text-[11px] font-medium',
          strength.score <= 2
            ? 'text-danger-400'
            : strength.score === 3
              ? 'text-warning-400'
              : strength.score === 4
                ? 'text-info-400'
                : 'text-success-500',
        )}
        role="status"
        aria-live="polite"
      >
        {strength.label}
      </p>
    </div>
  );
}

export default PasswordStrengthIndicator;

