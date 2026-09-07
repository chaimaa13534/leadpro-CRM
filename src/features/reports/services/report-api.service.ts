const KEY = 'leadpro-crm:session';
type Envelope<T> = { success: true; data: T };
export interface ReportOverview {
  totalLeads: number;
  totalContacts: number;
  totalCompanies: number;
  totalOpportunities: number;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  estimatedPipelineValue: number;
  estimatedWonValue: number;
  winRate: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  leadsOverTime: { label: string; value: number }[];
  leadsByStatus: { label: string; value: number }[];
  leadsBySource: { label: string; value: number }[];
  opportunitiesByStatus: { label: string; value: number }[];
  pipelineByStage: { label: string; count: number; value: number }[];
  tasksByStatus: { label: string; value: number }[];
  tasksByPriority: { label: string; value: number }[];
  performance: {
    id: number;
    name: string;
    leads: number;
    opportunities: number;
    won: number;
    lost: number;
    estimatedPipelineValue: number;
    estimatedWonValue: number;
    completedTasks: number;
  }[];
}
function headers(): Record<string, string> {
  try {
    const t = (
      JSON.parse(localStorage.getItem(KEY) ?? '{}') as { accessToken?: string }
    ).accessToken;
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
}
export async function getReportOverview(from: string, to: string) {
  const r = await fetch(`/api/reports/overview?from=${from}&to=${to}`, {
    headers: headers(),
  });
  const b = (await r.json()) as Envelope<ReportOverview>;
  if (!r.ok || !b.success)
    throw new Error('Impossible de charger les analytics.');
  return b.data;
}
