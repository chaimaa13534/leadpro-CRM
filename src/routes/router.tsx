import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, AuthLayout } from '@/layouts';
import {
  LeadsPage,
  NewLeadPage,
  LeadDetailsPage,
  ContactsPage,
  NewContactPage,
  ContactDetailsPage,
  EditContactPage,
  CompaniesPage,
  NewCompanyPage,
  CompanyDetailsPage,
  EditCompanyPage,
  OpportunitiesPage,
  NewOpportunityPage,
  OpportunityDetailsPage,
  EditOpportunityPage,
  PipelinePage,
  TasksPage,
  ReportsPage,
  SettingsPage,
CalendarPage,
  NotificationsPage,
  ActivityCenterPage,
  UsersPage,
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  NotFoundPage,
  ForbiddenPage,
  ServerErrorPage,
} from '@/pages';
import { ROUTES } from '@/lib/constants/routes.constants';
import { LazyDashboardPage } from '@/routes/LazyDashboardPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import { AdminRoute } from '@/routes/AdminRoute';
import { DashboardSkeleton } from '@/components/ui/DashboardSkeleton';
import { settingsRoutes } from '@/routes/settings-routes';

/**
 * Arborescence de routage de l'application.
 *
 * - Les routes sous `MainLayout` représentent l'application authentifiée,
 *   protégées par `ProtectedRoute` (redirige vers `/login` sans session).
 * - Les routes sous `AuthLayout` sont protégées par `PublicRoute`
 *   (redirige vers le Dashboard si une session existe déjà).
 * - `/403` et `/500` sont des routes directement navigables (utiles pour
 *   les tester) en plus d'être les cibles naturelles d'une future
 *   redirection programmatique (droits insuffisants, erreur réseau…).
 * - Les routes /settings/* sont lazy-loadées via settings-routes.tsx.
 * - Chaque page métier reste un composant minimal (voir `src/pages/`) ;
 *   aucun design n'est développé ici hormis l'authentification.
 */
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<DashboardSkeleton />}>
                <LazyDashboardPage />
              </Suspense>
            ),
          },
          { path: ROUTES.LEADS, element: <LeadsPage /> },
          { path: ROUTES.NEW_LEAD, element: <NewLeadPage /> },
          { path: ROUTES.LEAD_DETAILS, element: <LeadDetailsPage /> },
          { path: ROUTES.CONTACTS, element: <ContactsPage /> },
          { path: ROUTES.NEW_CONTACT, element: <NewContactPage /> },
          { path: ROUTES.CONTACT_DETAILS, element: <ContactDetailsPage /> },
          { path: ROUTES.EDIT_CONTACT, element: <EditContactPage /> },
          { path: ROUTES.COMPANIES, element: <CompaniesPage /> },
          { path: ROUTES.NEW_COMPANY, element: <NewCompanyPage /> },
          { path: ROUTES.COMPANY_DETAILS, element: <CompanyDetailsPage /> },
          { path: ROUTES.EDIT_COMPANY, element: <EditCompanyPage /> },
          { path: ROUTES.OPPORTUNITIES, element: <OpportunitiesPage /> },
          { path: ROUTES.NEW_OPPORTUNITY, element: <NewOpportunityPage /> },
          { path: ROUTES.OPPORTUNITY_DETAILS, element: <OpportunityDetailsPage /> },
          { path: ROUTES.EDIT_OPPORTUNITY, element: <EditOpportunityPage /> },
          { path: ROUTES.PIPELINE, element: <PipelinePage /> },
          { path: ROUTES.TASKS, element: <TasksPage /> },
          { path: ROUTES.CALENDAR, element: <CalendarPage /> },
{ path: ROUTES.REPORTS, element: <ReportsPage /> },
          { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
          { path: ROUTES.ACTIVITY, element: <ActivityCenterPage /> },
          {
            element: <AdminRoute />,
            children: [{ path: ROUTES.USERS, element: <UsersPage /> }],
          },
          {
            path: ROUTES.SETTINGS,
            element: (
              <Suspense fallback={<DashboardSkeleton />}>
                <SettingsPage />
              </Suspense>
            ),
            children: settingsRoutes,
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
  { path: ROUTES.SERVER_ERROR, element: <ServerErrorPage /> },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
]);
