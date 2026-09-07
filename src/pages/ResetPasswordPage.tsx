import { AuthCard } from '@/components/auth/AuthCard';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

/** Page de réinitialisation du mot de passe — voir `ResetPasswordForm`. */
export function ResetPasswordPage() {
  return (
    <AuthCard
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe fort pour sécuriser votre compte"
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
