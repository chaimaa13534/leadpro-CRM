import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes.constants';

/** Legacy deep link kept for compatibility; editing is handled by the API-driven modal. */
export function EditOpportunityPage() { return <Navigate to={ROUTES.OPPORTUNITIES} replace />; }
