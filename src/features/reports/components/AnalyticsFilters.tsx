/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — AnalyticsFilters
   Period, sales rep, company, pipeline, status, country, source filters
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { ReportFilters, ReportPeriod } from '@/features/reports/types';

interface AnalyticsFiltersProps {
  filters: ReportFilters;
  onFilterChange: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void;
  onReset: () => void;
  className?: string;
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
  { label: 'Tous les commerciaux', value: 'all' },
  { label: 'Alex Martin', value: 'user-1' },
  { label: 'Sara Idrissi', value: 'user-2' },
  { label: 'Yassine Bennani', value: 'user-3' },
  { label: 'Omar Chraibi', value: 'user-4' },
  { label: 'Leila Kabiri', value: 'user-5' },
  { label: 'Mounia Ouazzani', value: 'user-7' },
];

const pipelineOptions = [
  { label: 'Tous les pipelines', value: 'all' },
  { label: 'Sales Pipeline', value: 'Sales Pipeline' },
  { label: 'Enterprise Pipeline', value: 'Enterprise Pipeline' },
  { label: 'Partner Pipeline', value: 'Partner Pipeline' },
];

const stageOptions = [
  { label: 'Toutes les étapes', value: 'all' },
  { label: 'Prospection', value: 'prospecting' },
  { label: 'Qualification', value: 'qualification' },
  { label: 'Proposition', value: 'proposal' },
  { label: 'Négociation', value: 'negotiation' },
  { label: 'Gagné', value: 'closed_won' },
  { label: 'Perdu', value: 'closed_lost' },
];

const statusOptions = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'Actif', value: 'active' },
  { label: 'En attente', value: 'on_hold' },
  { label: 'Gagné', value: 'won' },
  { label: 'Perdu', value: 'lost' },
  { label: 'Abandonné', value: 'abandoned' },
];

const countryOptions = [
  { label: 'Tous les pays', value: 'all' },
  { label: 'Maroc', value: 'Maroc' },
  { label: 'France', value: 'France' },
  { label: 'Belgique', value: 'Belgique' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Tunisie', value: 'Tunisie' },
];

const sourceOptions = [
  { label: 'Toutes les sources', value: 'all' },
  { label: 'Site Web', value: 'website' },
  { label: 'Référencement', value: 'referral' },
  { label: 'Réseaux sociaux', value: 'social_media' },
  { label: 'Campagne Email', value: 'email_campaign' },
  { label: 'Événement', value: 'event' },
  { label: 'Appel à froid', value: 'cold_call' },
  { label: 'Partenaire', value: 'partner' },
];

const activeFilterCount = (filters: ReportFilters): number => {
  let count = 0;
  if (filters.ownerId !== 'all') count++;
  if (filters.pipeline !== 'all') count++;
  if (filters.stage !== 'all') count++;
  if (filters.status !== 'all') count++;
  if (filters.country !== 'all') count++;
  if (filters.source !== 'all') count++;
  return count;
};

export const AnalyticsFilters = memo(function AnalyticsFilters({
  filters,
  onFilterChange,
  onReset,
  className,
}: AnalyticsFiltersProps) {
  const activeCount = activeFilterCount(filters);

  return (
    <Card variant="outlined" className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-text-tertiary" />
            <span className="text-[13px] font-medium text-text-primary">Filtres</span>
            {activeCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeCount} actif{activeCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {activeCount > 0 && (
            <Button variant="ghost" size="xs" onClick={onReset} aria-label="Réinitialiser les filtres">
              <X className="size-3" />
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
          <Select
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value as ReportPeriod)}
            options={periodOptions}
            placeholder="Période"
            aria-label="Période"
          />
          <Select
            value={filters.ownerId}
            onChange={(e) => onFilterChange('ownerId', e.target.value)}
            options={ownerOptions}
            placeholder="Commercial"
            aria-label="Commercial"
          />
          <Select
            value={filters.pipeline}
            onChange={(e) => onFilterChange('pipeline', e.target.value)}
            options={pipelineOptions}
            placeholder="Pipeline"
            aria-label="Pipeline"
          />
          <Select
            value={filters.stage}
            onChange={(e) => onFilterChange('stage', e.target.value as ReportFilters['stage'])}
            options={stageOptions}
            placeholder="Étape"
            aria-label="Étape"
          />
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            options={statusOptions}
            placeholder="Statut"
            aria-label="Statut"
          />
          <Select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            options={countryOptions}
            placeholder="Pays"
            aria-label="Pays"
          />
          <Select
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value)}
            options={sourceOptions}
            placeholder="Source"
            aria-label="Source"
          />
        </div>
      </CardContent>
    </Card>
  );
});
