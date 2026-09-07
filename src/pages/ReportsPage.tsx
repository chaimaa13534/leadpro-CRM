import { useState, type ReactElement } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  CircleDollarSign,
  ContactRound,
  ListTodo,
  RefreshCw,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { formatCurrency } from '@/utils/formatCurrency';
import { useReportOverview } from '@/features/reports/hooks/useReportOverview';
const colors = [
  'var(--color-accent)',
  'var(--color-success-500)',
  'var(--color-warning-500)',
  'var(--color-danger-500)',
  'var(--color-text-tertiary)',
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportToExcel(d: ReturnType<typeof useReportOverview>['data'], period: string) {
  if (!d) return;

  const workbook = XLSX.utils.book_new();

  const overview = [
    ['Reports & Analytics'],
    ['Période', period],
    [],
    ['Indicateur', 'Valeur', 'Contexte'],
    ['Total Leads', d.totalLeads, 'Leads créés sur la période'],
    ['Contacts', d.totalContacts, 'Contacts créés sur la période'],
    ['Opportunities', d.totalOpportunities, `${d.openOpportunities} ouvertes`],
    ['Pipeline estimé', d.estimatedPipelineValue, 'Valeur des opportunités ouvertes'],
    ['Valeur gagnée estimée', d.estimatedWonValue, `${d.wonOpportunities} opportunités gagnées`],
    ['Win Rate', `${d.winRate.toFixed(1)}%`, `${d.lostOpportunities} opportunités perdues`],
    ['Tâches terminées', d.completedTasks, `${d.pendingTasks} tâches en attente`],
    ['Tâches en retard', d.overdueTasks, 'Hors tâches annulées ou terminées'],
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(overview), 'Vue d’ensemble');

  const addSheet = (name: string, rows: Array<Record<string, string | number>>) => {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name);
  };

  addSheet(
    'Leads - évolution',
    d.leadsOverTime.map((item) => ({ Période: item.label, Leads: item.value })),
  );
  addSheet(
    'Opportunités',
    d.opportunitiesByStatus.map((item) => ({ Statut: item.label, Nombre: item.value })),
  );
  addSheet(
    'Pipeline',
    d.pipelineByStage.map((item) => ({
      Étape: item.label,
      'Valeur estimée': item.value,
      Volume: item.count,
    })),
  );
  addSheet(
    'Leads - statuts',
    d.leadsByStatus.map((item) => ({ Statut: item.label, Nombre: item.value })),
  );
  addSheet(
    'Leads - sources',
    d.leadsBySource.map((item) => ({ Source: item.label, Nombre: item.value })),
  );
  addSheet(
    'Tâches - statuts',
    d.tasksByStatus.map((item) => ({ Statut: item.label, Nombre: item.value })),
  );
  addSheet(
    'Tâches - priorités',
    d.tasksByPriority.map((item) => ({ Priorité: item.label, Nombre: item.value })),
  );

  const safePeriod = period.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  XLSX.writeFile(workbook, `crm-reports-${safePeriod}.xlsx`);
}

