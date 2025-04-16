# CompanyOS v0.26 – Agent Memory + Execution Loop (Founder-Guided)

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17

---

## 🎯 Purpose

v0.26 introduces the foundational execution loop for CompanyOS agents — not for autonomous execution, but for structured thinking, planning, and memory that enhances founder decision-making. This version creates a daily rhythm where agents:

- Propose what to build (based on full context)
- Write PRDs for approved ideas
- Keep their own domain memory up to date

The **founder (Ben)** remains the only executor for now. Agents do not build or act yet — they think, reflect, and remember.

---

## 🧠 Core Principles

- PRDs correspond to **state transitions** (e.g. Product v0.6 → v0.7)
- Each domain should have **only one active PRD** at a time
- Once anything is built (even partially), the state has changed → PRD is closed
- Agents propose fresh ideas daily based on the latest pulse and updated domain state
- PRDs that are not acted upon are still re-surfaced, optionally updated, or archived

---

## 🔁 The Daily Loop

### 1. Daily Pulse (Founder-Guided)
- The orchestrator prompts the founder:
  - “Did you do anything in Product yesterday?”
  - “Here’s your pending PRD: product-v0.6 – Orb Loading Feedback”
  - “Which tasks were completed? (1, 2, 3...)”
- Founder replies via voice or text: “I did 1, 3, and added a new one: loading shimmer.”

### 2. Partial PRDs Are Finalized
- The original PRD is **edited** to reflect what was done
- Status is marked as `done`
- No remaining tasks are carried over
- Domain state (e.g. `state/product.md`) is updated with:
  - Completed tasks
  - New insights from the Pulse

### 3. Agents Review and Propose
For each domain:
- Agent reads:
  - Latest `state/{domain}.md`
  - Latest Pulse
  - Any existing pending PRDs
- Agent proposes:
  - New ideas (fresh context)
  - The pending PRD again (if relevant)
    - Notes whether it has changed, is outdated, or should be updated

Example:
```markdown
## Suggested Initiatives for Product

1. ✳️ “Add shimmer loading to orb UI”
   > Based on your Pulse insight about perceived speed

2. 🔁 “Finalize Onboarding Rewrite”
   > Existing PRD `product-v0.6` still pending. No progress yet. Want me to update?

3. ✳️ “Add SafeAreaView fallback on error states”
```

### 4. Founder Approves Next PRD
- You approve one idea → agent writes PRD (versioned)
- PRD lives in `/plans/`
- You manually decide if/when to act on it

---

## 📁 File Structure

```bash
companyos/
├── pulse/
│   └── 2025-04-18.json
├── state/
│   ├── product.md
│   ├── marketing.md
├── plans/
│   ├── product-v0.6-orb-loading.md (done)
│   ├── product-v0.7-shimmer.md (drafted)
├── archive/
│   └── product-v0.5-old-prd.md
├── plan-index.md
```

---

## ✍️ PRD Format

```markdown
---
title: Orb Loading Optimization
author: product-agent
date: 2025-04-18
version: product-v0.7
status: done
---

## Context
Users reported the orb felt unresponsive.

## Objective
Improve perceived speed with UI changes.

## Plan
- Add shimmer loading effect
- Decouple JS load from visible response

## Success Criteria
- Interaction feels instant
- User feedback improves
```

---

## ✅ Summary

v0.26 creates:
- Daily proposal loop per agent
- Founder-led execution and reflection
- Structured PRD versioning + manual updates
- Living domain memory via `state/{domain}.md`

All without agent execution.

This sets up:
- v0.3 → Emotional context, Slack UI, agent personality
- v0.4 → Delegated execution and PRD approvals
- v0.5+ → Tools and agent autonomy

Let’s build it.

