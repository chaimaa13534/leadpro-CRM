/**
 * AI Assistant — Mock Service
 *
 * Service de simulation d'IA. Remplace un appel API réel.
 * Conçu pour être remplacé ultérieurement par une vraie API AI
 * sans modifier l'interface des composants.
 */

import type {
  AIEmailDraft,
  AIEmailGeneratorParams,
  AIKpiData,
  AILeadAnalysis,
  AIOpportunityAnalysis,
  AIPipelineAnalysis,
  AIRecommendation,
  AIServiceResponse,
  AIInsight,
  AIConversation,
  AIMessage,
  AIContextSource,
} from '../types/ai.types';
import { generateId } from '@/utils/generateId';
import { simulateRequest } from '@/lib/simulate-request';
import {
  aiConversationsMock,
  aiInsightsMock,
  aiRecommendationsMock,
  aiEmailDraftsMock,
  aiLeadAnalysisMock,
  aiOpportunityAnalysisMock,
  aiPipelineAnalysisMock,
  aiKpiDataMock,
  aiContextSourcesMock,
} from '../mocks';

/* ── Keyword-based response generation ── */

const KEYWORD_RESPONSES: Array<{
  keywords: string[];
  response: string;
  thinkingSteps: string[];
}> = [
  {
    keywords: ['pipeline', 'summary', 'overview'],
    response:
      "## Pipeline Overview\n\nBased on the simulated CRM data, your pipeline currently has **89 open opportunities** with a total value of **€4.2M**.\n\n| Stage | Count | Value |\n|-------|-------|-------|\n| Prospecting | 24 | €720K |\n| Qualification | 31 | €1.1M |\n| Proposal | 18 | €1.4M |\n| Negotiation | 16 | €980K |\n\n> **Recommendation**: Focus on the 4 high-value deals in the negotiation stage that have >75% probability.",
    thinkingSteps: [
      'Accessing CRM pipeline data…',
      'Analyzing 89 open opportunities…',
      'Calculating stage distribution…',
      'Identifying high-probability deals…',
    ],
  },
  {
    keywords: ['lead', 'today', 'contact'],
    response:
      "Here are **5 leads** that require follow-up today:\n\n1. **Nour El Amrani** — Atlas Textile — High priority — Last contact 7 days ago\n2. **Yassine Bennani** — Nour Cosmétiques — Medium priority — New lead\n3. **Sara Idrissi** — Groupe Kawtar — High priority — Meeting requested\n4. **Omar Chraibi** — Sanad Pharma — Medium priority — Follow-up overdue\n5. **Rania Fassi** — Fassi Consulting — High priority — Proposal sent\n\n> ✅ I recommend starting with Nour El Amrani as they have the highest conversion probability.",
    thinkingSteps: [
      'Scanning lead database for follow-up candidates…',
      'Checking last contact dates…',
      'Cross-referencing lead scores and priorities…',
    ],
  },
  {
    keywords: ['opportunity', 'opportunities', 'best', 'top'],
    response:
      "Here are your **top 5 opportunities** ranked by value and probability:\n\n1. **Déploiement CRM Atlassian** — €750K — 85% — OCP Group\n2. **Infrastructure Cloud AWS** — €500K — 72% — Attijariwafa Bank\n3. **Solution Data Warehouse** — €350K — 68% — Royal Air Maroc\n4. **Audit Sécurité Réseau** — €200K — 91% — Managem\n5. **Transformation Digitale** — €1M — 45% — Maroc Telecom\n\n🏆 **Best opportunity**: Déploiement CRM Atlassian has the highest expected value at €637.5K.",
    thinkingSteps: [
      'Loading opportunity pipeline…',
      'Ranking by expected value…',
      'Filtering top 5 opportunities…',
    ],
  },
  {
    keywords: ['sales', 'performance', 'analyze', 'review'],
    response:
      "## Sales Performance Overview\n\n| Metric | Value | Change |\n|--------|-------|--------|\n| **Win Rate** | 34% | +2.4% ↑ |\n| **Avg Deal Size** | €48K | +5.1% ↑ |\n| **Sales Cycle** | 45 days | -3 days ↓ |\n| **Conversion Rate** | 24.6% | +1.2% ↑ |\n| **Revenue (MTD)** | €892K | +18.4% ↑ |\n\n> 📈 Your team is performing above quarterly targets. Continue focusing on enterprise deals.",
    thinkingSteps: [
      'Gathering sales performance metrics…',
      'Comparing month-over-month…',
      'Calculating key performance indicators…',
    ],
  },
  {
    keywords: ['risk', 'at risk', 'attention', 'problem'],
    response:
      "I found **7 deals** requiring immediate attention:\n\n### 🔴 Critical Risk\n1. **Solution BI Power BI** — €150K — No activity in 18 days\n2. **Service Desk Managé** — €200K — Stuck in negotiation for 25 days\n\n### 🟡 Medium Risk\n3. **Firewall Fortinet** — €120K — Budget pending\n4. **Virtualisation VMware** — €300K — Competitor identified\n5. **Chatbot IA Service Client** — €250K — Proposal pending\n\n> ⚠️ **Action**: Prioritize Solution BI Power BI — no activity for 18 days is a red flag.",
    thinkingSteps: [
      'Scanning for stale opportunities…',
      'Checking activity logs…',
      'Analyzing risk factors…',
    ],
  },
  {
    keywords: ['recommendation', 'suggest', 'improve'],
    response:
      "## AI Sales Recommendations\n\n### 🎯 Immediate Actions\n1. **Follow up** with OCP Group — High-value opportunity at risk\n2. **Re-engage** 5 cold leads from last month's campaign\n3. **Prepare** Q2 forecast review\n\n### 📊 Strategic Recommendations\n- Increase outreach to **enterprise segment** (higher conversion rate)\n- Focus on **technology sector** — 40% win rate vs 28% average\n- Reduce sales cycle by automating follow-up sequences\n\n> 🚀 Implementing these recommendations could increase quarterly revenue by 22%.",
    thinkingSteps: [
      'Analyzing sales patterns…',
      'Identifying improvement areas…',
      'Prioritizing recommendations…',
    ],
  },
  {
    keywords: ['email', 'draft', 'write'],
    response:
      "Here's a draft email for **Nour Bennani** (OCP Group):\n\n```\nSubject: Follow-up on CRM Solution Proposal — Next Steps\n\nDear Nour,\n\nThank you for taking the time to review our proposal for the CRM solution.\n\nI wanted to follow up to see if you have any questions or if there's any additional information I can provide to support your decision.\n\nWe're excited about the opportunity to partner with OCP Group and confident that our solution will deliver significant value.\n\nWould you be available for a brief call this week to discuss next steps?\n\nLooking forward to hearing from you.\n\nBest regards,\nAlex Martin\n```\n\n📋 **Actions**: Review and customize before sending.",
    thinkingSteps: [
      'Gathering context about the client…',
      'Analyzing communication history…',
      'Drafting personalized email…',
    ],
  },
  {
    keywords: ['quote', 'citation', 'motivate', 'inspire'],
    response:
      "Here's a thought to keep you motivated:\n\n> *\"The best time to plant a tree was 20 years ago. The second best time is now.\"* — Chinese Proverb\n\n> *\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"* — Winston Churchill\n\nKeep pushing forward! 🚀",
    thinkingSteps: ['Searching motivational quotes database…'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'bonjour', 'salut'],
    response:
      "Hello! 👋 I'm LeadPro AI Assistant. How can I help you today?\n\nHere are some things I can do:\n- 📊 **Pipeline overview** — \"Show me my pipeline\"\n- 🎯 **Lead follow-up** — \"Which leads should I contact today?\"\n- 💼 **Opportunity analysis** — \"Show me my best opportunities\"\n- 📈 **Sales performance** — \"Analyze my sales performance\"\n- ⚠️ **Risk assessment** — \"Which deals are at risk?\"\n- 📧 **Email drafts** — \"Draft an email to a client\"\n- 💡 **Recommendations** — \"Give me sales recommendations\"",
    thinkingSteps: ['Initializing AI Assistant…', 'Loading capabilities…'],
  },
];

