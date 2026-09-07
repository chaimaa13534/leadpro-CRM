import type { AIMessage, AIConversation } from '../types/ai.types';
import { daysAgo, minutesAgo } from '@/mocks/mock-date-helpers';

/* ── Messages ── */

const MESSAGES_POOL: Array<{ role: 'user' | 'assistant'; content: string }> = [
  { role: 'user', content: 'Give me a summary of my pipeline.' },
  {
    role: 'assistant',
    content:
      "Based on the simulated CRM data, your pipeline currently has **89 open opportunities** with a total value of **€4.2M**.\n\n| Stage | Count | Value |\n|-------|-------|-------|\n| Prospecting | 24 | €720K |\n| Qualification | 31 | €1.1M |\n| Proposal | 18 | €1.4M |\n| Negotiation | 16 | €980K |\n\n> **Recommendation**: Focus on the 4 high-value deals in negotiation stage that are >75% probability.",
  },
  { role: 'user', content: 'Which leads should I contact today?' },
  {
    role: 'assistant',
    content:
      "Here are **5 leads** that require follow-up today based on their activity and priority:\n\n1. **Nour El Amrani** — Atlas Textile — High priority — Last contact 7 days ago\n2. **Yassine Bennani** — Nour Cosmétiques — Medium priority — New lead\n3. **Sara Idrissi** — Groupe Kawtar — High priority — Meeting requested\n4. **Omar Chraibi** — Sanad Pharma — Medium priority — Follow-up overdue\n5. **Rania Fassi** — Fassi Consulting — High priority — Proposal sent\n\n> ✅ I recommend starting with Nour El Amrani as they have the highest conversion probability.",
  },
  { role: 'user', content: 'Show me my best opportunities' },
  {
    role: 'assistant',
    content:
      "Here are your **top 5 opportunities** ranked by value and probability:\n\n1. **Déploiement CRM Atlassian** — €750K — 85% — OCP Group\n2. **Infrastructure Cloud AWS** — €500K — 72% — Attijariwafa Bank\n3. **Solution Data Warehouse** — €350K — 68% — Royal Air Maroc\n4. **Audit Sécurité Réseau** — €200K — 91% — Managem\n5. **Transformation Digitale** — €1M — 45% — Maroc Telecom\n\n🏆 **Best opportunity**: Déploiement CRM Atlassian has the highest expected value at €637.5K.",
  },
  { role: 'user', content: 'Analyze my sales performance' },
  {
    role: 'assistant',
    content:
      "## Sales Performance Overview\n\n| Metric | Value | Change |\n|--------|-------|--------|\n| **Win Rate** | 34% | +2.4% ↑ |\n| **Avg Deal Size** | €48K | +5.1% ↑ |\n| **Sales Cycle** | 45 days | -3 days ↓ |\n| **Conversion Rate** | 24.6% | +1.2% ↑ |\n| **Revenue (MTD)** | €892K | +18.4% ↑ |\n\n> 📈 Your team is performing above the quarterly targets. Continue focusing on enterprise deals.",
  },
  { role: 'user', content: 'Which deals are at risk?' },
  {
    role: 'assistant',
    content:
      "I found **7 deals** that require immediate attention:\n\n### 🔴 Critical Risk\n1. **Solution BI Power BI** — €150K — No activity in 18 days\n2. **Service Desk Managé** — €200K — Stuck in negotiation for 25 days\n\n### 🟡 Medium Risk\n3. **Firewall Fortinet** — €120K — Budget pending\n4. **Virtualisation VMware** — €300K — Competitor identified\n5. **Chatbot IA Service Client** — €250K — Proposal pending\n\n### 🟢 Low Risk (monitor)\n6. **VPN Multi Sites** — €80K — Follow-up needed\n7. **Intranet Collaboratif** — €100K — Stakeholder changed\n\n> ⚠️ **Action**: Prioritize Solution BI Power BI — no activity for 18 days is a red flag.",
  },
  { role: 'user', content: 'Summarize today\'s activities' },
  {
    role: 'assistant',
    content:
      "## Today's Activity Summary\n\n**📅 Meetings**: 4\n- 09:00 — Team standup\n- 10:30 — Client presentation (OCP Group)\n- 14:00 — Internal review\n- 16:00 — Product demo (Maroc Telecom)\n\n**📧 Emails**: 12 sent, 8 received\n**📞 Calls**: 6 calls logged\n**✅ Tasks**: 5 completed, 3 pending\n\n> ⏰ You have 2 overdue tasks: 'Send proposal to Managem' and 'Follow up with RAM'.",
  },
  { role: 'user', content: 'Draft an email to this client' },
  {
    role: 'assistant',
    content:
      "Here's a draft email for **Nour Bennani** (OCP Group):\n\n```\nSubject: Follow-up on CRM Solution Proposal — Next Steps\n\nDear Nour,\n\nThank you for taking the time to review our proposal for the CRM solution.\n\nI wanted to follow up to see if you have any questions or if there's any additional information I can provide to support your decision.\n\nWe're excited about the opportunity to partner with OCP Group and confident that our solution will deliver significant value.\n\nWould you be available for a brief call this week to discuss next steps?\n\nLooking forward to hearing from you.\n\nBest regards,\nAlex Martin\n```\n\n📋 **Actions**: Review and customize before sending.",
  },
  { role: 'user', content: 'Give me sales recommendations' },
  {
    role: 'assistant',
    content:
      "## AI Sales Recommendations\n\n### 🎯 Immediate Actions\n1. **Follow up** with OCP Group — High-value opportunity at risk\n2. **Re-engage** 5 cold leads from last month's campaign\n3. **Prepare** Q2 forecast review\n\n### 📊 Strategic Recommendations\n- Increase outreach to **enterprise segment** (higher conversion rate)\n- Focus on **technology sector** — 40% win rate vs 28% average\n- Reduce sales cycle by automating follow-up sequences\n\n### 📈 Expected Impact\n| Action | Expected Lift | Timeline |\n|--------|--------------|----------|\n| Lead re-engagement | +15% conversion | 2 weeks |\n| Enterprise focus | +€500K pipeline | 1 month |\n| Sales cycle optimization | -8 days avg | 1 quarter |\n\n> 🚀 Implementing these recommendations could increase quarterly revenue by 22%.",
  },
  { role: 'user', content: 'What is my pipeline concentration?' },
  {
    role: 'assistant',
    content:
      "## Pipeline Concentration Analysis\n\n### By Industry\n| Sector | Pipeline Value | % of Total |\n|--------|---------------|------------|\n| Banking & Finance | €1.6M | 38% |\n| Technology | €1.1M | 26% |\n| Manufacturing | €720K | 17% |\n| Healthcare | €480K | 11% |\n| Other | €300K | 7% |\n\n### ⚠️ Risk Assessment\n> Your pipeline has a **concentration risk in Banking & Finance** (38%). Consider diversifying into Technology and Healthcare sectors to reduce dependency.\n\n### Recommendation\nTarget 3 new enterprise accounts in the Technology sector this month.",
  },
  { role: 'user', content: 'Compare this quarter with last quarter' },
  {
    role: 'assistant',
    content:
      "## Q1 vs Q2 Comparison\n\n| Metric | Q1 | Q2 (Current) | Change |\n|--------|-----|-------------|--------|\n| **Revenue** | €1.2M | €1.8M | +50% ↑ |\n| **New Leads** | 145 | 198 | +36.6% ↑ |\n| **Deals Won** | 28 | 34 | +21.4% ↑ |\n| **Avg Deal Size** | €42K | €52K | +23.8% ↑ |\n| **Win Rate** | 31% | 34% | +3pp ↑ |\n\n> 📊 Q2 is tracking significantly ahead of Q1 across all metrics. The team is performing at 112% of target.",
  },
  { role: 'user', content: 'What are the top 3 actions I should take this week?' },
  {
    role: 'assistant',
    content:
      "## 🔥 Top 3 Actions for This Week\n\n### 1. Close the OCP Group Deal 🏆\n- Value: €750K\n- Probability: 85%\n- Action: Schedule final negotiation call\n\n### 2. Re-engage 3 Stale Opportunities 🔄\n- Solution BI Power BI (18 days inactive)\n- Service Desk Managé (25 days stuck)\n- Chatbot IA Service Client (12 days pending)\n\n### 3. Follow Up on 5 High-Value Leads 🎯\n- New leads from Casablanca IT Summit\n- Priority: Enterprise accounts in Banking\n\n> ✅ Completing these 3 actions could add €1.2M to your pipeline by next week.",
  },
  { role: 'user', content: 'Show my team\'s performance this month' },
  {
    role: 'assistant',
    content:
      "## Team Performance — June 2026\n\n| Team Member | Deals Won | Pipeline Created | Revenue | Target |\n|-------------|-----------|-----------------|---------|--------|\n| **Alex Martin** | 8 | €1.2M | €450K | 115% ✅ |\n| **Sara Idrissi** | 6 | €890K | €320K | 98% 📊 |\n| **Yassine Bennani** | 5 | €750K | €280K | 92% 📊 |\n| **Omar Chraibi** | 4 | €620K | €210K | 85% ⚠️ |\n\n> 💡 **Coaching opportunity**: Omar Chraibi is below target. Consider pairing with Alex for deal strategy sessions.",
  },
  { role: 'user', content: 'Forecast next quarter revenue' },
  {
    role: 'assistant',
    content:
      "## Q3 2026 Revenue Forecast\n\n### 🔮 Predicted Revenue: €2.4M — €2.8M\n\n### Breakdown\n| Scenario | Revenue | Probability |\n|----------|---------|------------|\n| **Conservative** | €2.1M | 30% |\n| **Most Likely** | €2.6M | 55% |\n| **Optimistic** | €3.1M | 15% |\n\n### Key Assumptions\n- 3 enterprise deals close this quarter (€1.5M combined)\n- 12 SMB deals close (€600K combined)\n- 40 new opportunities created (€2M pipeline target)\n\n> 📈 Based on current momentum, the most likely scenario is €2.6M, representing 30% QoQ growth.",
  },
  { role: 'user', content: 'Which leads came from the Casablanca event?' },
  {
    role: 'assistant',
    content:
      "## Leads from Casablanca IT Summit\n\nI found **12 leads** from the Casablanca IT Summit event:\n\n| # | Name | Company | Status | Score |\n|---|------|---------|--------|-------|\n| 1 | Mehdi Cherkaoui | Groupe Kawtar | Qualified | 85 |\n| 2 | Salma El Mouden | Sanad Pharma | New | 72 |\n| 3 | Anas Berrada | Fassi Consulting | Contacted | 68 |\n| 4 | Lamia Ouazzani | Ouazzani BTP | New | 65 |\n| 5 | Ghita Tazi | Salma Textile | Contacted | 60 |\n\n> 🌟 **Top pick**: Mehdi Cherkaoui has the highest score and requested a demo. Prioritize contact this week.",
  },
  { role: 'user', content: 'Create a meeting summary template' },
  {
    role: 'assistant',
    content:
      "## 📝 Meeting Summary Template\n\n```markdown\n# Meeting Summary\n\n**Date**: [Date]\n**Client**: [Company Name]\n**Attendees**: [Names]\n**Duration**: [Duration]\n\n## Agenda\n1. Review current status\n2. Discuss challenges\n3. Present solution\n4. Next steps\n\n## Key Discussion Points\n- [Point 1]\n- [Point 2]\n- [Point 3]\n\n## Decisions Made\n- [Decision 1]\n- [Decision 2]\n\n## Action Items\n- [ ] **Owner**: Task — Due date\n- [ ] **Owner**: Task — Due date\n\n## Next Meeting\n**Date**: [Next Date]\n**Focus**: [Topics]\n```\n\n> 💡 Save this template for quick access during client meetings.",
  },
  { role: 'user', content: 'Analyze the opportunity with Maroc Telecom' },
  {
    role: 'assistant',
    content:
      "## 🔍 Opportunity Analysis: Maroc Telecom\n\n**Opportunity**: Transformation Digitale\n**Value**: €1M\n**Stage**: Negotiation\n**Probability**: 45%\n\n### Risk Assessment\n| Factor | Status | Impact |\n|--------|--------|--------|\n| Competition | 2 competitors identified | Medium |\n| Timeline | Decision expected in 60 days | Low |\n| Budget | Approved | Low |\n| Stakeholder | CTO is champion | Low |\n\n### Recommended Actions\n1. Schedule technical demo for next week\n2. Prepare competitive comparison matrix\n3. Engage CFO for budget confirmation\n\n> ⚠️ **Risk**: Medium — competition is active. Differentiate with our AI features.",
  },
  { role: 'user', content: 'What is the forecast for this quarter?' },
  {
    role: 'assistant',
    content:
      "## Q2 2026 Forecast Update\n\n### Current Pipeline: €4.2M\n### Expected Close: €1.8M — €2.2M\n\n### By Category\n| Category | Deals | Value | Expected |\n|----------|-------|-------|----------|\n| ✅ High Confidence | 12 | €1.4M | €1.2M |\n| ⚠️ Medium Confidence | 18 | €1.8M | €800K |\n| 🔴 Low Confidence | 8 | €1M | €200K |\n\n### KPI Dashboard\n| Metric | Current | Target | Status |\n|--------|---------|--------|--------|\n| **Revenue** | €892K | €950K | 🔴 Behind |\n| **New Opps** | 24 | 30 | 🔴 Behind |\n| **Win Rate** | 34% | 32% | ✅ Ahead |\n\n> 📊 Focus on converting medium-confidence deals to hit the quarterly target of €2M.",
  },
];

