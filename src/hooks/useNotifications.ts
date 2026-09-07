import { useCallback, useContext, useMemo } from 'react';
import { NotificationContext } from '@/store/slices/notification-context';

/**
 * Accès à l'infrastructure de notifications "toast". Doit être utilisé
 * sous `NotificationProvider` (monté dans `App`).
 *
 * Expose des raccourcis par variante pour un usage ergonomique :
 * `const { success, error } = useNotifications(); success('Lead créé');`
 */
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications doit être utilisé sous un <NotificationProvider>.',
    );
  }

  const { notify, dismiss, notifications } = context;

  const success = useCallback(
    (message: string, title?: string) =>
      notify({ variant: 'success', message, title }),
    [notify],
  );
  const error = useCallback(
    (message: string, title?: string) =>
      notify({ variant: 'error', message, title }),
    [notify],
  );
  const warning = useCallback(
    (message: string, title?: string) =>
      notify({ variant: 'warning', message, title }),
    [notify],
  );
  const info = useCallback(
    (message: string, title?: string) =>
      notify({ variant: 'info', message, title }),
    [notify],
  );

  return useMemo(
    () => ({ notifications, notify, dismiss, success, error, warning, info }),
    [notifications, notify, dismiss, success, error, warning, info],
  );
}
