import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/features/auth/components/LoginForm';

/** Page de connexion — voir `LoginForm` pour la logique du formulaire. */
export function LoginPage() {
  return (
    <AuthCard
      title="Bon retour"
      subtitle="Connectez-vous à votre espace LeadPro CRM"
    >
      <LoginForm />
    </AuthCard>
  );
}
