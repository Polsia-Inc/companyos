# CompanyOS v0.2 Development Plan: From Mirror to Operator

**Goal:** Make CompanyOS useful *enough* that Ben can confidently follow it to ship Blanks, and truthfully say: *"Blanks was built by CompanyOS."*

This plan focuses on making CompanyOS a living operating layer that synthesizes, prioritizes, surfaces insight, reduces noise, and gives clear direction. The ultimate goal of CompanyOS isn't just output, it's cognitive leverage — replacing the CEO's need to manually prioritize, reflect, or delegate every morning.

---

## 🎯 Target State (v0.2)

-   **Expanded Disciplines:** Add Product, Engineering, and Marketing agents.
-   **Synthesis Layer:** Introduce a Chief of Staff Agent to synthesize all agent responses into a clear directive.
-   **Feedback Mechanism:** Implement an optional Trust/Feedback system for agent outputs.
-   **Improved Output:** Provide a clear "Today's Summary" console output and optionally write to `.summary.md`.
-   **Early Memory:** Scaffold a lightweight, scoped memory system.

---

##  phased Development Plan

### Phase 1: Expand Agent Perspectives

**Goal:** Add core domain expertise beyond the initial agents.

1.  ✅ **Create New Agent Prompts:**
    *   ✅ `prompts/productPrompt.txt` (Focus: UX quality, feature clarity, user-first mindset)
    *   ✅ `prompts/engineeringPrompt.txt` (Focus: performance, DX, technical debt, blockers)
    *   ✅ `prompts/marketingPrompt.txt` (Focus: messaging, virality, positioning)
2.  ✅ **Implement New Agent Runners:**
    *   ✅ Create `src/agents/productAgent.ts`
    *   ✅ Create `src/agents/engineeringAgent.ts`
    *   ✅ Create `src/agents/marketingAgent.ts`
3.  ✅ **Update Orchestrator:**
    *   ✅ Modify the main execution flow (`src/orchestrator/runAllAgents.ts`) to run all agents sequentially (Strategy, Ethics, Wellness, Product, Engineering, Marketing).
4.  ✅ **Directory Structure Setup:**
    *   ✅ Ensure the `prompts/` and `src/agents/` directories are organized correctly (Confirmed directories exist).

**Testing:** After this phase, the system should run all agents and produce individual outputs for each. Verify that the new agents run and generate some form of output (currently placeholder strings) based on their prompts.

---

### Phase 2: Implement the Chief of Staff Agent

**Goal:** Synthesize individual agent outputs into a single, prioritized directive.

1.  **Create Chief of Staff Prompt:**
    *   `prompts/chiefOfStaffPrompt.txt` (Instructs the agent to read Pulse, all agent responses, and the previous summary, then output top priorities, ignored items, urgency, and confidence).
2.  **Implement Chief of Staff Agent Runner:**
    *   Create `src/agents/chiefOfStaffAgent.ts`.
    *   This agent will take the outputs from all other agents, the current Pulse, and potentially the previous day's summary as input.
    *   It will output a structured `chief_of_staff_summary` containing a simple directive: What to **Do**, What to **Delay**, What to **Ignore**, and What to **Delegate** (linking actions to specific agents or systems where applicable).
    *   *(Optional Suggestion): Consider enhancing the output to include "Defer" or "Delegate" actions (e.g., "Delegate X to Engineering Agent") in addition to "Do/Ignore". This paves the way for future agent-initiated workflows.*
3.  **Update Orchestrator:**
    *   Run the Chief of Staff agent *after* all other agents have completed.
    *   Pass the necessary inputs to the Chief of Staff agent.

**Testing:** After this phase, the system should run all agents, and then the Chief of Staff agent should produce a synthesized summary based on the other agents' outputs.

---

### Phase 3: Introduce Memory and Feedback

**Goal:** Add persistence and a mechanism for user refinement.

1.  **Scaffold Memory Layer:**
    *   Create the `memory/` directory.
    *   Create `memory/company-memo.json`. Define initial schema for weekly memory summaries (manual or LLM-generated).
    *   *Optional:* Integrate reading `company-memo.json` as context for the Chief of Staff agent.
2.  **Implement Feedback Hook:**
    *   Modify the `start:review` script (or equivalent mechanism).
    *   Prompt the user (Ben) to rate each agent's output (e.g., 1-5).
    *   Allow text feedback on what worked/didn't.
    *   Save this feedback into the daily output JSON (e.g., under `creative_director_input`).

**Testing:** Verify that the `company-memo.json` file is created. Test the feedback mechanism by running the review script and ensuring the ratings/comments are captured in the output file. Check if the Chief of Staff agent can optionally read the memo.

---

### Phase 4: Refine Output and Finalize Structure

**Goal:** Improve the usability of the output and ensure the file structure is correct.

1.  **Enhance Terminal Output:**
    *   Ensure individual agent outputs are displayed clearly during the run (if desired).
    *   Implement the final formatted "Chief of Staff Summary" block to be printed at the end of the execution.
    ```txt
    ====== 🧠 Chief of Staff Summary ======
    TODAY'S DIRECTIVE:
    ✅ DO:
       1. [Actionable Task 1]
    ⏳ DELAY:
       1. [Task to revisit later]
    ❌ IGNORE:
       1. [Distraction or low-priority item]
    Delegated:
       1. [Task assigned to specific agent/system]

    Why:
    • [Strategic insight here]
    • [Engineering flag here]

    Confidence: 0.92
    =====================================
    ```
