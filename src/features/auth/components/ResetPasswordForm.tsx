import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SuccessAlert, ErrorAlert } from '@/components/ui/Alert';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { zodResolver } from '@/lib/zod-resolver';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/schemas/resetPassword.schema';
import { resetPassword } from '@/services/auth.service';
import { ROUTES } from '@/lib/constants/routes.constants';

/**
 * Formulaire de réinitialisation. Le jeton vient normalement du lien
 * reçu par email (`?token=...`) ; en son absence (démo), un jeton de
 * démonstration est utilisé pour que le flux reste testable de bout en
 * bout sans backend.
 */
const DEMO_RESET_TOKEN = 'demo-reset-token';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? DEMO_RESET_TOKEN;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = useWatch({ control, name: 'password' });

  async function onSubmit(values: ResetPasswordFormValues) {
    setSubmitError(null);
    try {
      await resetPassword(token, values.password);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'La réinitialisation a échoué.',
      );
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isSubmitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          <SuccessAlert>
            Votre mot de passe a été réinitialisé avec succès.
          </SuccessAlert>
          <Link
            to={ROUTES.LOGIN}
            className="text-center text-body text-primary-600 transition-colors duration-150 hover:text-primary-700"
          >
            Retour à la connexion
          </Link>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          {submitError ? <ErrorAlert>{submitError}</ErrorAlert> : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-label text-text-primary">
              Nouveau mot de passe
            </label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="••••••••"
              hasError={Boolean(errors.password)}
              {...register('password')}
            />
            <PasswordStrengthMeter password={passwordValue} />
            {errors.password ? (
              <p className="text-caption text-danger-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-label text-text-primary"
            >
              Confirmation
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="••••••••"
              hasError={Boolean(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="text-caption text-danger-600">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Réinitialiser le mot de passe
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
