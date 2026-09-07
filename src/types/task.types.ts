import type { ID, ISODateString } from '@/types/common.types';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskRelatedEntity = 'lead' | 'contact' | 'company' | 'opportunity';

export interface TaskTag {
  id: ID;
  name: string;
  color: string;
}

export interface TaskComment {
  id: ID;
  authorId: ID;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: ISODateString;
}

export interface TaskDocument {
  id: ID;
  name: string;
  url: string;
  type: 'file' | 'link';
  uploadedAt: ISODateString;
}

export interface Subtask {
  id: ID;
  title: string;
  completed: boolean;
  createdAt: ISODateString;
}

export interface TaskActivity {
  id: ID;
  type: 'created' | 'updated' | 'status_change' | 'comment' | 'assigned';
  actorName: string;
  description: string;
  timestamp: ISODateString;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: ISODateString;
  assigneeId: ID;
  assigneeName?: string;
  relatedEntity?: TaskRelatedEntity;
  relatedEntityId?: ID;
  relatedEntityName?: string;
  tags: TaskTag[];
  comments: TaskComment[];
  documents: TaskDocument[];
  subtasks: Subtask[];
  activities: TaskActivity[];
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface TaskFilters {
  assigneeId: ID | null;
  companyId: ID | null;
  contactId: ID | null;
  opportunityId: ID | null;
  priority: TaskPriority | null;
  status: TaskStatus | null;
  relatedEntity: TaskRelatedEntity | null;
  searchQuery: string;
  dueDateFrom: ISODateString | null;
  dueDateTo: ISODateString | null;
}

export type TaskBoardColumn = 'overdue' | 'today' | 'this_week' | 'done';

