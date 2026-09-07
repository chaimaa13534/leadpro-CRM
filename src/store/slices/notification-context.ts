import { createContext } from 'react';
import type { NotifyInput, ToastNotification } from '@/types/toast.types';

export interface NotificationContextValue {
  notifications: ToastNotification[];
  notify: (input: NotifyInput) => string;
  dismiss: (id: string) => void;
}

/**
 * Infrastructure de notifications "toast" légère, écrite à la main
 * plutôt que d'installer une librairie externe (react-hot-toast, sonner…)
 * — pas indispensable pour un besoin aussi simple, conformément au
 * brief du Jour 7 ("ne pas installer une bibliothèque si elle n'est pas
 * indispensable").
 */
export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
