import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes.constants';

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Enveloppe visuelle commune aux trois écrans d'authentification (Login,
 * Forgot Password, Reset Password) : logo, titre, sous-titre, contenu,
 * pied optionnel. Centralise l'identité "premium" demandée par le brief
 * pour que les trois pages restent visuellement cohérentes entre elles.
 */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-lg"
    >
      <Link
        to={ROUTES.DASHBOARD}
        className="mb-6 flex items-center justify-center gap-2.5"
      >
        <span className="flex size-9 items-center justify-center rounded-md bg-primary-600 text-base font-bold text-white">
          L
        </span>
        <span className="text-title text-text-primary">LeadPro CRM</span>
      </Link>

      <div className="mb-6 text-center">
        <h1 className="text-h3 text-text-primary">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-body text-text-secondary">{subtitle}</p>
        ) : null}
      </div>

      {children}

      {footer ? <div className="mt-6 text-center">{footer}</div> : null}
    </motion.div>
  );
}