/* ── Default fallback response ── */

const DEFAULT_RESPONSE =
  "I've analyzed your request based on the available CRM data. Here's what I found:\n\n> I can help you with pipeline overviews, lead analysis, opportunity insights, sales performance reviews, risk assessments, email drafts, and recommendations.\n\n**Try asking me:**\n- \"Give me a pipeline summary\"\n- \"Which leads should I contact today?\"\n- \"Show me my best opportunities\"\n- \"Analyze my sales performance\"\n- \"Which deals are at risk?\"\n- \"Draft an email to a client\"\n- \"Give me sales recommendations\"";

/* ── Helper: find best matching response ── */

function findResponse(query: string): {
  response: string;
  thinkingSteps: string[];
} {
  const lower = query.toLowerCase();
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { response: entry.response, thinkingSteps: entry.thinkingSteps };
    }
  }
  return {
    response: DEFAULT_RESPONSE,
    thinkingSteps: [
      'Analyzing query…',
      'Searching knowledge base…',
      'Generating response…',
    ],
  };
}

/* ═══════════════════════════════════════════════════════
   AIService — Singleton
   ═══════════════════════════════════════════════════════ */

class AIService {
  /* ── Chat ── */

  async sendMessage(
    message: string,
    _signal?: AbortSignal,
  ): Promise<AIServiceResponse> {
    const { response, thinkingSteps } = findResponse(message);
    const processingTime = 800 + Math.random() * 1200;

    return simulateRequest(
      {
        success: true,
        data: response,
        processingTime: Math.round(processingTime),
        thinkingSteps,
      },
      processingTime,
    );
  }

