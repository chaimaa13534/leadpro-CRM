import type { ReactNode } from 'react';

export interface InfoRowProps {
  label: string;
  value: ReactNode;
}

/**
 * Ligne label/valeur partagée par `LeadProfileCard`, `LeadBusinessCard`,
 * `LeadAddressCard` et `LeadInfoCard` — évite de dupliquer quatre fois
 * le même balisage. Composant interne (non exporté dans le barrel), même
 * logique que `forms/FormFieldShell` (Jour 9).
 */
export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-caption text-text-secondary">{label}</dt>
      <dd className="truncate text-right text-body text-text-primary">
        {value ?? '—'}
      </dd>
    </div>
  );
}
