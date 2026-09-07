import { cn } from '@/lib/cn';
import { getInitials } from '@/utils/getInitials';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-[12px]',
  lg: 'h-10 w-10 text-[14px]',
  xl: 'h-12 w-12 text-[16px]',
} as const;

/* ═══════════════════════════════════════════════════════ */
export function Avatar({ firstName, lastName, src, size = 'md', className }: AvatarProps) {
  const initials = getInitials([firstName, lastName].filter(Boolean).join(' '));

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName ?? ''} ${lastName ?? ''}`.trim()}
        className={cn('rounded-full object-cover shrink-0', sizeStyles[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shrink-0 font-medium',
        'bg-accent-subtle text-accent',
        sizeStyles[size],
        className
      )}
      aria-label={`${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Avatar'}
    >
      {initials || '—'}
    </div>
  );
}
