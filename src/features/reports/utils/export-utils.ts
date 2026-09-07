/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — Real Export Utilities (PDF, Excel, CSV)
   ═════════════════════════════════════════════════════════════════════ */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { formatCurrency, formatNumber } from './report-helpers';

import type {
  KPI,
  RevenueData,
  SalesPerformance,
  PipelineAnalytics,
  LeadAnalytics,
  ContactAnalytics,
  OpportunityAnalytics,
  TeamAnalytics,
  TopCompany,
  TopSales,
  TopOpportunity,
  RecentActivity,
} from '@/features/reports/types';

/* ── Helpers ── */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

/* ═════════════════════════════════════════════════════════════════════
   PDF Export
   ═════════════════════════════════════════════════════════════════════ */

export function generatePDF(data: {
  kpis: KPI[];
  revenue: RevenueData | null;
  sales: SalesPerformance | null;
  pipeline: PipelineAnalytics | null;
  leads: LeadAnalytics | null;
  contacts: ContactAnalytics | null;
  opportunities: OpportunityAnalytics | null;
  team: TeamAnalytics | null;
  topCompanies: TopCompany[];
  topSales: TopSales[];
  topOpportunities: TopOpportunity[];
  activities: RecentActivity[];
}): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ── Title ──
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('LeadPro CRM — Rapport Commercial', margin, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Généré le ${formatDate()}`, margin, 30);
  doc.text('Période : 12 derniers mois', margin, 36);

  // ── KPI Summary ──
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Indicateurs Clés (KPI)', margin, 48);

  const kpiRows = data.kpis.map((kpi) => [
    kpi.label,
    kpi.value,
    `${kpi.change >= 0 ? '+' : ''}${kpi.change}%`,
    kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '─',
  ]);

  autoTable(doc, {
    startY: 54,
    head: [['Indicateur', 'Valeur', 'Variation', 'Tendance']],
    body: kpiRows,
    theme: 'grid',
    headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  let cursor = (doc as any).lastAutoTable.finalY + 10;

  // ── Revenue Data ──
  if (data.revenue) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Revenus', margin, cursor);
    cursor += 6;

    const revenueRows = data.revenue.monthly.slice(-24).map((m) => [
      m.label,
      formatCurrency(m.value),
      m.previous ? formatCurrency(m.previous) : '—',
      m.forecast ? formatCurrency(m.forecast) : '—',
    ]);

    autoTable(doc, {
      startY: cursor,
      head: [['Mois', 'Revenu', 'N-1', 'Prévision']],
      body: revenueRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
    cursor = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── Pipeline ──
  if (data.pipeline) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Pipeline Commercial', margin, cursor);
    cursor += 6;

    const pipelineRows = data.pipeline.stageDistribution.map((s) => [
      s.name,
      formatCurrency(s.value),
      `${s.percentage ?? 0}%`,
    ]);

    autoTable(doc, {
      startY: cursor,
      head: [['Étape', 'Valeur', 'Pourcentage']],
      body: pipelineRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
    cursor = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── Top Companies ──
  if (data.topCompanies.length > 0) {
    // Check if we need a new page
    if (cursor > 220) {
      doc.addPage();
      cursor = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Entreprises', margin, cursor);
    cursor += 6;

    const companyRows = data.topCompanies.map((c) => [
      c.name,
      c.industry,
      formatCurrency(c.revenue),
      c.deals.toString(),
      c.contacts.toString(),
    ]);

    autoTable(doc, {
      startY: cursor,
      head: [['Entreprise', 'Secteur', 'Revenu', 'Deals', 'Contacts']],
      body: companyRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
    cursor = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── Top Sales ──
  if (data.topSales.length > 0) {
    if (cursor > 220) {
      doc.addPage();
      cursor = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Commerciaux', margin, cursor);
    cursor += 6;

    const salesRows = data.topSales.map((s) => [
      s.name,
      formatCurrency(s.revenue),
      s.deals.toString(),
      `${s.conversionRate}%`,
      `${s.achievement}%`,
    ]);

    autoTable(doc, {
      startY: cursor,
      head: [['Commercial', 'Revenu', 'Deals', 'Conversion', 'Atteinte']],
      body: salesRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
    cursor = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── Top Opportunities ──
  if (data.topOpportunities.length > 0) {
    if (cursor > 220) {
      doc.addPage();
      cursor = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Opportunités', margin, cursor);
    cursor += 6;

    const oppRows = data.topOpportunities.map((o) => [
      o.name,
      o.companyName,
      formatCurrency(o.amount),
      o.stage,
      `${o.probability}%`,
      o.ownerName,
    ]);

    autoTable(doc, {
      startY: cursor,
      head: [['Opportunité', 'Entreprise', 'Montant', 'Phase', 'Probabilité', 'Responsable']],
      body: oppRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
    cursor = (doc as any).lastAutoTable.finalY + 10;
  }

  // ── Recent Activities ──
  if (data.activities.length > 0) {
    if (cursor > 220) {
      doc.addPage();
      cursor = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Activités Récentes', margin, cursor);
    cursor += 6;

    const activityRows = data.activities.slice(0, 15).map((a) => [
      a.title,
      a.description.substring(0, 50),
      new Date(a.timestamp).toLocaleDateString('fr-FR'),
      a.userName,
      a.amount ? formatCurrency(a.amount) : '—',
    ]);

    autoTable(doc, {
      startY: cursor,
      head: [['Titre', 'Description', 'Date', 'Utilisateur', 'Montant']],
      body: activityRows,
      theme: 'grid',
      headStyles: { fillColor: [99, 106, 241], fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      margin: { left: margin, right: margin },
    });
  }

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `LeadPro CRM — Page ${i} / ${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 8,
    );
  }

  // ── Download ──
  const pdfBlob = doc.output('blob');
  downloadBlob(pdfBlob, `leadpro-rapport-${Date.now()}.pdf`);
}

