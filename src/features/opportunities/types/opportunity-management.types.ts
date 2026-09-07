export type OpportunityStatus = 'open' | 'won' | 'lost';

export interface OpportunityOption { id: number; name: string }
export interface OwnerOption { id: number; firstName: string; lastName: string; email: string; avatar: string | null }
export interface ContactOption { id: number; firstName: string; lastName: string; email: string | null; phone: string | null }
export interface PipelineOption { id: number; name: string }
export interface StageOption { id: number; pipelineId: number; name: string; position: number }

export interface ManagedOpportunity {
  id: number;
  company: OpportunityOption | null;
  contact: ContactOption | null;
  owner: OwnerOption;
  pipeline: PipelineOption | null;
  stage: (StageOption & { color: string | null; probability: number | null }) | null;
  probability: number;
  amount: number;
  expectedCloseDate: string | null;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ManagedOpportunitiesPage { items: ManagedOpportunity[]; total: number; page: number; limit: number; totalPages: number }
export interface ManagedOpportunitiesQuery {
  page: number; limit: number; search?: string; status?: OpportunityStatus; stage?: number;
  ownerId?: number; companyId?: number; pipelineId?: number; sort?: ManagedOpportunitiesSortField; order?: 'asc' | 'desc';
}
export type ManagedOpportunitiesSortField = 'company' | 'contact' | 'owner' | 'pipeline' | 'stage' | 'status' | 'value' | 'probability' | 'expected_close_date' | 'created_at' | 'updated_at';
export interface OpportunityInput { companyId: number; contactId?: number | null; ownerId: number; pipelineId: number; stageId: number; probability?: number; value?: number; expectedCloseDate?: string | null; status?: OpportunityStatus }
export type CreateManagedOpportunityInput = OpportunityInput;
export type UpdateManagedOpportunityInput = Partial<OpportunityInput>;
