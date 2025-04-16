# Engineering Execution Plan: CompanyOS v0.2.5

This document outlines the phased engineering plan to implement the features described in the `companyOS_v0.25_PRD.md`, building upon the existing v0.2 codebase. The goal is to achieve a functional, testable product quickly while maintaining code quality.

## Phase 1: Agent One-on-One Framework

**Goal:** Implement the core interactive loop where the user engages in a brief one-on-one conversation with each enabled agent sequentially.

**Tasks:**

1.  **Modify Orchestrator (`src/orchestrator/runAllAgents.ts`):**
    *   ✅ Change the main loop from sequential execution to interactive, one-agent-at-a-time presentation.
    *   ✅ Integrate CLI prompts (`inquirer` or similar) to:
        *   ✅ Display the agent's initial brief summary.
        *   ✅ Accept user commands: `Next` (proceed), `Respond` (provide input), `Skip` (skip current agent). (Note: `Pass` removed as per v0.2.5 flow, labels updated for clarity).
    *   ✅ Maintain state for the current agent interaction (initial implementation via `interactionHistory` array).

2.  **Refactor Agent Structure (`src/agents/*.ts` and potentially `src/types.ts`):**
    *   ✅ Modify the primary agent function signature/interface (Created `get...Brief` functions).
    *   ✅ Add a new agent function/method signature/interface to handle replies (Created `get...Reply` functions).
    *   ✅ Update `src/types.ts` to reflect these new interaction structures (Added `AgentBrief`, `UserResponse`, `AgentReply`, `AgentInteraction`, `AgentBriefInput`, `AgentReplyInput`).

3.  **Update Prompts (`prompts/*.txt`):**
    *   ✅ Adjust existing agent prompts to generate the short initial brief (Renamed to `...BriefPrompt.txt`).
    *   ✅ Create new prompt templates for generating the follow-up reply (Created `...ReplyPrompt.txt`).

**Additional Completed Tasks (Phase 1 Refinements):**
*   ✅ Added `inquirer` dependency.
*   ✅ Updated agent parsing logic (`parseLLMStringResponse`) to format JSON output conversationally.
*   ✅ Updated interactive prompt labels (`Next`/`Skip`) for better clarity regarding CoS input.

**Testing:** ✅ (Completed successfully)

*   Run `npm run start:orchestrator`.
*   Verify the first agent's brief is displayed.
*   Test `Skip`: The orchestrator should move to the next agent.
*   Test `Next`: The orchestrator should move to the next agent.
*   Test `Respond`:
    *   The orchestrator should prompt for user input.
    *   The agent should generate a reply based on the input.
    *   The orchestrator should display the reply and move to the next agent.
*   Focus on the flow and interaction logic; the *quality* of agent responses is secondary at this stage.

## Phase 2: Chief of Staff Synthesis Update

**Goal:** Enable the Chief of Staff (CoS) agent to synthesize the full context of the one-on-one interactions into its final summary.

**Tasks:**

1.  **Modify Orchestrator (`src/orchestrator/runAllAgents.ts`):**
    *   ✅ Accumulate the complete interaction data for each agent (`interactionHistory` array). (Done in Phase 1, used here).
    *   ✅ After all agent interactions are complete, pass the collected history (along with the original Pulse) to the `chiefOfStaffAgent`.

2.  **Update Chief of Staff Agent (`src/agents/chiefOfStaffAgent.ts`):**
    *   ✅ Modify the agent's input type/interface to accept the list of agent conversation histories (`AgentInteraction[]`) (Used new `ChiefOfStaffInput` type).
    *   ✅ Update the agent's internal logic and prompt (`prompts/chiefOfStaffPrompt.txt`) to process these histories and generate the final prioritized recommendation.

3.  **Enhance Output Saving:**
    *   ✅ Update the JSON (`outputs/YYYY-MM-DD.json`) and Markdown (`outputs/YYYY-MM-DD.summary.md`) output generation to include:
        *   ✅ The full conversation thread for each agent (`interactionHistory`).
        *   ✅ The final CoS recommendation derived from these threads.

**Testing:** ✅ (Completed successfully)

*   Run `npm run start:orchestrator`.
*   Interact with several agents using `Next`, `Respond`, and `Skip`.
*   Verify the CoS agent runs *after* all interactions are complete.
*   Check the console output for the CoS summary.
*   Inspect the generated JSON and Markdown files in `outputs/` to confirm:
    *   Conversation histories for each interacted agent are present.
    *   The CoS summary reflects the content of the interactions.

## Phase 3: Agent Enable/Disable Toggle

**Goal:** Allow users (or developers via config) to easily enable or disable specific agents from participating in the daily one-on-one loop.

**Tasks:**

1.  **Create Configuration:**
    *   Introduce a simple configuration mechanism (e.g., a `config/agents.json` file).
    *   This file should list all potentially available agents and a boolean flag indicating if they are active (e.g., `{"wellnessAgent": true, "strategyAgent": true, "legalAgent": false}`).

2.  **Modify Orchestrator (`src/orchestrator/runAllAgents.ts`):**
    *   At startup, read the agent configuration file.
    *   Filter the list of agents to be included in the interactive loop based on the `enabled` status in the configuration.

**Testing:**

*   Modify the `config/agents.json` file, enabling/disabling different combinations of agents.
*   Run `npm run start:orchestrator`.
*   Verify that only the agents marked as `true` in the configuration file are presented during the interactive session.
*   Confirm that skipped/disabled agents' data does not appear in the final CoS synthesis input or the output files. 