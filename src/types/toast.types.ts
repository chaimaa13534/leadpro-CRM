import type { ID } from '@/types/common.types';

/**
 * Types pour les notifications "toast" (feedback UI éphémère : succès,
 * erreur…). Distinct de `Notification` (`notification.types.ts`), qui
 * représente une notification métier persistée (cloche de la Topbar).
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: ID;
  variant: ToastVariant;
  title?: string;
  message: string;
}

export type NotifyInput = Omit<ToastNotification, 'id'>;
