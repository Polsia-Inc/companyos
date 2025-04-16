# Product Requirements Document (Draft): CompanyOS v0.3 - Enhanced Agent Conversations

**Version:** Draft 0.1
**Date:** 2023-10-27
**Status:** Proposed (For future consideration, post-v0.2.5)

---

**1. Overview:**

This document proposes an enhanced interaction model for the Agent One-on-Ones feature in CompanyOS, building upon the foundation laid in v0.2.5. The goal is to enable deeper, multi-turn conversations with individual agents, allowing users to refine agent outputs based on explicit agreement or disagreement before moving on. This aims to increase the personalization and utility of each agent's contribution before the final Chief of Staff synthesis.

---

**2. Goals:**

*   Allow users to engage in multiple back-and-forth exchanges with a single agent within one session.
*   Enable users to guide agents to revise their recommendations/concerns based on agreement or disagreement.
*   Provide a clearer sense of control over the agent's final input into the Chief of Staff synthesis.
*   Maintain a conversational feel while allowing for more substantive interaction when desired.

---

**3. Core Features:**

**3.1. Initial Interaction (As per v0.2.5):**
    *   Agent presents its initial brief based on the Pulse.
    *   User chooses:
        *   `Include & Next`: Acknowledge brief, move to next agent. (Formerly 'Next')
        *   `Respond`: Provide text input for the agent.
        *   `Exclude & Skip`: Disregard brief, move to next agent. (Formerly 'Skip')

**3.2. Multi-Turn Response Loop:**
    *   If User chose `Respond`:
        *   Agent provides its reply (integrating user feedback).
        *   User sees the agent's reply and is presented with **new choices**:
            *   `Respond Again`: Provide further text input, repeating the loop.
            *   `Revise Ideas (I Agree)`: Signal agreement with the user's direction in the conversation. Trigger agent to revise its output.
            *   `Revise Ideas (I Disagree)`: Signal disagreement or correction. Trigger agent to revise its output.
            *   `Finalize & Next`: Accept the current state of the agent's output (last reply or initial brief) and move to the next agent.
            *   `Finalize & Skip`: Discard the current agent's contribution entirely and move to the next agent.

**3.3. Agent Revision Logic:**
    *   When `Revise Ideas (Agree/Disagree)` is chosen:
        *   The agent receives the conversation history *and* the Agree/Disagree signal.
        *   The agent uses specific prompt logic to *rewrite* its core output (e.g., recommendations, concerns, assessment), reflecting the user's stance.
        *   The agent presents the *revised* set of ideas/recommendations/concerns.
        *   The user sees the revised output and is presented again with choices (e.g., `Respond Again`, `Finalize & Next`, `Finalize & Skip`).

**3.4. Data Capture for CoS:**
    *   The full conversation history (all user inputs, agent replies, revision signals, final revised outputs) for each agent is captured.
    *   The final state (agreed-upon revised ideas, or the last reply if finalized directly, or skipped status) is clearly marked for the Chief of Staff synthesis.

---

**4. Technical Considerations:**

*   **Orchestrator State:** Requires more complex state management in `runAllAgents.ts` to handle the loops and new choices.
*   **Agent Logic:** Agents need new functions/logic specifically for handling the `Revise Ideas` signals.
*   **Prompt Engineering:** Requires new prompts for the revision tasks, guiding the LLM to rewrite outputs based on Agree/Disagree context.
*   **Types (`types.ts`):** May require adjustments to `AgentInteraction` to store revision signals and potentially structured revised outputs. Potentially re-introduce structured fields (recommendations, concerns) if simple strings are insufficient for revision.

---

**5. Out of Scope (for this specific enhancement):**

*   Agent memory between sessions.
*   Proactive agent actions or inter-agent communication during the one-on-ones.

---

**6. Success Criteria:**

*   Users can successfully engage in >1 response/reply cycle with an agent.
*   Users can trigger and observe revised outputs based on Agree/Disagree signals.
*   Chief of Staff agent successfully receives and can potentially leverage the enriched interaction history (including revisions/signals).
*   Users report a greater sense of control and collaboration during agent interactions.
