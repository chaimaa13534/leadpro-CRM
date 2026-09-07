import { Users, UserPlus, BadgeCheck, Star } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import type { Contact } from '@/types/contact.types';

export interface ContactsKPIsProps {
  contacts: Contact[];
}

function isThisMonth(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function ContactsKPIs({ contacts }: ContactsKPIsProps) {
  const total = contacts.length;
  const newThisMonth = contacts.filter((c) =>
    isThisMonth(c.createdAt),
  ).length;
  const active = contacts.filter((c) => c.status === 'active').length;
  const vip = contacts.filter((c) => c.status === 'vip').length;

  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      <KPICard
        icon={Users}
        label="Total Contacts"
        value={total.toLocaleString('fr-FR')}
        description="Tous statuts confondus"
      />
      <KPICard
        icon={UserPlus}
        label="Nouveaux ce mois"
        value={newThisMonth.toLocaleString('fr-FR')}
        description="Créés depuis le 1er du mois"
      />
      <KPICard
        icon={BadgeCheck}
        label="Contacts actifs"
        value={active.toLocaleString('fr-FR')}
        description="En cours de relation"
      />
      <KPICard
        icon={Star}
        label="Contacts VIP"
        value={vip.toLocaleString('fr-FR')}
        description="Statut prioritaire"
      />
    </div>
  );
}

