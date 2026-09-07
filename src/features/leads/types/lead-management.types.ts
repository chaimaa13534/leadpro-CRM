/**
 * Types for the Leads management module.
 *
 * These mirror the backend `PublicLead` / `PaginatedResult` shapes exposed
 * by the `/api/leads` endpoints. A lead's identity and contact details come
 * from the linked `contact`; company, source and owner are embedded as
 * nested objects.
 *
 * NOTE: The status/priority values mirror the `leads` table ENUMs
 * (new, contacted, qualified, proposal, won, lost) which differ from the
 * older mock-only `src/types/lead.types.ts` so we define them locally here.
 */

/** Allowed lead status values (mirrors the DB ENUM). */
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'won'
  | 'lost';

/** Allowed lead priority values (mirrors the DB ENUM). */
export type LeadPriority = 'low' | 'medium' | 'high';

/** Company summary embedded in a lead payload. */
export interface LeadCompanySummary {
  id: number;
  name: string;
}

/** Contact summary embedded in a lead payload. */
export interface LeadContactSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
}

/** Owner summary embedded in a lead payload. */
export interface LeadOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

/** Source summary embedded in a lead payload. */
export interface LeadSourceSummary {
  id: number;
  name: string;
}

/** Public shape of a lead returned by the backend API. */
export interface ManagedLead {
  id: number;
  company: LeadCompanySummary | null;
  contact: LeadContactSummary | null;
  owner: LeadOwner;
  source: LeadSourceSummary | null;
  status: LeadStatus;
  priority: LeadPriority;
  estimatedValue: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Pagination envelope returned by `GET /api/leads`. */
export interface ManagedLeadsPage {
  items: ManagedLead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query parameters for `GET /api/leads`. */
export interface ManagedLeadsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  sourceId?: number;
  ownerId?: number;
  companyId?: number;
  sort?: ManagedLeadsSortField;
  order?: 'asc' | 'desc';
}

export type ManagedLeadsSortField =
  | 'company'
  | 'contact'
  | 'owner'
  | 'source'
  | 'status'
  | 'priority'
  | 'estimated_value'
  | 'created_at'
  | 'updated_at';

/** Input payload for `POST /api/leads`. */
export interface CreateManagedLeadInput {
  ownerId: number;
  companyId?: number;
  contactId?: number;
  sourceId?: number;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValue?: number;
  notes?: string;
}

/** Input payload for `PUT /api/leads/:id`. */
export interface UpdateManagedLeadInput {
  ownerId?: number;
  companyId?: number;
  contactId?: number;
  sourceId?: number;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValue?: number;
  notes?: string;
}

/** Lightweight user option used to populate owner selects. */
export interface OwnerOption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

/** A lead source option used to populate filters and selects. */
export interface LeadSourceOption {
  id: number;
  name: string;
}