  async getConversations(): Promise<AIServiceResponse<AIConversation[]>> {
    return simulateRequest({
      success: true,
      data: aiConversationsMock,
      processingTime: 300,
    });
  }

  /* ── Insights ── */

  async getInsights(): Promise<AIServiceResponse<AIInsight[]>> {
    return simulateRequest({
      success: true,
      data: aiInsightsMock,
      processingTime: 400,
    });
  }

  /* ── Recommendations ── */

  async getRecommendations(): Promise<AIServiceResponse<AIRecommendation[]>> {
    return simulateRequest({
      success: true,
      data: aiRecommendationsMock,
      processingTime: 350,
    });
  }

  /* ── Email Drafts ── */

  async getEmailDrafts(): Promise<AIServiceResponse<AIEmailDraft[]>> {
    return simulateRequest({
      success: true,
      data: aiEmailDraftsMock,
      processingTime: 300,
    });
  }

  async generateEmail(
    params: AIEmailGeneratorParams,
  ): Promise<AIServiceResponse<AIEmailDraft>> {
    const draft: AIEmailDraft = {
      id: generateId(),
      contactId: params.contactId,
      contactName: params.contactName,
      purpose: params.purpose,
      tone: params.tone,
      language: params.language,
      length: params.length,
      subject: `Subject: Follow-up with ${params.contactName}`,
      body: `Dear ${params.contactName},\n\nThank you for your time. I look forward to our continued collaboration.\n\nBest regards,\nAlex Martin`,
      createdAt: new Date().toISOString(),
    };

    return simulateRequest(
      { success: true, data: draft, processingTime: 600 },
      600,
    );
  }

  /* ── Analysis ── */

  async getLeadAnalysis(): Promise<AIServiceResponse<AILeadAnalysis[]>> {
    return simulateRequest({
      success: true,
      data: aiLeadAnalysisMock,
      processingTime: 500,
    });
  }

  async getOpportunityAnalysis(): Promise<
    AIServiceResponse<AIOpportunityAnalysis[]>
  > {
    return simulateRequest({
      success: true,
      data: aiOpportunityAnalysisMock,
      processingTime: 500,
    });
  }

  async getPipelineAnalysis(): Promise<
    AIServiceResponse<AIPipelineAnalysis[]>
  > {
    return simulateRequest({
      success: true,
      data: aiPipelineAnalysisMock,
      processingTime: 500,
    });
  }

  /* ── KPI Data ── */

  async getKpiData(): Promise<AIServiceResponse<AIKpiData[]>> {
    return simulateRequest({
      success: true,
      data: aiKpiDataMock,
      processingTime: 300,
    });
  }

  /* ── Context Sources ── */

  async getContextSources(): Promise<AIServiceResponse<AIContextSource[]>> {
    return simulateRequest({
      success: true,
      data: aiContextSourcesMock,
      processingTime: 200,
    });
  }
}

export const aiService = new AIService();
