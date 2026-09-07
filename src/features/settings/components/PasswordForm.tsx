/* ═════════════════════════════════════════════════════════════════════
   Settings — PasswordForm
   Formulaire de changement de mot de passe (100 % simulé).
   ⚠️ Aucun mot de passe n’est stocké dans localStorage ni transmis.
   ═════════════════════════════════════════════════════════════════════ */

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { zodResolver } from '@/lib/zod-resolver';
import { passwordSchema, type PasswordFormValues } from '@/features/settings/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { PasswordStrengthIndicator } from '@/features/settings/components/PasswordStrengthIndicator';

interface PasswordFormProps {
  onSave: (values: PasswordFormValues) => Promise<void> | void;
  saving?: boolean;
}

/* ═══════════════════════════════════════════════════════ */
export function PasswordForm({ onSave, saving = false }: PasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const newPassword = watch('newPassword');

  const requirements = useMemo(
    () => [
      { label: '8 caractères minimum', met: (newPassword?.length ?? 0) >= 8 },
      { label: 'Une majuscule', met: /[A-Z]/.test(newPassword ?? '') },
      { label: 'Une minuscule', met: /[a-z]/.test(newPassword ?? '') },
      { label: 'Un chiffre', met: /\d/.test(newPassword ?? '') },
      {
        label: 'Un caractère spécial',
        met: /[^A-Za-z0-9]/.test(newPassword ?? ''),
      },
    ],
    [newPassword],
  );

  const handleCancel = () => {
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6">
      <Alert variant="info">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Le changement de mot de passe est simulé : aucune donnée n’est
            envoyée ni stockée. Utilisez un mot de passe fort et unique.
          </p>
        </div>
      </Alert>

      <SettingsSection
        title="Mot de passe"
        description="Choisissez un mot de passe robuste pour protéger votre compte."
      >
        <SettingsCard>
          <div className="grid gap-4 p-5">
            <div className="relative">
              <Input
                label="Current password"
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••••"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-text-tertiary transition-colors hover:text-text-secondary"
                    aria-label={showCurrent ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                }
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
            </div>
            <div className="relative">
              <Input
                label="New password"
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••••"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNew((prev) => !prev)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-text-tertiary transition-colors hover:text-text-secondary"
                    aria-label={showNew ? 'Masquer le nouveau mot de passe' : 'Afficher le nouveau mot de passe'}
                  >
                    {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                }
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
            <PasswordStrengthIndicator password={newPassword ?? ''} />
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {requirements.map((requirement) => (
                <li
                  key={requirement.label}
                  className={cn(
                    'flex items-center gap-1.5 text-[12px]',
                    requirement.met ? 'text-success-500' : 'text-text-tertiary',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border text-[10px]',
                      requirement.met
                        ? 'border-success-500/30 bg-success-500/10'
                        : 'border-border text-text-disabled',
                    )}
                    aria-hidden="true"
                  >
                    {requirement.met ? '✓' : '•'}
                  </span>
                  {requirement.label}
                </li>
              ))}
            </ul>
            <div className="relative">
              <Input
                label="Confirm new password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••••"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-text-tertiary transition-colors hover:text-text-secondary"
                    aria-label={showConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                  >
                    {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={saving}
          leadingIcon={<KeyRound className="h-3.5 w-3.5" />}
        >
          Update password
        </Button>
      </div>
    </form>
  );
}

export default PasswordForm;

