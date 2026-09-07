/* ═════════════════════════════════════════════════════════════════════
   Settings — SettingsSection
   Conteneur de section : titre + description + contenu.
   ═════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SettingsSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      {title ? (
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-text-primary">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-[13px] leading-relaxed text-text-tertiary">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export default SettingsSection;

