# CompanyOS v0.4 – The Foundation of a Scalable, AI-Native Company

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17  

---

## 🧠 Context

With CompanyOS v0.3 operational, we now have a functioning system that synthesizes multi-agent insights into a daily directive for the founder. It’s emotionally aware, structured, and helpful.

But you’ve correctly identified what’s next:

> We’re not just building a tool for today’s priorities — we’re building a **company operating model** that works at scale.

v0.4 is about laying the **organizational foundation** for CompanyOS to run like a remote-first, asynchronous, agent-human hybrid company — where everything is:
- Written
- Approved
- Traceable
- Executable

And where agents can operate semi-autonomously based on clear planning, PRDs, and delegated authority.

---

## 🎯 Core Insight

> **The bottleneck is no longer building. It’s deciding what to build.**

You can implement anything in 20 minutes. But only if:
- The idea is clear
- The approval path is defined
- The agents know what’s in or out of scope

This means CompanyOS needs to evolve beyond daily strategy. It needs to:
- Define what work gets done
- Formalize how decisions are made
- Enable agents to propose and execute work autonomously

---

## 🧱 v0.4 Core Features

### 1. **PRDs for Everything ("Executive Plans")**
- Any major initiative (feature, fundraising, marketing, hiring) must have a written plan
- These are saved in the repo under `plans/` or `executive/`
- Each PRD contains:
  - Title, author, date
  - Context
  - Objective
  - Stakeholders (agents or humans)
  - Plan of action
  - Agent ownership (if delegated)
  - Approval status (Pending / Approved / In Progress / Blocked / Cancelled)

### 2. **Agent-Initiated Plans**
- Agents (especially Strategy, Marketing, Fundraising) can draft plans and submit them to the CEO for review
- Example:
  - Marketing Agent proposes a PRD for "TestFlight Launch Campaign"
  - Fundraising Agent drafts a PRD for "Pre-Seed Outreach Phase 1"

### 3. **Approval Workflow (Asynchronous)**
- PRDs can be approved via CLI or UI (e.g., `companyos approve plan.md`)
- Each PRD includes a header block:
```yaml
status: Pending
approved_by: null
date_submitted: 2025-04-17
```
- Agents cannot begin executing a plan until it’s approved by the Creative Director

### 4. **Agent Autonomy Based on Approved Plans**
- Once a plan is approved:
  - Agents can operate semi-independently to complete the work
  - Progress is logged automatically in a `progress.md` or reflected in memory

### 5. **Structured Traceability + Context Index**
- All PRDs live in a single folder (`/plans/`, `/executive/`, or `/prds/`)
- Indexed in a markdown file (`plan-index.md`) with tags (e.g., `[x] Marketing`, `[ ] Fundraising`, `[x] Product`)
- This becomes the **source of truth** for:
  - What’s been proposed
  - What’s been approved
  - What’s currently in motion

### 6. **Docs + Plan Integration**
- Approved PRDs are referenced in agent prompts and Company Memory
- Agents gain real-time awareness of:
  - Current roadmap
  - What was recently built (from Pulse)
  - What’s currently being worked on (from plan index)

---

## 📁 File Structure Proposal

```bash
companyos/
├── plans/
│   ├── 2025-04-17_launch-campaign.md
│   ├── 2025-04-18_fundraising-prep.md
├── plan-index.md
├── docs/
├── memory/
├── context/
├── outputs/
```

---

## 🚀 Benefits

- **Remote-first, async by design**
- Humans and agents operate in the same structure
- Agents don’t get blocked on you
- You get full traceability of how decisions were made
- You build the foundation for VentureOS — managing multiple product tracks, founders, or agent-driven orgs

---

## 🔭 What This Enables Next

- **Slack Bot UI:** Agents submit plans via Slack, you approve in Slack or CLI
- **Agent Trust Escalation:** High-performing agents get auto-delegation rights for scoped PRD categories
- **Company Timeline Generation:** Use `plan-index.md` + `pulse history` + `outputs` to reconstruct company history at any point
- **Eventually:** Full RAG system for CompanyOS agents to answer:
  > "Has anything like this been proposed before?" or "What did we do last time we shipped onboarding?"

---

## ✅ Summary

CompanyOS v0.4 turns your system into:
- A remote-first org
- A PRD-driven execution machine
- A clear, contextual, trackable AI-human hybrid company

This is how you build Blanks. This is how you run a real company without meetings. This is how you begin VentureOS.

Let’s ship it.

