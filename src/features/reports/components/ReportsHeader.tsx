import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarDays, Download, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import type { ReportPeriod } from '@/features/reports/types';
import { getPeriodLabel } from '@/features/reports/utils';

interface ReportsHeaderProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  onRefresh: () => void;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  loading?: boolean;
}

const periodOptions = [
  { label: '7 jours', value: '7d' },
  { label: '30 jours', value: '30d' },
  { label: '90 jours', value: '90d' },
  { label: '6 mois', value: '6m' },
  { label: '12 mois', value: '12m' },
  { label: '36 mois', value: '36m' },
];

export const ReportsHeader = memo(function ReportsHeader({
  period,
  onPeriodChange,
  onRefresh,
  onExport,
  loading = false,
}: ReportsHeaderProps) {
  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-surface-hover text-accent">
            <BarChart3 className="size-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">Reports & Analytics</h1>
            <p className="mt-1 text-[13px] text-text-tertiary">Vue business intelligence premium • Données simulées</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Card variant="outlined" padding="sm" className="flex items-center gap-2">
            <CalendarDays className="size-4 text-text-tertiary" />
            <span className="text-[13px] text-text-secondary">{todayLabel}</span>
          </Card>
          <div className="w-40">
            <Select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as ReportPeriod)}
              options={periodOptions}
              aria-label="Période"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={() => onExport('pdf')}>
            <FileText className="size-3.5" />
            PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onExport('excel')}>
            <FileSpreadsheet className="size-3.5" />
            Excel
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onExport('csv')}>
            <Download className="size-3.5" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={onRefresh} loading={loading}>
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-tertiary">
        <span className="rounded-full bg-accent-subtle px-2.5 py-1 text-accent">Période : {getPeriodLabel(period)}</span>
        <span className="rounded-full bg-surface-hover px-2.5 py-1">Analyse commercial • Prédictions • Performance</span>
      </div>
    </motion.div>
  );
});
