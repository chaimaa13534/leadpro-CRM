/**
 * État global de l'application.
 *
 * Quatre "slices" à ce jour :
 * - `theme-context` (Jour 7) : thème clair/sombre, actif partout.
 * - `layout-context` (Jour 4) : Sidebar, Drawer mobile (Main Layout uniquement).
 * - `auth-context` (Jour 6) : session utilisateur simulée, persistée en
 *   `localStorage` — voir `AuthProvider` et `src/hooks/useAuth.ts`.
 * - `notification-context` (Jour 7) : notifications "toast" — voir
 *   `NotificationProvider` et `src/hooks/useNotifications.ts`.
 *
 * Pas de librairie externe (Redux/Zustand) branchée : un Context léger
 * suffit à cette échelle. Chaque nouveau domaine d'état a son propre
 * fichier sous `slices/`, réexporté ici.
 */
export * from '@/store/slices/theme-context';
export * from '@/store/slices/ThemeProvider';
export * from '@/store/slices/layout-context';
export * from '@/store/slices/LayoutProvider';
export * from '@/store/slices/auth-context';
export * from '@/store/slices/AuthProvider';
export * from '@/store/slices/notification-context';
export * from '@/store/slices/NotificationProvider';
