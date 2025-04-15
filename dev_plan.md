# CompanyOS v0.1 - Development Plan

This document outlines the phased development plan for building the Minimum Viable Product (MVP) of CompanyOS v0.1, the CLI/Node-based version.

## Phase 1: Foundation & Core Structure

Goal: Set up the basic project structure, static content, and TypeScript configuration.

1.  **Scaffold Repository:**
    *   Create the main `companyos/` directory.
    *   Create `src/` directory for TypeScript code.
    *   Create subdirectories: `src/agents/`, `src/pulse/`, `src/orchestrator/`, `src/utils/`.
    *   Create top-level directories: `context/`, `governance/`, `constitution/`, `pulse/` (for template), `orchestrator/` (for scripts if not directly run via node/ts-node), `outputs/`, `prompts/`, `company/`.
    *   Create initial `README.md` and `package.json` files.
    *   Create `.gitignore` file (add `node_modules/`, `dist/`, `.env`, `outputs/`, etc.).
2.  **TypeScript Setup:**
    *   Initialize TypeScript configuration: `npm install -D typescript @types/node`
    *   Create `tsconfig.json` with appropriate settings (e.g., target ES2020+, module NodeNext, outDir `dist/`, sourceMap true, rootDir `src/`).
3.  **Create Sample Context:**
    *   Create `context/context.json` with the example structure provided, representing the initial state.
4.  **Add Static Documents:**
    *   Create `governance/governance.md` and populate it with the described roles, decision classes, and rules (can be refined later).
    *   Create `constitution/constitution.md` and populate it with the purpose, vision, and values (can be refined later).
5.  **Create Pulse Template:**
    *   Create `pulse/pulse-template.md` with the structure for the daily check-in.
6.  **Define Core Types:**
    *   Create `src/types.ts`.
    *   Define shared TypeScript types for `Context` and `AgentResponse` to ensure consistency across modules.

## Phase 2: Agent Implementation (MVP)

Goal: Implement the first agent and basic LLM integration.

1.  **Implement `strategyAgent.ts`:**
    *   Create `src/agents/strategyAgent.ts`.
    *   Define the `runStrategyAgent` function interface accepting `Context` (import from `src/types.ts`).
    *   Initially, implement dummy logic that returns the specified `AgentResponse` JSON structure.
2.  **Set Up LLM Integration:**
    *   Create `src/utils/llm.ts` for calling a chosen LLM API (e.g., OpenAI, Claude, Gemini).
    *   *(Refinement: Design the utility to support configuration-based selection between different LLMs for future portability, even if starting with one.)*
    *   Install required SDKs and `dotenv`: `npm install <llm-sdk> dotenv`
    *   Implement handling of API keys via environment variables (`.env` file and `dotenv`).
    *   Define basic prompt construction logic.
3.  **Set Up Basic Logging (Optional):**
    *   *(Consider if needed for MVP: If simple `console.log` is sufficient initially, skip creating a dedicated `src/utils/logger.ts` until Phase 4/5)*.
    *   If implementing: Create `src/utils/logger.ts` (can start with simple `console.log` wrappers or use a library like `pino`).
    *   Integrate basic logging (info, error) into `src/utils/llm.ts` and the initial agent logic.
4.  **Integrate LLM into `strategyAgent`:**
    *   Update `runStrategyAgent` to:
        *   Construct a prompt using the input `Context`.
        *   Call the LLM API via the integration utility.
        *   Parse the LLM response into the required `AgentResponse` JSON structure.
        *   Include basic error handling.

## Phase 3: Orchestration & Input System

Goal: Connect the agent to the context and enable context updates via the Pulse system.

1.  **Implement `orchestrator/runAllAgents.ts`:**
    *   Create `src/orchestrator/runAllAgents.ts`.
    *   Add logic to read `context/latest.json`.
    *   Call the `runStrategyAgent` function (imported from `src/agents/`), passing the context.
    *   Integrate logging for orchestrator start/end, agent calls, and output saving.
    *   Structure the output file to hold multiple agent responses and potential human input/overrides:
        ```json
        {
          "date": "YYYY-MM-DD",
          "context_used": { ... }, // Copy of the context for this run
          "responses": {
            "strategy": { ... },
            // "ethics": { ... } // Later phases
          },
          "creative_director_input": { // Placeholder for future UI/manual input
            "notes": null,
            "manual_overrides": {}
          }
        }
        ```
