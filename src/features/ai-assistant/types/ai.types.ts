/* ═════════════════════════════════════════════════════════════════════
   AI Assistant — Strict Types
   ═════════════════════════════════════════════════════════════════════ */

import type { ID, ISODateString } from '@/types/common.types';

/* ── Roles ── */
export type AIMessageRole = 'user' | 'assistant';

/* ── Processing States ── */
export type AIProcessingState =
  | 'idle'
  | 'thinking'
  | 'analyzing'
  | 'generating'
  | 'complete'
  | 'error';

/* ── Response Types ── */
export type AIResponseType =
  | 'text'
  | 'list'
  | 'table'
  | 'kpi'
  | 'chart'
  | 'opportunity'
  | 'lead'
  | 'recommendation'
  | 'email_draft'
  | 'analysis';

/* ── Message Actions ── */
export interface AIMessageActions {
  copied: boolean;
  liked: boolean | null;
  disliked: boolean | null;
}

/* ── Message ── */
export interface AIMessage {
  id: ID;
  role: AIMessageRole;
  content: string;
  timestamp: ISODateString;
  responseType?: AIResponseType;
  metadata?: AIMessageMetadata;
  actions?: AIMessageActions;
}

export interface AIMessageMetadata {
  tokens?: number;
  processingTime?: number;
  sources?: AIContextSource[];
  thinkingSteps?: string[];
}

/* ── Conversation ── */
export interface AIConversation {
  id: ID;
  title: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  messages: AIMessage[];
  messageCount: number;
  context?: AIContextSource[];
}

/* ── Context Sources ── */
export type AIContextSourceType =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'opportunities'
  | 'pipeline'
  | 'calendar'
  | 'tasks'
  | 'reports';

export interface AIContextSource {
  type: AIContextSourceType;
  label: string;
  count: number;
  active: boolean;
}

/* ── Insight ── */
export type AIInsightPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AIInsight {
  id: ID;
  icon: string;
  title: string;
  description: string;
  priority: AIInsightPriority;
  action: string;
  category: string;
  createdAt: ISODateString;
}

/* ── Quick Action ── */
export interface AIQuickAction {
  id: ID;
  label: string;
  description: string;
  icon: string;
  action: string;
}

/* ── Suggested Prompt ── */
export interface AISuggestedPrompt {
  id: ID;
  text: string;
  category: string;
  icon?: string;
}

/* ── Email Draft ── */
export interface AIEmailDraft {
  id: ID;
  contactId: ID;
  contactName: string;
  purpose: string;
  tone: string;
  language: string;
  length: string;
  subject: string;
  body: string;
  createdAt: ISODateString;
}

/* ── Lead Analysis ── */
export interface AILeadAnalysis {
  id: ID;
  leadId: ID;
  leadName: string;
  score: number;
  conversionProbability: number;
  recommendedAction: string;
  potentialValue: number;
  risk: 'low' | 'medium' | 'high';
  reasoning: string;
  createdAt: ISODateString;
}

/* ── Opportunity Analysis ── */
export interface AIOpportunityAnalysis {
  id: ID;
  opportunityId: ID;
  opportunityName: string;
  companyName: string;
  value: number;
  probability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  expectedOutcome: string;
  explanation: string;
  createdAt: ISODateString;
}

/* ── Pipeline Analysis ── */
export interface AIPipelineAnalysis {
  id: ID;
  totalPipeline: number;
  forecast: number;
  winRate: number;
  atRiskDeals: number;
  atRiskValue: number;
  concentration: string;
  recommendations: string[];
  createdAt: ISODateString;
}

/* ── Recommendation ── */
export interface AIRecommendation {
  id: ID;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: string;
  action: string;
}

/* ── AI KPI Data ── */
export interface AIKpiData {
  label: string;
  value: string;
  change?: number;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}

/* ── Email Generator Params ── */
export interface AIEmailGeneratorParams {
  contactId: ID;
  contactName: string;
  purpose: 'follow_up' | 'proposal' | 'meeting' | 'introduction' | 'thank_you' | 'reminder';
  tone: 'professional' | 'friendly' | 'formal' | 'casual';
  language: 'english' | 'french' | 'arabic';
  length: 'short' | 'medium' | 'long';
}

/* ── Service Response ── */
export interface AIServiceResponse<T = string> {
  success: boolean;
  data: T;
  processingTime: number;
  thinkingSteps?: string[];
}

/* ── Chat State ── */
export interface AIChatState {
  conversations: AIConversation[];
  currentConversationId: ID | null;
  processingState: AIProcessingState;
  error: string | null;
}

/* ── AI Assistant Preferences ── */
export interface AIAssistantPreferences {
  suggestedPromptsEnabled: boolean;
  autoScroll: boolean;
  enterToSend: boolean;
  language: 'english' | 'french' | 'arabic';
}

