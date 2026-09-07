// `DashboardPage` est volontairement absente de ce barrel : elle est
// chargée en lazy loading (voir `@/routes/LazyDashboardPage`) car elle
// embarque Recharts. La réexporter ici créerait un chemin d'import
// statique qui annulerait le découpage de code. Importer directement
// `@/pages/DashboardPage` si un accès non-lazy est un jour nécessaire.
export * from '@/pages/LeadsPage';
export * from '@/pages/NewLeadPage';
export * from '@/pages/LeadDetailsPage';
export * from '@/pages/ContactsPage';
export * from '@/pages/NewContactPage';
export * from '@/pages/ContactDetailsPage';
export * from '@/pages/EditContactPage';
export * from '@/pages/CompaniesPage';
export * from '@/pages/NewCompanyPage';
export * from '@/pages/CompanyDetailsPage';
export * from '@/pages/EditCompanyPage';
export * from '@/pages/OpportunitiesPage';
export * from '@/pages/NewOpportunityPage';
export * from '@/pages/OpportunityDetailsPage';
export * from '@/pages/EditOpportunityPage';
export * from '@/pages/PipelinePage';
export * from '@/pages/TasksPage';
export * from '@/pages/ReportsPage';
export * from '@/pages/SettingsPage';
export * from '@/pages/CalendarPage';
export * from '@/pages/NotificationsPage';
export * from '@/pages/ActivityCenterPage';
export * from '@/pages/UsersPage';
export * from '@/pages/LoginPage';
export * from '@/pages/ForgotPasswordPage';
export * from '@/pages/ResetPasswordPage';
export * from '@/pages/NotFoundPage';
export * from '@/pages/ForbiddenPage';
export * from '@/pages/ServerErrorPage';
