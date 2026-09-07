import { type ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

/* ═══════════════════════════════════════════════════════ */
export function Tooltip({ content, children, side = 'top', delay = 400 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeout.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg animate-scale-in',
            'dark:bg-neutral-100 dark:text-neutral-900',
            positionStyles[side]
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}
