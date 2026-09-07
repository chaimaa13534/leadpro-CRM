import { useMemo, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Building2, CheckSquare, CircleDollarSign, ContactRound, Plus, RefreshCw, Target, UsersRound } from 'lucide-react';
import { Button, Card, Select, Skeleton } from '@/components/ui';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { getReportOverview } from '@/features/reports/services/report-api.service';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/routes.constants';
import { formatCurrency } from '@/utils/formatCurrency';

/**
 * Page Dashboard — utilise `MainLayout` (via le routeur, voir
 * `src/routes/router.tsx`). Toutes les données affichées sont simulées
 * (voir `src/mocks/`) ; aucun appel service réel n'a lieu ici.
 *
 * Ordre de la page conforme au brief : Header → KPI → Graphiques →
 * Pipeline → Activités → Tâches → Calendrier → Derniers Leads.
 */
export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');
  const range = useMemo(() => getRange(period), [period]);
  const overview = useQuery({ queryKey: ['dashboard', 'overview', range], queryFn: () => getReportOverview(range.from, range.to), staleTime: 30_000 });

  if (overview.isLoading) return <DashboardSkeleton />;
  if (overview.isError || !overview.data) return <Card className="p-8 text-center"><h1 className="text-lg font-semibold text-text-primary">Impossible de charger le Dashboard.</h1><Button className="mt-4" onClick={() => overview.refetch()}>Réessayer</Button></Card>;
  const data = overview.data;
  const kpis = [
    [Target, 'Total Leads', data.totalLeads, 'Leads enregistrés'], [ContactRound, 'Total Contacts', data.totalContacts, 'Contacts enregistrés'], [Building2, 'Total Companies', data.totalCompanies, 'Entreprises enregistrées'], [UsersRound, 'Total Opportunities', data.totalOpportunities, 'Opportunités enregistrées'], [CircleDollarSign, 'Pipeline Value', formatCurrency(data.estimatedPipelineValue), 'Valeur estimée ouverte'], [CircleDollarSign, 'Won Opportunities', data.wonOpportunities, `Valeur estimée : ${formatCurrency(data.estimatedWonValue)}`], [CheckSquare, 'Pending Tasks', data.pendingTasks, 'Tâches à effectuer'], [CheckSquare, 'Overdue Tasks', data.overdueTasks, 'Tâches non terminées en retard'],
  ] as const;
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-accent">Dashboard</p><h1 className="mt-1 text-2xl font-semibold text-text-primary">Bonjour, {user?.firstName ?? ''}</h1><p className="mt-1 text-sm text-text-secondary">Voici un aperçu de l’activité de votre CRM.</p></div><div className="flex gap-2"><Select value={period} onChange={(event) => setPeriod(event.target.value)} options={[{value:'today',label:"Aujourd’hui"},{value:'week',label:'Cette semaine'},{value:'month',label:'Ce mois'},{value:'lastMonth',label:'Mois dernier'},{value:'year',label:'Cette année'}]} /><Button variant="secondary" leadingIcon={<RefreshCw className="size-4" />} onClick={() => overview.refetch()}>Actualiser</Button></div></header>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([Icon, label, value, description]) => <Card key={label} interactive><CardContent className="p-4"><div className="flex items-start justify-between"><span className="rounded-lg bg-accent-subtle p-2 text-accent"><Icon className="size-4" /></span></div><p className="mt-4 text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p><p className="mt-1 text-2xl font-semibold text-text-primary">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</p><p className="mt-1 text-xs text-text-tertiary">{description}</p></CardContent></Card>)}</section>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2"><ChartCard title="Pipeline Overview" description="Opportunités et valeur estimée par étape"><BarChart data={data.pipelineByStage}><CartesianGrid vertical={false} stroke="var(--color-border)" /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="count" name="Opportunités" fill="var(--color-accent)" radius={[4,4,0,0]} /><Bar dataKey="value" name="Valeur estimée" fill="var(--color-success-400)" radius={[4,4,0,0]} /></BarChart></ChartCard><ChartCard title="Leads Overview" description="Leads créés sur la période"><BarChart data={data.leadsOverTime}><CartesianGrid vertical={false} stroke="var(--color-border)" /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="value" name="Leads" fill="var(--color-accent)" radius={[4,4,0,0]} /></BarChart></ChartCard><ChartCard title="Opportunity Overview" description="Répartition des opportunités"><PieChart><Pie data={data.opportunitiesByStatus} dataKey="value" nameKey="label" outerRadius={88}>{data.opportunitiesByStatus.map((item,index)=><Cell key={item.label} fill={['#7785f5','#22c55e','#ef4444'][index % 3]} />)}</Pie><Tooltip /></PieChart></ChartCard><ChartCard title="Task Overview" description="État des tâches de la période"><BarChart data={data.tasksByStatus}><CartesianGrid vertical={false} stroke="var(--color-border)" /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="value" name="Tâches" fill="var(--color-warning-400)" radius={[4,4,0,0]} /></BarChart></ChartCard></section>
      <Card><CardHeader><CardTitle>Quick Actions</CardTitle><CardDescription>Accès aux actions CRM principales.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2 pb-5">{[[ROUTES.NEW_LEAD,'Nouveau lead'],[ROUTES.NEW_CONTACT,'Nouveau contact'],[ROUTES.NEW_COMPANY,'Nouvelle entreprise'],[ROUTES.NEW_OPPORTUNITY,'Nouvelle opportunité']].map(([route,label])=><Button key={route} variant="secondary" leadingIcon={<Plus className="size-4" />} onClick={()=>{ if (route) navigate(route); }}>{label}</Button>)}</CardContent></Card>
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: ReactElement }) { return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><div className="h-72 px-3 pb-4"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></Card>; }
function DashboardSkeleton() { return <div className="space-y-6"><Skeleton className="h-20 w-full" /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:8},(_,i)=><Skeleton key={i} className="h-40 rounded-xl" />)}</div></div>; }
function getRange(period: string) { const now = new Date(); const end = new Date(now); const start = new Date(now); if(period==='today'){} else if(period==='week') start.setDate(now.getDate()-6); else if(period==='month') start.setDate(1); else if(period==='lastMonth'){start.setMonth(now.getMonth()-1,1); end.setDate(0);} else start.setMonth(0,1); return {from:start.toISOString().slice(0,10),to:end.toISOString().slice(0,10)}; }