function exportToPdf(d: ReturnType<typeof useReportOverview>['data'], period: string) {
  if (!d) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const safePeriod = period.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

  doc.setFontSize(20);
  doc.text('Reports & Analytics', 14, 18);
  doc.setFontSize(10);
  doc.text(`Période : ${period}`, 14, 25);
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 31);

  autoTable(doc, {
    startY: 38,
    head: [['Indicateur', 'Valeur', 'Contexte']],
    body: [
      ['Total Leads', String(d.totalLeads), 'Leads créés sur la période'],
      ['Contacts', String(d.totalContacts), 'Contacts créés sur la période'],
      ['Opportunities', String(d.totalOpportunities), `${d.openOpportunities} ouvertes`],
      ['Pipeline estimé', formatCurrency(d.estimatedPipelineValue), 'Valeur des opportunités ouvertes'],
      ['Valeur gagnée estimée', formatCurrency(d.estimatedWonValue), `${d.wonOpportunities} opportunités gagnées`],
      ['Win Rate', `${d.winRate.toFixed(1)}%`, `${d.lostOpportunities} opportunités perdues`],
      ['Tâches terminées', String(d.completedTasks), `${d.pendingTasks} tâches en attente`],
      ['Tâches en retard', String(d.overdueTasks), 'Hors tâches annulées ou terminées'],
    ],
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fontStyle: 'bold' },
  });

  const addPdfTable = (
    title: string,
    head: string[],
    body: Array<Array<string | number>>,
  ) => {
    const lastY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 40;
    const startY = lastY > 250 ? 20 : lastY + 12;

    if (lastY > 250) doc.addPage();

    doc.setFontSize(13);
    doc.text(title, 14, startY);
    autoTable(doc, {
      startY: startY + 4,
      head: [head],
      body,
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fontStyle: 'bold' },
    });
  };

  addPdfTable(
    'Lead generation',
    ['Période', 'Leads'],
    d.leadsOverTime.map((item) => [item.label, item.value]),
  );

  addPdfTable(
    'Opportunities par statut',
    ['Statut', 'Nombre'],
    d.opportunitiesByStatus.map((item) => [item.label, item.value]),
  );

  addPdfTable(
    'Pipeline par étape',
    ['Étape', 'Valeur estimée', 'Volume'],
    d.pipelineByStage.map((item) => [item.label, formatCurrency(item.value), item.count]),
  );

  addPdfTable(
    'Leads par statut',
    ['Statut', 'Nombre'],
    d.leadsByStatus.map((item) => [item.label, item.value]),
  );

  addPdfTable(
    'Leads par source',
    ['Source', 'Nombre'],
    d.leadsBySource.map((item) => [item.label, item.value]),
  );

  addPdfTable(
    'Tâches par statut',
    ['Statut', 'Nombre'],
    d.tasksByStatus.map((item) => [item.label, item.value]),
  );

  addPdfTable(
    'Tâches par priorité',
    ['Priorité', 'Nombre'],
    d.tasksByPriority.map((item) => [item.label, item.value]),
  );

  doc.save(`crm-reports-${safePeriod}.pdf`);
}

