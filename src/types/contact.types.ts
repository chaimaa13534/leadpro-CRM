import type { ID, ISODateString } from '@/types/common.types';

export type ContactStatus = 'active' | 'inactive' | 'vip';

export interface Contact {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  company?: string;
  companyId?: ID;
  avatarUrl?: string;
  ownerId: ID;
  notes?: string;
  tags?: string[];
  linkedIn?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  status: ContactStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastActivityAt?: ISODateString;
}
