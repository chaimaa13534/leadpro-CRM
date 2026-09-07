import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes.constants';

/** Legacy deep link kept for compatibility; details are displayed from the API-driven list. */
export function OpportunityDetailsPage() { return <Navigate to={ROUTES.OPPORTUNITIES} replace />; }
