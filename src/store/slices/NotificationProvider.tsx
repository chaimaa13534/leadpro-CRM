import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotifyInput, ToastNotification } from '@/types/toast.types';
import { generateId } from '@/utils/generateId';
import { ToastViewport } from '@/components/ui/ToastViewport';
import {
  NotificationContext,
  type NotificationContextValue,
} from '@/store/slices/notification-context';

const DEFAULT_DURATION_MS = 5000;

export interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Fournit `notify()`/`dismiss()` à toute l'application et rend le
 * `ToastViewport` une seule fois — monté au niveau de `App`, comme les
 * autres providers globaux.
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (input: NotifyInput): string => {
      const id = generateId();
      setNotifications((prev) => [...prev, { ...input, id }]);

      const timeoutId = setTimeout(() => dismiss(id), DEFAULT_DURATION_MS);
      timeoutsRef.current.set(id, timeoutId);

      return id;
    },
    [dismiss],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, notify, dismiss }),
    [notifications, notify, dismiss],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastViewport notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}
