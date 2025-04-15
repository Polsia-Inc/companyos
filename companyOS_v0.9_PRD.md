# CompanyOS v0.9 – Agent Collaboration, Delegation, and In-Slack Communication

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17

---

## 🧠 Vision

v0.9 introduces **agent-to-agent collaboration**, cross-functional PRDs, and the early beginnings of an internal Slack-powered conversation system — making CompanyOS feel like a living, breathing team.

> Agents begin working *together*, not just reporting to the Creative Director.

This version unlocks horizontal coordination, delegation chains, and a Slack-native window into how the system thinks.

---

## 🎯 Goals

- Enable agents to **delegate tasks** to each other
- Support **multi-author PRDs** and plan co-ownership
- Let agents **comment** on each other's plans and proposals
- Lay the groundwork for **agent conversations in Slack**

---

## 🔑 Core Features

### 1. Agent Delegation System
Create an `agent-delegation.json` to define who can assign tasks to whom:
```json
{
  "product": ["design", "engineering"],
  "marketing": ["design", "ethics"],
  "chief_of_staff": ["any"]
}
```
- Delegation can be triggered by:
  - Task needs
  - Blockers
  - Unassigned subtasks in PRDs

### 2. Multi-Agent PRDs
- Add `authors:` and `owners:` YAML frontmatter fields to every plan:
```yaml
authors: [product, marketing]
owners: [engineering]
status: draft
```
- Plans now have multi-agent authorship and ownership
- Chief of Staff can route follow-ups and hold agents accountable

### 3. Agent Comments on PRDs
Every PRD can now include structured comments from agents:
```bash
plans/2025-04-20_launch-campaign/
├── plan.md
└── comments/
    ├── strategy.txt
    └── ethics.txt
```
- Comments follow this format:
```txt
[Agent: Strategy]
This campaign may be premature — Product Agent notes onboarding still causes dropoff.
```

### 4. Slack-Based Agent Interaction (MVP)
- Introduce Slack channels per agent: `#agent-strategy`, `#agent-eng`, `#agent-marketing`
- Use Slack bot to:
  - Let agents leave comments on PRDs
  - Let agents tag each other in discussion threads
  - Show PRD status, approvals, and live threads

Example:
> **#agent-product**  
> Product Agent: "I'm blocked on remix UX final flow — @design-agent can you draft layout options by EOD?"

The Creative Director sees these interactions *without needing to orchestrate them manually*.

### 5. Task Routing + Follow-Up
When a PRD is approved:
- Each subtask is routed to the relevant agent
- Updates are written into `/tasks/`
- Chief of Staff checks on task status daily

---

## 📁 File Structure Additions

```bash
companyos/
├── plans/
│   └── 2025-04-20_launch-campaign/
│       ├── plan.md
│       └── comments/
│           └── product.txt
├── tasks/
│   ├── engineering/
│   ├── marketing/
├── agent-delegation.json
```

---

## 🔥 Why This Is Powerful

- You see **agents coordinating** like real teammates
- You don’t need to micromanage execution across domains
- Slack gives you visibility into a working AI company
- PRDs feel alive — like a living doc that multiple agents build over time
- You can onboard humans into the system by watching the conversations

> CompanyOS becomes the most human-feeling, AI-powered org ever built.

---

## ✅ Summary

**v0.9 = The moment the system starts talking to itself.**

- Agents collaborate across plans
- Delegate ownership
- Comment and align asynchronously
- Run conversations in Slack

CompanyOS becomes:
- Human-readable
- Team-shaped
- Co-created
- Self-sustaining

Let’s build it.