import type { Variants } from 'framer-motion';

/**
 * Variantes Framer Motion réutilisables. Centralisées ici pour que toute
 * animation future utilise le même vocabulaire de mouvement (mêmes durées,
 * mêmes courbes) plutôt que des valeurs ad hoc dispersées dans les
 * composants — cohérent avec la consigne "ne pas animer excessivement" :
 * un jeu de mouvements restreint et intentionnel plutôt que des effets
 * disparates.
 *
 * Toutes les courbes utilisent [0.4, 0, 0.2, 1] (cubic-bezier standard
 * Material Design / shadcn) pour un rendu premium et naturel.
 */

/* ── Easing presets ── */
export const easePremium = [0.4, 0, 0.2, 1] as const;
export const easeOut = [0.2, 0.65, 0.4, 1] as const;
export const easeIn = [0.4, 0, 1, 1] as const;

/* ── Fade ── */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: easePremium } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: easePremium } },
};

/* ── Slide up ── */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easePremium },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15, ease: easePremium },
  },
};

/* ── Scale ── */
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: easePremium },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15, ease: easePremium },
  },
};

/* ── Page transition ── */
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easePremium },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: easePremium },
  },
};

/* ── List stagger ── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easePremium },
  },
};

/* ── Card / tile enter ── */
export const cardEnterVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: easePremium },
  },
};

/* ── Micro-interaction de survol / appui ── */
export const hoverScale = { scale: 1.02 };
export const tapScale = { scale: 0.98 };

/* ── Dropdown / popover enter ── */
export const popoverVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: easePremium },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.1, ease: easePremium },
  },
};

/* ── Modal backdrop ── */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/* ── Modal panel ── */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: easePremium },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.15, ease: easePremium },
  },
};

/* ── Sidebar collapse ── */
export const sidebarVariants: Variants = {
  expanded: { width: 260, transition: { duration: 0.3, ease: easePremium } },
  collapsed: { width: 68, transition: { duration: 0.3, ease: easePremium } },
};