/* ═════════════════════════════════════════════════════════════════════
   Excel Export
   ═════════════════════════════════════════════════════════════════════ */

export function generateExcel(data: {
  kpis: KPI[];
  revenue: RevenueData | null;
  sales: SalesPerformance | null;
  pipeline: PipelineAnalytics | null;
  leads: LeadAnalytics | null;
  contacts: ContactAnalytics | null;
  opportunities: OpportunityAnalytics | null;
  team: TeamAnalytics | null;
  topCompanies: TopCompany[];
  topSales: TopSales[];
  topOpportunities: TopOpportunity[];
  activities: RecentActivity[];
}): void {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: KPIs ──
  const kpiSheetData = [
    ['Indicateur', 'Valeur', 'Variation (%)', 'Tendance'],
    ...data.kpis.map((kpi) => [kpi.label, kpi.value, kpi.change, kpi.trend]),
  ];
  const kpiSheet = XLSX.utils.aoa_to_sheet(kpiSheetData);
  XLSX.utils.book_append_sheet(wb, kpiSheet, 'KPIs');

  // ── Sheet 2: Revenue ──
  if (data.revenue) {
    const revenueSheetData = [
      ['Mois', 'Revenu', 'N-1', 'Prévision', 'Objectif'],
      ...data.revenue.monthly.map((m) => [
        m.label,
        m.value,
        m.previous ?? '',
        m.forecast ?? '',
        m.target ?? '',
      ]),
    ];
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData);
    XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenus');
  }

  // ── Sheet 3: Pipeline ──
  if (data.pipeline) {
    const pipelineSheetData = [
      ['Étape', 'Valeur', 'Pourcentage (%)'],
      ...data.pipeline.stageDistribution.map((s) => [s.name, s.value, s.percentage ?? 0]),
    ];
    const pipelineSheet = XLSX.utils.aoa_to_sheet(pipelineSheetData);
    XLSX.utils.book_append_sheet(wb, pipelineSheet, 'Pipeline');

    // Sheet 3b: Conversion rates
    const convSheetData = [
      ['Étape', 'Taux (%)'],
      ...data.pipeline.conversionRates.map((c) => [c.label, c.value]),
    ];
    const convSheet = XLSX.utils.aoa_to_sheet(convSheetData);
    XLSX.utils.book_append_sheet(wb, convSheet, 'Conversion');
  }

  // ── Sheet 4: Leads ──
  if (data.leads) {
    const leadsSheetData = [
      ['Source', 'Valeur', 'Pourcentage (%)'],
      ...data.leads.bySource.map((s) => [s.name, s.value, s.percentage ?? 0]),
    ];
    const leadsSheet = XLSX.utils.aoa_to_sheet(leadsSheetData);
    XLSX.utils.book_append_sheet(wb, leadsSheet, 'Leads');
  }

  // ── Sheet 5: Contacts ──
  if (data.contacts) {
    const contactsSheetData = [
      ['Pays', 'Valeur', 'Pourcentage (%)'],
      ...data.contacts.byCountry.map((c) => [c.name, c.value, c.percentage ?? 0]),
    ];
    const contactsSheet = XLSX.utils.aoa_to_sheet(contactsSheetData);
    XLSX.utils.book_append_sheet(wb, contactsSheet, 'Contacts');
  }

  // ── Sheet 6: Opportunities ──
  if (data.opportunities) {
    const oppSheetData = [
      ['Raison de perte', 'Valeur', 'Pourcentage (%)'],
      ...data.opportunities.lostReasons.map((r) => [r.name, r.value, r.percentage ?? 0]),
    ];
    const oppSheet = XLSX.utils.aoa_to_sheet(oppSheetData);
    XLSX.utils.book_append_sheet(wb, oppSheet, 'Opportunités');
  }

  // ── Sheet 7: Team ──
  if (data.team) {
    const teamSheetData = [
      ['Nom', 'Revenu', 'Deals', 'Conversion (%)', 'Taille Moyenne', 'Objectif', 'Atteinte (%)', 'Tendance'],
      ...data.team.members.map((m) => [
        m.name,
        m.revenue,
        m.deals,
        m.conversionRate,
        m.avgDealSize,
        m.target,
        m.achievement,
        m.trend,
      ]),
    ];
    const teamSheet = XLSX.utils.aoa_to_sheet(teamSheetData);
    XLSX.utils.book_append_sheet(wb, teamSheet, 'Équipe');
  }

  // ── Sheet 8: Top Companies ──
  if (data.topCompanies.length > 0) {
    const companiesSheetData = [
      ['Entreprise', 'Secteur', 'Revenu', 'Deals', 'Contacts'],
      ...data.topCompanies.map((c) => [c.name, c.industry, c.revenue, c.deals, c.contacts]),
    ];
    const companiesSheet = XLSX.utils.aoa_to_sheet(companiesSheetData);
    XLSX.utils.book_append_sheet(wb, companiesSheet, 'Top Entreprises');
  }

  // ── Sheet 9: Top Sales ──
  if (data.topSales.length > 0) {
    const topSalesSheetData = [
      ['Commercial', 'Revenu', 'Deals', 'Conversion (%)', 'Atteinte (%)'],
      ...data.topSales.map((s) => [s.name, s.revenue, s.deals, s.conversionRate, s.achievement]),
    ];
    const topSalesSheet = XLSX.utils.aoa_to_sheet(topSalesSheetData);
    XLSX.utils.book_append_sheet(wb, topSalesSheet, 'Top Commerciaux');
  }

  // ── Sheet 10: Activities ──
  if (data.activities.length > 0) {
    const activitiesSheetData = [
      ['Titre', 'Description', 'Date', 'Utilisateur', 'Montant'],
      ...data.activities.map((a) => [
        a.title,
        a.description,
        new Date(a.timestamp).toISOString(),
        a.userName,
        a.amount ?? '',
      ]),
    ];
    const activitiesSheet = XLSX.utils.aoa_to_sheet(activitiesSheetData);
    XLSX.utils.book_append_sheet(wb, activitiesSheet, 'Activités');
  }

  // ── Download ──
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const excelBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(excelBlob, `leadpro-rapport-${Date.now()}.xlsx`);
}

