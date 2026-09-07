/**
 * Couleurs du Design System exposées en JS
 * pour les contextes non-CSS (Recharts, Canvas, etc.)
 *
 * ⚠️ Ne jamais utiliser ces valeurs dans un composant React
 *    — utiliser les classes Tailwind à la place.
 */
export const COLORS = {
  primary: {
    50: '#eef1ff',
    100: '#e0e6ff',
    200: '#c7d0fe',
    300: '#a3b1fc',
    400: '#7b8af8',
    500: '#636af1',
    600: '#5452e5',
    700: '#4843d0',
    800: '#3c3aab',
    900: '#33358b',
    950: '#1d1f52',
  },
  success: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
  secondary: { 600: '#5452e5' },
  warning: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
  danger: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
  info: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
  neutral: {
    100: '#f8f9fc',
    200: '#e4e7ef',
    300: '#ced3df',
    400: '#a8b0c3',
    500: '#7d87a2',
    600: '#636c87',
  },
} as const;

/** Palette pour les graphiques — ordre cohérent et accessible */
export const CHART_COLORS = [
  COLORS.primary[500],
  COLORS.primary[300],
  COLORS.success[500],
  COLORS.warning[500],
  COLORS.info[500],
  COLORS.danger[500],
  COLORS.neutral[400],
  COLORS.primary[700],
] as const;

/** Dégradé CSS réutilisable */
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary[500]}, ${COLORS.primary[700]})`,
  subtle: `linear-gradient(135deg, ${COLORS.primary[50]}, ${COLORS.primary[100]})`,
  dark: `linear-gradient(135deg, ${COLORS.primary[900]}, ${COLORS.primary[950]})`,
} as const;
