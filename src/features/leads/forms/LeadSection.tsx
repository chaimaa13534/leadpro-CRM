import type { ReactNode, ElementType } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface LeadSectionProps {
  title: string;
  description?: string;
  icon?: ElementType;
  children: ReactNode;
  /** Décalage d'entrée (secondes) pour l'apparition en cascade des sections. */
  delay?: number;
}

/**
 * Une section du formulaire (Informations personnelles, Entreprise…),
 * en carte, avec une grille de champs à 2 colonnes sur tablette/desktop
 * et 1 colonne sur mobile — cohérent avec la disposition demandée par
 * le brief. Les sections s'enchaînent verticalement, chacune avec une
 * légère apparition décalée.
 */
export function LeadSection({
  title,
  description,
  icon: Icon,
  children,
  delay = 0,
}: LeadSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <div className="group rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:shadow-md hover:border-border-hover">
        {/* Section Header */}
        <div className="flex items-start gap-3 border-b border-border/50 px-6 py-4">
          {Icon && (
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
              {title}
            </h3>
            {description ? (
              <p className="mt-0.5 text-[13px] leading-snug text-text-tertiary">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {/* Section Content */}
        <div className="grid grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
