import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icons } from '@/components/ui/icons';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <span role="status" aria-label="Chargement" {...props}>
      <Icons.spinner
        className={cn(
          'animate-spin text-primary-600',
          SIZE_CLASSES[size],
          className,
        )}
        aria-hidden="true"
      />
    </span>
  );
}
