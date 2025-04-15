# CompanyOS v0.3 – PRD & Dev Plan: From Council to Companion

**Author:** Ben Broca (with ChatGPT)
**Date:** 2025-04-17
**Context:** This doc defines the next evolution of CompanyOS — the personal operating layer that helps a solo founder run a company with clarity, confidence, and synthesis. Version 0.2 introduced the agent council and Chief of Staff. Now, v0.3 will transform CompanyOS from a reflection tool into a cognitive collaborator.

---

## 🧠 Purpose of v0.3

Use v0.3 to:
- Improve decision-making quality for the Creative Director
- Inject full company context into every agent
- Make the system feel alive, emotionally intelligent, and situationally aware
- Set the foundation for CompanyOS to become a real, daily co-founder for Blanks

> **v0.2 = Mirror**  
> **v0.3 = Companion**

The goal is for Ben to use CompanyOS v0.3 to:
1. Finish and ship Blanks to beta users (this week)
2. Prove that CompanyOS helped run Blanks end-to-end
3. Begin thinking about time allocation between Blanks and CompanyOS (early VentureOS logic)

---

## ✅ What’s working (as of v0.2)
- Pulse input + orchestration loop
- Strategy, Ethics, Wellness, Product, Engineering, and Marketing agents
- Chief of Staff agent synthesizing all responses into a directive
- Feedback loop with trust ratings and manual review
- Memory layer scaffolded with `company-memo.json`

---

## 🚧 What's missing (identified by Ben)
- Agents are still sometimes **echoing** the Pulse, not thinking independently
- No **awareness of recent changes** (what was built yesterday, what’s working)
- Missing **system-level context**: codebase structure, build issues, LLM pipeline, UX principles
- No UI — CLI-only limits emotional experience of using it
- No Slack interface for async agent queries
- Agents don’t proactively nudge or follow-up

---

## 🚀 What v0.3 will include

### 1. Inject Full Company Context
- Create `/docs/` directory with the following files:
  - `docs/codebase.md`
  - `docs/deployment.md`
  - `docs/agent-system.md`
  - `docs/product-principles.md`
  - `docs/glossary.md`
- Summarize each with simple markdown notes
- Add `docs/index.md` to summarize high-level links
- Modify orchestrator to inject these docs into agent prompts (by type):
  - Engineering → codebase + deployment
  - Product → product-principles + glossary
  - Chief of Staff → index.md

### 2. Expand Pulse to Track Recent Progress
- Add a question to Pulse:
  > "What did you build, fix, or ship yesterday?"
- Add that to `context.json`
- Feed into agent prompts under a new `recent_progress` field

### 3. Chief of Staff Summary Refinement
- Improve formatting and push clarity further
- Optionally output a `.summary.md` with linked references to agents
- Create `creative_director_input.trust_feedback` schema for review (already started)

### 4. Optional Slack Interface
- Create a basic Slack bot
- Connect it to the local agent runner or remote server
- Let user type:
  > “/ask product What should I be worried about?”

### 5. UI Layer MVP (Later This Week)
- Build a basic UI (could be a web dashboard or Electron app)
- View latest Pulse
- View today’s Chief of Staff summary
- Trigger new Pulse or rerun agents

### 6. Extend Memory
- Create a script that summarizes daily Pulse + agent output → appends to `company-memo.json`
- Or: write these summaries manually every Sunday

### 7. Expand Agent Superpowers
- Let Wellness Agent access a mocked calendar API
- Let Strategy Agent access company memo trends
- Add agent-specific memory files if needed later

---

## 🛠 How this fits into the roadmap

| Week | Milestone |
|------|-----------|
| Apr 15–20 | Use v0.2 to ship Blanks beta |
| Apr 21 | Begin v0.3 sprint (24-hour focused build) |
| Apr 22+ | Run CompanyOS with UI + Slack interface |
| Apr 23+ | Add VentureOS concept + time allocation logic |

---

## 📦 Directory Structure Additions

```bash
companyos/
├── docs/
│   ├── codebase.md
│   ├── deployment.md
│   ├── glossary.md
│   ├── product-principles.md
│   └── agent-system.md
│   └── index.md
├── memory/
│   └── company-memo.json
├── context/
│   └── YYYY-MM-DD.json
├── outputs/
│   ├── YYYY-MM-DD.json
│   └── YYYY-MM-DD.summary.md
├── prompts/
│   └── [all agents with unified structured output]
```

---

## ✅ Summary

You’ve now built:
- A structured agentic council
- A daily synthesis layer
- A founder-centric decision OS

v0.3 is about:
- Making it feel like a **real companion**
- Filling in blind spots (context, memory, recent progress)
- Creating a UI layer that makes the loop satisfying

This is how you run Blanks *with* CompanyOS.
This is how you build the system that builds companies.
This is how VentureOS begins.

