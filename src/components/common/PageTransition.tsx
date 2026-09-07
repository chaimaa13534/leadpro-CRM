import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '@/lib/motion-variants';

export interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Enveloppe une page avec la transition d'entrée/sortie standard du
 * produit (fondu + léger glissement). Composant prêt à l'emploi, mais pas
 * encore branché dans `src/routes/` — le câblage aux vraies transitions
 * de route se fera avec le développement des pages elles-mêmes.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransitionVariants}
    >
      {children}
    </motion.div>
  );
}
