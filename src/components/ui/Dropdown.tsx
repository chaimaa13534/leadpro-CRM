import { type ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { popoverVariants } from '@/lib/motion-variants';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute top-full z-50 mt-1.5 min-w-[200px] rounded-xl border border-border bg-surface-elevated p-1.5 shadow-xl',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
            role="menu"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Dropdown item ── */
interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  danger?: boolean;
}

export function DropdownItem({ icon, danger = false, className, children, ...props }: DropdownItemProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150',
        danger
          ? 'text-danger-400 hover:bg-danger-500/10 hover:text-danger-300'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        className
      )}
      role="menuitem"
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

/* ── Dropdown separator ── */
export function DropdownSeparator() {
  return <div className="my-1.5 h-px bg-border" role="separator" />;
}
