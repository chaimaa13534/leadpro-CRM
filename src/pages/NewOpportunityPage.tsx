import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes.constants';

/** Legacy deep link kept for compatibility; Opportunities now uses its API modal. */
export function NewOpportunityPage() { return <Navigate to={ROUTES.OPPORTUNITIES} replace />; }
