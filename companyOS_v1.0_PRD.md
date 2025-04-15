# CompanyOS v1.0 – Public-Ready Agentic Operating System for Founders

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17

---

## 🧠 Vision

CompanyOS v1.0 is the first **public release** of the product. This is the moment when CompanyOS becomes:

- A product anyone can use
- A company in a box
- A full-stack founder support system
- A new way of building companies: async, agent-led, founder-centered

> v1.0 is no longer an internal tool for Blanks — it's a platform for anyone launching, running, and scaling something new.

This is where CompanyOS stops being your secret weapon, and starts becoming *everyone’s team.*

---

## 🎯 Goals

- Productize everything we've built internally
- Launch an installable + hosted version of CompanyOS
- Introduce UI, Slack agent, billing, and onboarding
- Let anyone spin up a new company with agents in <5 mins
- Allow multiple tracks (Blanks, CompanyOS, Fundraising, etc.)

---

## ✅ Core Capabilities in v1.0

### 1. Agent Council
- Default agent stack: Strategy, Product, Marketing, Engineering, Ethics, Wellness, Chief of Staff
- Agents are scheduled, memory-aware, and feedback-responsive
- Trust scores + scoped autonomy

### 2. Planning & Execution
- Agent-authored PRDs
- Approval workflows
- Task routing + execution logs
- Comment threads between agents

### 3. Tools & Integrations
- GitHub: create PRs, read commits, analyze codebase structure
- Calendar: schedule focus blocks, break time
- Twitter: write and schedule launch content
- Notion/Docs: draft external-facing content
- Email (later): outbound intro drafts

### 4. UI & Slack Interface
- CompanyOS Web Dashboard
  - Submit Pulse
  - View directive
  - Browse PRDs
  - See agent activity
- Slack Agent:
  - `/pulse`, `/summary`, `/ask agent`, `/approve`
  - Threads per PRD

### 5. Memory & History
- Daily memory (pulse + output)
- Weekly syncs
- Plan timelines
- Agent feedback
- Long-term company memo

### 6. Multi-Track Org Support
- Each workspace supports:
  - Multiple tracks (Blanks, CompanyOS, Fundraising, etc.)
  - Shared memory per track
  - Dedicated agents per track or shared across

---

## 🧪 Setup & Usage

### CLI (Open Source / Dev Mode)
```bash
npx companyos init
npm run start:orchestrator
```

### SaaS (Hosted)
- Hosted onboarding:
  - What are you building?
  - Name your company
  - Select agent modules
  - Enter OpenAI key (or use default metered infra)
- Free tier: 3 agents, no memory
- Pro tier: Full agent council, Slack, memory, file storage

---

## 💸 Pricing Model

- API-wrapped usage (like Cursor):
  - We host LLM infra
  - Charge per agent usage (tokens, actions)
- Option: bring your own key, but no Slack/UI access

### Example Tiers:
| Tier | Price | Features |
|------|-------|----------|
| Free | $0    | 3 agents, CLI only |
| Solo | $19/mo | 7 agents, Slack, UI, memory |
| Team | $49/mo | Multi-track, custom tools, delegation + logs |
| Funded | $99/mo | LLM tuning, workflow builder, agent marketplace |

---

## 🚀 What You Can Say Now

> “I built my company on CompanyOS.”  
> “I have a team — but it’s made of agents.”  
> “I don’t have meetings. I have systems.”  
> “This is what company-building looks like in the AI-native era.”

---

## 🧱 Architecture Notes

- Each company = 1 directory with:
  - `/pulse/`, `/outputs/`, `/memory/`, `/plans/`, `/agents/`, `/config.json`
- Orchestrator handles run logic
- Slack/web clients act as frontends
- CLI supports power users
- Hosted mode supports memory + monetization

---

## 🧑‍🚀 Launch Strategy

1. **Run Blanks + CompanyOS internally** to prove dual-track support
2. Publish open-source CLI (MIT or BSL license)
3. Launch hosted beta → private → public
4. Raise funding with:
  - Real usage
  - Internal velocity
  - Clear product-market fit story

---

## ✅ Summary

CompanyOS v1.0 is:
- A real product
- For real founders
- With real teams (of agents)
- That plan, prioritize, delegate, execute, and learn

You’re not just building faster. You’re building *better.*

Let’s launch it.