/* ═════════════════════════════════════════════════════════════════════
   CSV Export
   ═════════════════════════════════════════════════════════════════════ */

export function generateCSV(data: {
  topCompanies: TopCompany[];
  topSales: TopSales[];
  topOpportunities: TopOpportunity[];
  activities: RecentActivity[];
}): void {
  const rows: string[][] = [];

  // Header section
  rows.push(['LeadPro CRM — Export CSV']);
  rows.push([`Généré le ${formatDate()}`]);
  rows.push(['']);

  // ── Top Companies ──
  rows.push(['=== Top Entreprises ===']);
  rows.push(['Entreprise', 'Secteur', 'Revenu', 'Deals', 'Contacts']);
  data.topCompanies.forEach((c) => {
    rows.push([c.name, c.industry, String(c.revenue), String(c.deals), String(c.contacts)]);
  });
  rows.push(['']);

  // ── Top Sales ──
  rows.push(['=== Top Commerciaux ===']);
  rows.push(['Commercial', 'Revenu', 'Deals', 'Conversion (%)', 'Atteinte (%)']);
  data.topSales.forEach((s) => {
    rows.push([s.name, String(s.revenue), String(s.deals), String(s.conversionRate), String(s.achievement)]);
  });
  rows.push(['']);

  // ── Top Opportunities ──
  rows.push(['=== Top Opportunités ===']);
  rows.push(['Opportunité', 'Entreprise', 'Montant', 'Phase', 'Probabilité (%)', 'Responsable']);
  data.topOpportunities.forEach((o) => {
    rows.push([o.name, o.companyName, String(o.amount), o.stage, String(o.probability), o.ownerName]);
  });
  rows.push(['']);

  // ── Activities ──
  rows.push(['=== Activités Récentes ===']);
  rows.push(['Titre', 'Description', 'Date', 'Utilisateur', 'Montant']);
  data.activities.forEach((a) => {
    rows.push([
      a.title,
      a.description,
      new Date(a.timestamp).toLocaleDateString('fr-FR'),
      a.userName,
      a.amount ? String(a.amount) : '',
    ]);
  });

  // ── Convert to CSV string ──
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if cell contains comma or quote
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(','),
    )
    .join('\n');

  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(csvBlob, `leadpro-rapport-${Date.now()}.csv`);
}