2.  **Implement `pulse/runPulse.ts`:**
    *   Create `src/pulse/runPulse.ts`.
    *   *(Optional: Install CLI helper library: `npm install inquirer @types/inquirer`)*
    *   Implement a simple CLI interaction (e.g., using Node.js `readline` or `inquirer`) to prompt the user for Pulse inputs (goal, blockers, etc.).
    *   Convert the user's input into the JSON structure defined for `Context`.
    *   Save context to `context/YYYY-MM-DD.json` and update `context/latest.json` (symlink or copy).
    *   Integrate logging for script execution and context saving.
3.  **Set Up Prompt Templates:**
    *   Create a `prompts/` directory.
    *   Create initial prompt text files (e.g., `prompts/strategyPrompt.txt`).
    *   Update the `strategyAgent` (and later others) to load and use these external prompt templates instead of hardcoding them.
4.  **Enable Pulse History Access in Orchestrator:**
    *   Modify `runAllAgents.ts` to not only load `context/latest.json` but also the JSON files from the last N (e.g., 7 or 30) days from the `context/` directory.
    *   Pass this historical data (e.g., as `pulseHistory: Context[]`) to the agents.
5.  **Create `company/` Folder for Org Docs:**
    *   Create the `company/` directory.
    *   Add subfolders like `legal/`, `financials/`, `team/`.
    *   Add placeholder/sample files (e.g., `company/financials/runway.md`, `company/legal/formation.txt`).
    *   Create `company/summary.md` to hold key distilled information.
    *   Update agent prompt logic (within the orchestrator or agent files) to optionally inject content from `company/summary.md` into prompts based on agent type or configuration.
6.  **Update `README.md`:**
    *   Add instructions for setup (installing dependencies, setting API keys).
    *   Add instructions for running the Pulse and Orchestrator scripts.
    *   Document required environment variables (e.g., `OPENAI_API_KEY`) and how to set them (e.g., using a `.env` file).

## Phase 4: Expansion & Refinement (Completing MVP)

Goal: Implement remaining MVP agents, refine core components, and add basic project setup.

1.  **Implement Remaining MVP Agents:**
    *   Create and implement `src/agents/ethicsAgent.ts` and `src/agents/wellnessAgent.ts`, following the same pattern as `strategyAgent` (using LLM integration and logging).
2.  **Update Orchestrator:**
    *   Modify `runAllAgents.ts` to sequentially run all implemented agents (`strategy`, `ethics`, `wellness`).
    *   Aggregate the responses from all agents into the single timestamped output JSON file.
3.  **Refine Agent Logic & Input Types:**
    *   Update the input type definition used by agents (e.g., `AgentInput` in `types.ts`) to accept the richer context:
        ```ts
        type AgentInput = {
          currentPulse: Context;
          pulseHistory?: Context[]; // Array of past Context objects
          companyDocs?: { summary: string; /* other fields as needed */ };
        }
        ```
    *   Improve prompt engineering for all agents, making use of the new historical and company context.
    *   Enhance response parsing and error handling.
4.  **Enhance Pulse Script:**
    *   Improve `src/pulse/runPulse.ts` user experience (e.g., potentially loading the template, better input validation).
    *   Add basic input validation logic.
5.  **Populate `package.json` & Define Scripts:**
    *   Ensure all necessary dependencies (e.g., LLM SDKs, `dotenv`, `typescript`, `@types/node`, potentially `inquirer`) are listed.
    *   Define basic npm scripts:
        *   `"build": "tsc"`
        *   `"start:pulse": "node dist/pulse/runPulse.js"` (or `ts-node src/pulse/runPulse.ts` for dev)
        *   `"start:orchestrator": "node dist/orchestrator/runAllAgents.js"` (or `ts-node src/orchestrator/runAllAgents.ts` for dev)
6.  **Update `README.md`:**
    *   Add instructions for setup (installing dependencies, setting API keys).
    *   Add instructions for running the Pulse and Orchestrator scripts.
    *   Outline steps for implementing features listed in "Future Extensions":
        *   Web UI Development
        *   Slack Integration
        *   Multi-Org Support
        *   Agent Memory/Scoring
        *   Pulse Analytics
        *   Public API
        *   Configuration File (`companyos.config.json`): Introduce a configuration file to manage settings like org name, active agents, default LLM, etc.

## Phase 5: Future Considerations (Post-MVP)

Goal: Document potential next steps beyond the v0.1 CLI version.

*   Outline steps for implementing features listed in "Future Extensions":
    *   Web UI Development
    *   Slack Integration
    *   Multi-Org Support
    *   Agent Memory/Scoring
    *   Pulse Analytics
    *   Public API
