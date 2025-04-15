# CompanyOS v0.1

Agentic Operating System to Build and Run AI-Native Companies (CLI MVP)

## Overview

CompanyOS is an AI-native system designed to let solopreneurs and founders run companies with a team of LLM agents. This is the CLI-based Minimum Viable Product (MVP).

It includes:
*   A daily **Pulse** script (`npm run start:pulse`) to capture your goals, state, and context.
*   An **Orchestrator** script (`npm run start:orchestrator`) that runs configured AI agents based on the latest Pulse.
*   Initial agents for **Strategy**, **Ethics**, and **Wellness**.
*   Context management (daily and historical pulse data).
*   LLM integration (currently OpenAI).

## Setup

1.  **Clone Repository:**
    ```bash
    git clone <repository_url> # Replace with your repo URL
    cd companyos
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file and add your OpenAI API key:
        ```dotenv
        OPENAI_API_KEY=your_openai_api_key_here
        ```

4.  **(Optional) Review Static Docs:**
    *   Check `governance/governance.md` and `constitution/constitution.md` for the system's guiding principles.
    *   Review `company/summary.md` and add relevant details about your specific venture.

## Usage

1.  **Run Daily Pulse:**
    *   Execute the pulse script each day to provide context to the agents.
    ```bash
    npm run start:pulse
    ```
    *   Follow the prompts to input your goal, blockers, feedback, energy, and emotional state.
    *   This creates `context/YYYY-MM-DD.json` and updates `context/latest.json`.

2.  **Run Orchestrator:**
    *   Execute the orchestrator script to run the agents based on the latest pulse.
    ```bash
    npm run start:orchestrator
    ```
    *   This will:
        *   Load the latest context.
        *   Run the Strategy, Ethics, and Wellness agents.
        *   Make calls to the OpenAI API.
        *   Save the combined results to `outputs/YYYY-MM-DD.json`.

3.  **Review Output:**
    *   Check the generated JSON file in the `outputs/` directory to see the agents' recommendations, flags, and assessments.

## Development

*   **Build TypeScript:**
    ```bash
    npm run build
    ```
*   **Run Scripts with ts-node (for faster dev):**
    ```bash
    npm run dev:pulse
    npm run dev:orchestrator
    ```

## Project Structure

*   `src/`: TypeScript source code
    *   `agents/`: Individual agent logic
    *   `orchestrator/`: Main script to run agents
    *   `pulse/`: Script to capture daily input
    *   `utils/`: Shared utilities (like LLM caller)
    *   `types.ts`: Core TypeScript type definitions
*   `prompts/`: Text files containing prompts for each agent
*   `context/`: Stores daily pulse data (`YYYY-MM-DD.json`) and `latest.json`
*   `outputs/`: Stores the JSON output from orchestrator runs
*   `company/`: Holds static documents about the company (summary, legal, etc.)
*   `governance/`: Governance rules document
*   `constitution/`: Core principles document
*   `dist/`: Compiled JavaScript output (ignored by git)
*   `node_modules/`: Project dependencies (ignored by git)
*   `.env`: Local environment variables (API keys - ignored by git)
*   `.gitignore`: Specifies intentionally untracked files
*   `package.json`, `package-lock.json`: Node.js project config and dependencies
*   `tsconfig.json`: TypeScript compiler configuration