function range(period: string) {
  const now = new Date();
  const start = new Date(now);
  if (period === 'week') start.setDate(now.getDate() - 6);
  else if (period === 'month') start.setDate(1);
  else if (period === 'last3') start.setMonth(now.getMonth() - 3);
  else if (period === 'year') start.setMonth(0, 1);
  return {
    from: start.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  };
}
function Metric({
  label,
  value,
  icon: Icon,
  context,
}: {
  label: string;
  value: string | number;
  icon: typeof Target;
  context: string;
}) {
  return (
    <article className="group rounded-xl border border-border bg-surface p-3.5 transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[.08em] text-text-tertiary">
          {label}
        </p>
        <span className="rounded-lg bg-accent-subtle p-1.5 text-accent">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-2 text-[24px] font-semibold leading-none tabular-nums text-text-primary">
        {value}
      </p>
      <p className="mt-2 text-[11px] text-text-tertiary">{context}</p>
    </article>
  );
}
function Chart({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle: string;
  children: ReactElement;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-4 ${className}`}
    >
      <div className="mb-3">
        <h2 className="text-[14px] font-semibold text-text-primary">{title}</h2>
        <p className="mt-0.5 text-[11px] text-text-tertiary">{subtitle}</p>
      </div>
      <div className="h-[238px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 animate-pulse rounded-xl bg-skeleton" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-skeleton" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-xl bg-skeleton lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-xl bg-skeleton" />
      </div>
    </div>
  );
}
export function ReportsPage() {
  const [period, setPeriod] = useState('year');
  const dates = range(period);
  const report = useReportOverview(dates.from, dates.to);
  if (report.isLoading) return <Skeleton />;
  if (report.isError)
    return (
      <EmptyState
        icon={<BarChart3 />}
        title="Impossible de charger les analytics."
        action={{ label: 'Réessayer', onClick: () => report.refetch() }}
      />
    );
  const d = report.data;
  if (
    !d ||
    (!d.totalLeads &&
      !d.totalContacts &&
      !d.totalOpportunities &&
      !d.totalCompanies)
  )
    return (
      <EmptyState
        icon={<BarChart3 />}
        title="Aucune donnée disponible"
        description="Essayez une autre période ou créez de nouvelles données."
      />
    );
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
      <header className="flex flex-col gap-3 border-b border-border pb-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-accent">
            Business intelligence
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-[13px] text-text-tertiary">
            Analysez les performances et les tendances de votre CRM.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            className="w-44"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: 'today', label: "Aujourd'hui" },
              { value: 'week', label: 'Cette semaine' },
              { value: 'month', label: 'Ce mois' },
              { value: 'last3', label: '3 derniers mois' },
              { value: 'year', label: 'Cette année' },
            ]}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToPdf(d, period)}
            leadingIcon={<FileText className="h-4 w-4" />}
          >
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(d, period)}
            leadingIcon={<FileSpreadsheet className="h-4 w-4" />}
          >
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => report.refetch()}
            leadingIcon={<RefreshCw className="h-4 w-4" />}
          >
            Actualiser
          </Button>
        </div>
      </header>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold">Vue d’ensemble</h2>
            <p className="text-[11px] text-text-tertiary">
              Indicateurs calculés pour la période sélectionnée.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total Leads"
            value={d.totalLeads}
            icon={Users}
            context="Leads créés sur la période"
          />
          <Metric
            label="Contacts"
            value={d.totalContacts}
            icon={ContactRound}
            context="Contacts créés sur la période"
          />
          <Metric
            label="Opportunities"
            value={d.totalOpportunities}
            icon={Target}
            context={`${d.openOpportunities} ouvertes`}
          />
          <Metric
            label="Pipeline estimé"
            value={formatCurrency(d.estimatedPipelineValue)}
            icon={CircleDollarSign}
            context="Valeur des opportunités ouvertes"
          />
          <Metric
            label="Valeur gagnée estimée"
            value={formatCurrency(d.estimatedWonValue)}
            icon={CheckCircle2}
            context={`${d.wonOpportunities} opportunités gagnées`}
          />
          <Metric
            label="Win Rate"
            value={`${d.winRate.toFixed(1)}%`}
            icon={Target}
            context={`${d.lostOpportunities} opportunités perdues`}
          />
          <Metric
            label="Tâches terminées"
            value={d.completedTasks}
            icon={ListTodo}
            context={`${d.pendingTasks} tâches en attente`}
          />
          <Metric
            label="Tâches en retard"
            value={d.overdueTasks}
            icon={Building2}
            context="Hors tâches annulées ou terminées"
          />
        </div>
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        <Chart
          title="Lead generation"
          subtitle="Leads créés par mois"
          className="xl:col-span-2"
        >
          <LineChart data={d.leadsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </Chart>
        <Chart title="Opportunities" subtitle="Répartition par statut">
          <PieChart>
            <Pie
              data={d.opportunitiesByStatus}
              dataKey="value"
              nameKey="label"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={3}
            >
              {d.opportunitiesByStatus.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Chart>
      </section>
      <section>
        <div className="mb-3">
          <h2 className="text-[15px] font-semibold">Pipeline performance</h2>
          <p className="text-[11px] text-text-tertiary">
            Étapes configurées dans votre pipeline actuel.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Chart
            title="Valeur estimée par étape"
            subtitle="Opportunités ouvertes et leur valeur estimée"
          >
            <BarChart data={d.pipelineByStage}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </Chart>
          <Chart title="Volume par étape" subtitle="Nombre réel d’opportunités">
            <BarChart data={d.pipelineByStage}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="var(--color-success-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </Chart>
        </div>
      </section>
      <section>
        <div className="mb-3">
          <h2 className="text-[15px] font-semibold">Lead & task analytics</h2>
          <p className="text-[11px] text-text-tertiary">
            Répartition des leads et suivi opérationnel des tâches.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Chart
            title="Leads par statut"
            subtitle="Distribution sur la période"
          >
            <BarChart data={d.leadsByStatus}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </Chart>
          <Chart title="Leads par source" subtitle="Canaux d'acquisition réels">
            <BarChart data={d.leadsBySource}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="var(--color-success-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </Chart>
          <Chart title="Task performance" subtitle="Tâches par statut">
            <BarChart data={d.tasksByStatus}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="var(--color-warning-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </Chart>
          <Chart
            title="Priorité des tâches"
            subtitle="Charge de travail à traiter"
          >
            <BarChart data={d.tasksByPriority}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="var(--color-warning-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </Chart>
        </div>
      </section>
    </div>
  );
}
