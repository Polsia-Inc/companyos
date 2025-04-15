# CompanyOS v0.6 – Agent Autonomy, Governance, and Self-Initiation

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17

---

## 🧠 Vision

v0.6 is where **CompanyOS becomes self-driving.**

Agents don’t just respond to Pulse. They initiate. They plan. They follow up. They ask for approval. They build.

And the Creative Director (Ben) shifts from sole decision-maker → system-level governor. You approve plans, not every thought. You trust workflows, not just daily check-ins.

But autonomy must be **earned** and **controlled**. v0.6 introduces a governance layer that lets agents operate *within bounds* — writing PRDs, scheduling tasks, nudging you, but never acting beyond permission.

> This is the turning point where CompanyOS evolves from reactive support to proactive execution engine.

---

## 🎯 Goals

- Let agents initiate work (PRDs, proposals, reviews)
- Let CEO (human) define **what level of autonomy** each agent has
- Ensure all agent work flows through a structured, reviewable approval system
- Begin tracking agent history, trust, and delegated scopes

---

## 🔑 Core Features

### 1. Agent-Initiated PRDs
- Agents can write to `/plans/drafts/` based on:
  - Pulse + system state
  - Roadmap gaps
  - Memory insights
- Example: Marketing Agent drafts `2025-04-18_launch-campaign.md` on its own

### 2. Autonomy Governance System
Each agent has a defined autonomy config:
```json
{
  "agent": "marketing",
  "can_propose_prds": true,
  "can_execute": false,
  "max_unapproved_drafts": 2,
  "auto_run": false
}
```
- **can_propose_prds** → Can the agent generate draft plans?
- **can_execute** → Can the agent begin work before approval?
- **max_unapproved_drafts** → Cap runaway planning
- **auto_run** → If true, agent runs even without human Pulse

### 3. Plan Approval Workflow (CLI + Slack + UI)
- Agents submit plans for approval
- Plans are reviewed by:
  - Relevant agents
  - CEO (final say)
- Once approved:
  - Agents can begin execution (if `can_execute = true`)
  - Plan status updates to `In Progress`

### 4. Daily Planning Autonomy
- Chief of Staff can run even if Ben skips Pulse (e.g. sees late-night commits or previous context)
- Agents can:
  - Propose daily directives
  - Flag overdue PRD reviews
  - Ask: "May I run today?"

### 5. PRD Execution Framework
- Once a plan is approved, execution lives in:
  - `progress.md`
  - Memory entries
  - Follow-up Pulse notes
- Agents must:
  - Log what they’ve done
  - Alert if blocked
  - Ask for reassignment or review if stuck

---

## 📁 File Structure Additions

```bash
companyos/
├── plans/
│   ├── drafts/
│   └── approved/
├── agent-autonomy.json
├── progress/
│   └── 2025-04-18_launch-campaign.md
```

---

## 🧠 Why This Matters

You want:
- A remote-first, async-native company
- Agents who feel like teammates — not tools
- A system that scales without chaos
- Context permanence, auditability, and traceable decisions

v0.6 is the **CompanyOS operating protocol.**
It’s the shift from agent-in-the-loop → **agent-in-the-org**.

---

## 🔭 Future Extensions (v0.7+)

- Agent trust scoring → unlocks deeper delegation
- `companyos.watch()` script — run agents in the background
- Project-based memory (per PRD)
- Agent voting on plans before CEO approval

---

## ✅ Summary

v0.6 turns CompanyOS into an **autonomous planning system.**

Agents:
- Think independently
- Propose proactively
- Operate within rules
- Ask for approval
- Execute when trusted

You:
- Review what matters
- Approve what’s aligned
- Step back from micromanagement

CompanyOS becomes:
> A team. A rhythm. A company without meetings.

Let’s ship it.

