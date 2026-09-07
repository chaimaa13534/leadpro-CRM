import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { ErrorAlert } from '@/components/ui/Alert';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { zodResolver } from '@/lib/zod-resolver';
import { loginSchema, type LoginFormValues } from '@/schemas/login.schema';
import { ROUTES } from '@/lib/constants/routes.constants';

/**
 * Formulaire de connexion. Toute la validation passe par `loginSchema`
 * (Zod) via notre petit adaptateur `zodResolver` — aucune validation
 * manuelle dans le composant. L'appel réseau est simulé par
 * `useAuth().login()` (délai artificiel de 800 ms, voir
 * `auth.service.ts`).
 */
export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const { success } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      success('Connexion réussie. Bon retour parmi nous !');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // L'erreur est déjà exposée via `error` par `useAuth` — rien de
      // plus à faire ici, le formulaire reste affiché avec le message.
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ErrorAlert>{error}</ErrorAlert>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-label text-text-primary">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@entreprise.com"
          hasError={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-caption text-danger-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-label text-text-primary">
            Mot de passe
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-caption text-primary-600 transition-colors duration-150 hover:text-primary-700"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          hasError={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-caption text-danger-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Checkbox
        id="rememberMe"
        label="Se souvenir de moi"
        {...register('rememberMe')}
      />

      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Se connecter
      </Button>

     
    </form>
  );
}
