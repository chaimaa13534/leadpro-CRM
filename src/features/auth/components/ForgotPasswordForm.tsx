import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SuccessAlert } from '@/components/ui/Alert';
import { zodResolver } from '@/lib/zod-resolver';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/schemas/forgotPassword.schema';
import { forgotPassword } from '@/services/auth.service';
import { ROUTES } from '@/lib/constants/routes.constants';

/**
 * Formulaire "mot de passe oublié". N'appelle jamais une vraie API :
 * `forgotPassword()` (service simulé) résout toujours avec succès après
 * un court délai, et n'affiche jamais si l'email existe réellement.
 */
export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await forgotPassword(values.email);
    setIsSubmitted(true);
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
          <SuccessAlert>Un lien de réinitialisation a été envoyé.</SuccessAlert>
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
              <p className="text-caption text-danger-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Envoyer le lien de réinitialisation
          </Button>

          <Link
            to={ROUTES.LOGIN}
            className="text-center text-caption text-text-secondary transition-colors duration-150 hover:text-text-primary"
          >
            Retour à la connexion
          </Link>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
