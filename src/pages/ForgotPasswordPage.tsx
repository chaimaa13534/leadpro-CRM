import { AuthCard } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

/** Page "mot de passe oublié" — voir `ForgotPasswordForm`. */
export function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
