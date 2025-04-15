# CompanyOS Governance v0.1

This document outlines the initial governance structure for decision-making within CompanyOS instances.

## 1. Core Roles

*   **Creative Director (Human):** The primary human operator, responsible for setting goals via Pulse, reviewing agent proposals, and making final decisions.
*   **Strategy Agent:** Provides strategic recommendations, identifies opportunities and risks.
*   **Ethics Agent:** Reviews proposals and system behavior against defined ethical guidelines and company values.
*   **Wellness Agent:** Monitors system/founder state based on Pulse and suggests adjustments for sustainable operation.
*   **(Future):** Legal Agent, Finance Agent, Engineering Lead Agent, etc.

## 2. Decision Classes (Examples)

*   **Strategic:** Setting quarterly goals, major product pivots.
*   **Operational:** Daily task prioritization, resource allocation.
*   **Ethical:** Handling sensitive user data, responding to controversial events.
*   **Financial:** Budget approval, fundraising (Future).
*   **Hiring:** Candidate selection (Future).

## 3. Approval Flow Rules (Initial - Manual)

1.  **Pulse Input:** Creative Director provides daily context.
2.  **Agent Proposals:** Orchestrator runs agents, generating proposals (`outputs/YYYY-MM-DD.json`).
3.  **Human Review:** Creative Director reviews proposals.
4.  **Decision:** Creative Director makes final decision (implicit approval or explicit override/modification noted externally for now).

## 4. Delegation + Override Rules

*   **Initial:** All final decisions rest with the Creative Director.
*   **Future:** Define rules for agent autonomy on specific, low-risk decisions.
*   **Override:** Creative Director can override any agent proposal, ideally noting the reason.

## 5. Escalation Policies

*   **Ethical Flags:** Proposals flagged by the Ethics Agent require mandatory review by the Creative Director before proceeding.
*   **High Conflict:** Significant disagreement between agent proposals may require the Creative Director to investigate further or provide clarifying direction.

*This document is a living draft and will evolve as CompanyOS matures.*
