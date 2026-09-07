/**
 * Backend domain types for the real opportunities table.
 *
 * The MySQL schema exposes `opportunities` with relations to companies,
 * contacts, users, pipelines and pipeline_stages. The legacy UI names were
 * built around a mock-only shape; this file mirrors what the DB already stores.
 */

export type OpportunityStatus = 'open' | 'won' | 'lost';

export interface OpportunityRow {
  id: number;
  company_id: number;
  contact_id: number | null;
  owner_id: number;
  pipeline_id: number;
  pipeline_stage_id: number;
  probability: number;
  value: number;
  expected_close_date: string | null;
  status: OpportunityStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface OpportunityWithRelations {
  id: number;
  company_id: number;
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
  pipeline_id: number;
  pipeline_name: string;
  pipeline_description: string | null;
  stage_id: number;
  stage_name: string;
  stage_position: number;
  stage_color: string | null;
  stage_probability: number | null;
  probability: number;
  value: number;
  expected_close_date: string | null;
  status: OpportunityStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface PublicOpportunity {
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
  pipeline: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  stage: {
    id: number;
    name: string;
    position: number;
    color: string | null;
    probability: number | null;
  } | null;
  probability: number;
  amount: number;
  expectedCloseDate: string | null;
  status: OpportunityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOpportunityInput {
  companyId: number;
  contactId?: number | null;
  ownerId: number;
  pipelineId: number;
  stageId: number;
  probability?: number;
  value?: number;
  expectedCloseDate?: string | null;
  status?: OpportunityStatus;
}

export interface UpdateOpportunityInput {
  companyId?: number;
  contactId?: number | null;
  ownerId?: number;
  pipelineId?: number;
  stageId?: number;
  probability?: number;
  value?: number;
  expectedCloseDate?: string | null;
  status?: OpportunityStatus;
}

export interface OpportunityListQuery {
  page: number;
  limit: number;
  search?: string;
  status?: OpportunityStatus;
  stage?: number;
  ownerId?: number;
  companyId?: number;
  contactId?: number;
  pipelineId?: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

export interface OpportunityPipelineOption {
  id: number;
  name: string;
}

export interface OpportunityStageOption {
  id: number;
  pipelineId: number;
  name: string;
  position: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
