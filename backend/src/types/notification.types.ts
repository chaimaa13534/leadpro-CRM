export interface Notification { id: number; type: string; title: string; message: string; entityType: string | null; entityId: number | null; isRead: boolean; readAt: Date | null; createdAt: Date }
export interface NotificationQuery { page: number; limit: number; unread?: boolean; type?: string; entityType?: string; order: 'asc' | 'desc' }