2.  **Implement Summary File Output:**
    *   Save the Chief of Staff agent's structured summary to `outputs/YYYY-MM-DD.summary.md`.
3.  **Verify Final Directory Structure:**
    *   Confirm all new files and directories match the target structure:
    ```
    companyos/
    ├── prompts/
    │   ├── productPrompt.txt
    │   ├── engineeringPrompt.txt
    │   ├── marketingPrompt.txt
    │   └── chiefOfStaffPrompt.txt
    ├── src/agents/
    │   ├── productAgent.ts
    │   ├── engineeringAgent.ts
    │   ├── marketingAgent.ts
    │   └── chiefOfStaffAgent.ts
    ├── memory/
    │   └── company-memo.json
    ├── outputs/
    │   ├── YYYY-MM-DD.json
    │   └── YYYY-MM-DD.summary.md
    # ... other existing files/dirs
    ```

**Testing:** Run the full process. Verify the terminal output matches the desired format. Check that the `.summary.md` file is created correctly in the `outputs` directory.

---

## 🚀 Summary of Plan

This phased approach allows for incremental development and testing:

1.  **Phase 1:** Get all agent voices running.
2.  **Phase 2:** Add the critical synthesis layer.
3.  **Phase 3:** Introduce basic memory and user feedback.
4.  **Phase 4:** Polish the user-facing output.

Following this plan will transition CompanyOS from an echo chamber to a functional operating layer providing synthesized daily direction.

---

## 🔭 Future Agent Expansion & Prioritization

*(This section captures longer-term thinking about agent expansion beyond v0.2, based on the principle of balancing vision with pragmatism.)*

### Guiding Principle: Build Only What You'd Want in a Founding Team

If you were hiring 5 core **thinkers** tomorrow, who would they be? That forms the core agent council.

### Agent Tiers for Phased Introduction

Here's a list of **possible agents**, categorized for prioritization:

| Tier | Description |
|------|-------------|
| **🧠 Tier 1 — Critical Core** | Foundational for daily multi-dimensional clarity. |
| **🔄 Tier 2 — High leverage (Soon)** | Add once the core feels tight and their domain becomes a daily focus. |
| **🧩 Tier 3 — Optional/Contextual** | Add only as needed or if the product/company evolves significantly. |

---

#### 🧠 **Tier 1 — Critical Core (Target: v0.3 Council)**

| Agent | Focus |
|-------|-------|
| **Strategy Agent** | Strategic priorities, tradeoffs, milestones |
| **Product Agent** | UX quality, app flow, user empathy |
| **Engineering Agent** | Technical debt, bottlenecks, bundling, code gen |
| **Marketing Agent** | Distribution, messaging, virality |
| **Ethics Agent** | Alignment with values, risks, long-term trust |
| **Wellness Agent** | Your energy, burnout risk, mental/emotional clarity |
| **Chief of Staff Agent** | Synthesizes all of the above into a daily directive |

---

#### 🔄 **Tier 2 — High Leverage (Consider for v0.4+)**

| Agent | Focus |
|-------|-------|
| **Finance Agent** | Runway, infra cost, cap table, funding tradeoffs |
| **Fundraising Agent** | Investor communication, round planning, term sheet review |
| **Customer Agent** | Feedback analysis, user motivation patterns |
| **Community Agent** | Contributor engagement, viral feedback loops, social design |
| **Legal Agent** | App Store risk, IP exposure, ToS + moderation design |
| **Design Agent** | UI, motion, animation consistency, visual feel |
| **Growth Agent** | Retention, onboarding funnel, metric instrumentation |

---

#### 🧩 **Tier 3 — Optional / Specialized (Consider for v1.0+)**

| Agent | Focus |
|-------|-------|
| **Recruiting Agent** | Sourcing/hiring early team, outsourcing vs in-house |
| **Internationalization Agent** | Localization, global UI sensitivity, cultural UX |
| **AI Research Agent** | Tracking LLM improvements, model evaluation |
| **Compliance Agent** | If expanding into regulated territory (e.g., health, fintech) |
| **AI Governance Agent** | Meta-level system reflection, bias detection, memory ethics |

---

### Proposed Phased Agent Rollout (Beyond v0.2)

| Phase | Agents Introduced/Active |
|-------|--------------------------|
| **v0.3** | Strategy, Product, Engineering, Marketing, Ethics, Wellness, Chief of Staff (The Tier 1 Council) |
| **v0.4** | Consider adding Finance, Fundraising, Design, Customer (from Tier 2 based on need) |
| **v1.0+** | Explore Tier 3 agents and potentially allow user customization of active agents. |

### Recommendation Summary (Beyond v0.2)

*   Focus on the **Tier 1 council** for v0.3 first.
*   Add **Tier 2 agents** (like Finance) pragmatically; add only if they become part of daily decision friction.
*   Keep **Tier 3 agents** modular but inactive until a clear need arises. 