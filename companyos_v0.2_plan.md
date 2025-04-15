# CompanyOS v0.2 Development Plan: From Mirror to Operator

**Goal:** Make CompanyOS useful *enough* that Ben can confidently follow it to ship Blanks, and truthfully say: *"Blanks was built by CompanyOS."*

This plan focuses on making CompanyOS a living operating layer that synthesizes, prioritizes, surfaces insight, reduces noise, and gives clear direction.

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

1.  **Create New Agent Prompts:**
    *   `prompts/productPrompt.txt` (Focus: UX quality, feature clarity, user-first mindset)
    *   `prompts/engineeringPrompt.txt` (Focus: performance, DX, technical debt, blockers)
    *   `prompts/marketingPrompt.txt` (Focus: messaging, virality, positioning)
2.  **Implement New Agent Runners:**
    *   Create `src/agents/productAgent.ts`
    *   Create `src/agents/engineeringAgent.ts`
    *   Create `src/agents/marketingAgent.ts`
3.  **Update Orchestrator:**
    *   Modify the main execution flow to run all agents sequentially (Strategy, Ethics, Wellness, Product, Engineering, Marketing).
4.  **Directory Structure Setup:**
    *   Ensure the `prompts/` and `src/agents/` directories are organized correctly.

**Testing:** After this phase, the system should run all agents and produce individual outputs for each. Verify that the new agents run and generate some form of output based on their prompts.

---

### Phase 2: Implement the Chief of Staff Agent

**Goal:** Synthesize individual agent outputs into a single, prioritized directive.

1.  **Create Chief of Staff Prompt:**
    *   `prompts/chiefOfStaffPrompt.txt` (Instructs the agent to read Pulse, all agent responses, and the previous summary, then output top priorities, ignored items, urgency, and confidence).
2.  **Implement Chief of Staff Agent Runner:**
    *   Create `src/agents/chiefOfStaffAgent.ts`.
    *   This agent will take the outputs from all other agents, the current Pulse, and potentially the previous day's summary as input.
    *   It will output a structured `chief_of_staff_summary`.
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
    *   Create `memory/company-memo.json`. Initially, this can be a simple placeholder structure. Define how it might store weekly summaries (manual or LLM-generated).
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
    TODAY:
    1. Do X
    2. Ignore Y
    3. Move Z forward

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