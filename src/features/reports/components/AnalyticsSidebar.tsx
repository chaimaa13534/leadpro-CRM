/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — AnalyticsSidebar
   Filter sidebar with all available filters
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { ReportFilters, ReportPeriod } from '@/features/reports/types';

interface AnalyticsSidebarProps {
  open: boolean;
  onClose: () => void;
  filters: ReportFilters;
  onFilterChange: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void;
  onReset: () => void;
}

const periodOptions = [
  { label: '7 jours', value: '7d' },
  { label: '30 jours', value: '30d' },
  { label: '90 jours', value: '90d' },
  { label: '6 mois', value: '6m' },
  { label: '12 mois', value: '12m' },
  { label: '36 mois', value: '36m' },
];

const ownerOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Alex Martin', value: 'user-1' },
  { label: 'Sara Idrissi', value: 'user-2' },
  { label: 'Yassine Bennani', value: 'user-3' },
  { label: 'Omar Chraibi', value: 'user-4' },
  { label: 'Leila Kabiri', value: 'user-5' },
  { label: 'Mounia Ouazzani', value: 'user-7' },
];

const pipelineOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Sales Pipeline', value: 'Sales Pipeline' },
  { label: 'Enterprise', value: 'Enterprise Pipeline' },
  { label: 'Partner', value: 'Partner Pipeline' },
];

const stageOptions = [
  { label: 'Toutes', value: 'all' },
  { label: 'Prospection', value: 'prospecting' },
  { label: 'Qualification', value: 'qualification' },
  { label: 'Proposition', value: 'proposal' },
  { label: 'Négociation', value: 'negotiation' },
  { label: 'Gagné', value: 'closed_won' },
  { label: 'Perdu', value: 'closed_lost' },
];

const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Actif', value: 'active' },
  { label: 'En attente', value: 'on_hold' },
  { label: 'Gagné', value: 'won' },
  { label: 'Perdu', value: 'lost' },
];

const countryOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Maroc', value: 'Maroc' },
  { label: 'France', value: 'France' },
  { label: 'Belgique', value: 'Belgique' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Tunisie', value: 'Tunisie' },
];

const sourceOptions = [
  { label: 'Toutes', value: 'all' },
  { label: 'Site Web', value: 'website' },
  { label: 'Référencement', value: 'referral' },
  { label: 'Réseaux sociaux', value: 'social_media' },
  { label: 'Email', value: 'email_campaign' },
  { label: 'Événement', value: 'event' },
  { label: 'Appel', value: 'cold_call' },
];

export const AnalyticsSidebar = memo(function AnalyticsSidebar({
  open,
  onClose,
  filters,
  onFilterChange,
  onReset,
}: AnalyticsSidebarProps) {
  if (!open) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
      className="w-72 border-l border-border bg-surface p-5 overflow-y-auto shrink-0"
      role="complementary"
      aria-label="Filtres d'analyse"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-text-tertiary" />
          <span className="text-[13px] font-semibold text-text-primary">Filtres</span>
        </div>
        <button
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
          aria-label="Fermer"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <FilterGroup label="Période">
          <Select
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value as ReportPeriod)}
            options={periodOptions}
          />
        </FilterGroup>

        <FilterGroup label="Commercial">
          <Select
            value={filters.ownerId}
            onChange={(e) => onFilterChange('ownerId', e.target.value)}
            options={ownerOptions}
          />
        </FilterGroup>

        <FilterGroup label="Pipeline">
          <Select
            value={filters.pipeline}
            onChange={(e) => onFilterChange('pipeline', e.target.value)}
            options={pipelineOptions}
          />
        </FilterGroup>

        <FilterGroup label="Étape">
          <Select
            value={filters.stage}
            onChange={(e) => onFilterChange('stage', e.target.value as ReportFilters['stage'])}
            options={stageOptions}
          />
        </FilterGroup>

        <FilterGroup label="Statut">
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            options={statusOptions}
          />
        </FilterGroup>

        <FilterGroup label="Pays">
          <Select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            options={countryOptions}
          />
        </FilterGroup>

        <FilterGroup label="Source">
          <Select
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value)}
            options={sourceOptions}
          />
        </FilterGroup>

        <Button variant="ghost" size="sm" onClick={onReset} className="mt-2">
          <RotateCcw className="size-3.5" />
          Réinitialiser
        </Button>
      </div>
    </motion.aside>
  );
});

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
