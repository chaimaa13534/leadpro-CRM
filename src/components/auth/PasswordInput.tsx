import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/ui/icons';

export interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  hasError?: boolean;
}

/**
 * Champ mot de passe avec bouton afficher/masquer, construit sur `Input`
 * pour garder exactement le même style. Compatible `register()` de React
 * Hook Form grâce à `forwardRef`.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, hasError, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          hasError={hasError}
          className={className}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={
            isVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
          }
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isVisible ? (
            <Icons.hide className="size-4" aria-hidden="true" />
          ) : (
            <Icons.show className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
