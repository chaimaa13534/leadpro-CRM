import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { Toast } from '@/components/ui/Toast';
import type { ToastNotification } from '@/types/toast.types';

export interface ToastViewportProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

/**
 * Empile les toasts actifs en haut à droite de l'écran. Composant
 * purement contrôlé (reçoit `notifications` en props) — ne lit jamais le
 * contexte lui-même, pour rester cohérent avec le reste de
 * `components/ui/` (voir `Modal`, construit sur le même principe).
 */
export function ToastViewport({
  notifications,
  onDismiss,
}: ToastViewportProps) {
  return createPortal(
    <div
      className="pointer-events-none fixed top-4 right-4 flex flex-col gap-2"
      style={{ zIndex: 'var(--z-toast)' }}
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Toast notification={notification} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
