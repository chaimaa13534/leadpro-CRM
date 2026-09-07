/**
 * Domain types for the leads module.
 *
 * These mirror the `leads` table in the database plus the joined company,
 * contact, source (lead_sources) and owner (user) so the frontend can
 * display the names without exposing internal foreign keys.
 *
 * NOTE: The `leads` table has no first_name / email / phone columns. A
 * lead's identity and contact details come from the linked `contact`.
 */

/** Raw row shape of the `leads` table. */
export interface LeadRow {
  id: number;
  company_id: number | null;
  contact_id: number | null;
  owner_id: number;
  source_id: number | null;
  status: LeadStatus;
  priority: LeadPriority;
  estimated_value: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

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

/** A lead joined with company, contact, source and owner (user). */
export interface LeadWithRelations {
  id: number;
  company_id: number | null;
  company_name: string | null;
  contact_id: number | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  owner_email: string;
  owner_avatar: string | null;
  source_id: number | null;
  source_name: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  estimated_value: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Public shape of a lead returned by the API. Never exposes internal
 * foreign keys or the raw joined columns.
 */
export interface PublicLead {
  id: number;
  company: {
    id: number;
    name: string;
  } | null;
  contact: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
  } | null;
  owner: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  source: {
    id: number;
    name: string;
  } | null;
  status: LeadStatus;
  priority: LeadPriority;
  estimatedValue: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Input payload for `POST /api/leads`. */
export interface CreateLeadInput {
  companyId?: number;
  contactId?: number;
  ownerId: number;
  sourceId?: number;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValue?: number;
  notes?: string;
}

/** Input payload for `PUT /api/leads/:id`. */
export interface UpdateLeadInput {
  companyId?: number;
  contactId?: number;
  ownerId?: number;
  sourceId?: number;
  status?: LeadStatus;
  priority?: LeadPriority;
  estimatedValue?: number;
  notes?: string;
}

/** Normalized list query parameters for `GET /api/leads`. */
export interface LeadListQuery {
  page: number;
  limit: number;
  search?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  sourceId?: number;
  ownerId?: number;
  companyId?: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

/** A lead source option used to populate filters and selects. */
export interface LeadSourceOption {
  id: number;
  name: string;
}

/** Generic pagination envelope used by the list endpoint. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