/* ── Generate 20 conversations ── */

const CONVERSATION_TITLES = [
  'Pipeline Overview',
  'Daily Lead Follow-up',
  'Best Opportunities Analysis',
  'Sales Performance Review',
  'At-Risk Deals Review',
  'Daily Activity Summary',
  'Email Draft to Client',
  'Sales Strategy Session',
  'Pipeline Concentration Analysis',
  'Quarter Comparison',
  'Weekly Action Plan',
  'Team Performance Review',
  'Revenue Forecast',
  'Event Lead Follow-up',
  'Meeting Template Creation',
  'Deal Analysis',
  'Quarterly Forecast',
  'Sales Coaching Session',
  'Lead Strategy Planning',
  'End of Week Review',
];

export const aiConversationsMock: AIConversation[] = CONVERSATION_TITLES.map(
  (title, convIndex) => {
    const messageCount = 2 + (convIndex % 4);
    const messages: AIMessage[] = [];

    for (let i = 0; i < messageCount; i++) {
      const poolIndex = (convIndex * 3 + i) % MESSAGES_POOL.length;
      const entry = MESSAGES_POOL[poolIndex]!;
      messages.push({
        id: `ai-msg-${convIndex}-${i}`,
        role: entry.role,
        content: entry.content,
        timestamp: minutesAgo(i * 3 + convIndex * 5),
        responseType: i % 2 === 0 ? undefined : 'text',
        actions: {
          copied: false,
          liked: null,
          disliked: null,
        },
      });
    }

    return {
      id: `ai-conv-${convIndex + 1}`,
      title,
      createdAt: daysAgo(convIndex * 3),
      updatedAt: minutesAgo(convIndex * 5),
      messages,
      messageCount,
      context: [],
    };
  },
);

