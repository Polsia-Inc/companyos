# CompanyOS v0.8 – Agent Scheduling, Shared Memory, and Temporal Planning

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17

---

## 🧠 Vision

v0.8 introduces **time-awareness, shared memory, and autonomous planning cadence** to CompanyOS.

Agents no longer act only in response to the daily Pulse. They operate on **defined rhythms**, reference shared history, and coordinate across time. CompanyOS becomes an **orchestrated operating system** that builds its own roadmap.

> v0.7 was about feedback and trust.  
> **v0.8 is about time, memory, and sync.**

This unlocks long-term continuity, agent handoffs, and parallel tracks.

---

## 🎯 Core Goals

- Give each agent a **schedule** (daily, weekly, biweekly, etc.)
- Introduce a **shared memory log** between agents
- Allow Chief of Staff to **plan the week ahead**
- Support **multi-track roadmaps** across products and company layers

---

## 🔑 Key Features

### 1. Agent Scheduling
Each agent gets a defined cadence in `schedule.json`:
```json
{
  "wellness": "daily",
  "strategy": "weekly",
  "chief_of_staff": ["daily", "friday"],
  "product": "biweekly"
}
```
- Scheduler script (`start:scheduler`) checks current day and runs agents with matching cadence
- If no Pulse is submitted, agents still run using the last available context

### 2. Shared Agent Memory
Create a centralized log that any agent can read:
```json
memory/agent-activity-log.json
[
  {
    "date": "2025-04-17",
    "agent": "engineering",
    "action": "Proposed switching to GPT-4.1 for codegen",
    "confidence": 0.87
  },
  {
    "date": "2025-04-18",
    "agent": "marketing",
    "action": "Drafted PRD for post-launch campaign",
    "confidence": 0.81
  }
]
```
- Updated automatically after each orchestration run
- Readable by Chief of Staff and other agents to reduce duplication and increase awareness

### 3. Weekly Planning Output
On Fridays (or a defined cadence), Chief of Staff generates a `week-ahead.md`:
```md
## Week of April 22–28
- 🎯 Primary Focus: App generation reliability and onboarding polish
- ✅ Key PRDs in motion:
   - LLM Benchmarking Plan
   - TestFlight Launch Campaign
- 🧠 Agent Responsibilities:
   - Engineering: Optimize GPT-4.1 pipeline
   - Product: UX testing on orb state transitions
   - Marketing: Write App Store copy draft
```

This becomes a **lightweight roadmap** visible to both you and the agents.

### 4. Multi-Track Awareness
Introduce the concept of **tracks** — multiple areas of focus:
- `blanks/`
- `companyos/`
- `fundraising/`

Each PRD, Pulse, or output is tagged with a `track` and lives under a corresponding folder.

This unlocks:
- Parallel agent activity across initiatives
- Weekly plans across departments
- Early VentureOS modeling (multiple teams, multiple products)

### 5. Historical Navigation Layer
Let agents access:
- `pulse-history/`
- `agent-activity-log.json`
- `outputs/` summaries from last 7–30 days

Enables:
- Time-aware recommendations (“last time this happened…”)
- Smarter Chief of Staff planning
- Weekly memory compression into `company-memo.json`

---

## 📁 Directory Structure

```bash
companyos/
├── schedule.json
├── memory/
│   ├── agent-activity-log.json
│   └── week-ahead.md
├── tracks/
│   ├── blanks/
│   ├── companyos/
│   └── fundraising/
├── outputs/
│   ├── YYYY-MM-DD.json
│   └── YYYY-MM-DD.summary.md
```

---

## 🧠 Why This Matters

CompanyOS moves from *reactive* to *temporal*.
It now thinks about:
- What agents should be doing *today, this week, this month*
- What’s happened recently
- What’s happening in parallel

This builds:
- A rhythm
- A shared memory graph
- A true operational calendar

---

## ✅ Summary

**CompanyOS v0.8** brings cadence and continuity to your agentic operating system:
- Agents act on schedule
- Memory is shared
- Planning happens weekly
- Company state becomes visible and traceable

You no longer just use CompanyOS day-to-day.
You run a company that *runs itself.*

Let’s build it.

