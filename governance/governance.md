# CompanyOS Governance v0.1

This document outlines the governance system used by CompanyOS instances to manage decision-making between agents and the human operator (Creative Director).

---

## 1. Core Roles

Each CompanyOS instance has a dynamic org chart composed of human and agent roles.

### Human-Controlled Roles

- **Creative Director** *(default decision-maker)*  
  Emotionally expressive, directional, and product-led.  
  Can approve, override, or revoke decisions.

- **CEO (Optional)**  
  Cold-blooded, rational, long-term aligned.  
  May be human or agent-controlled in future versions.

### Core Agent Roles (Agent or Hybrid)

- **Chief of Staff** – Routes tasks, tracks progress, maintains pulse continuity
- **VP of Engineering** – Oversees technical implementation, debugs, prioritizes
- **VP of Product** – Translates vision into actionable features, aligns teams
- **VP of Finance** – Models capital runway, evaluates fundraising deals
- **VP of Growth / Marketing** – Proposes campaigns, virality loops, channels
- **Chief Ethics Officer** – Monitors ethical implications of decisions
- **Head of HR** – Detects burnout, proposes hiring, evaluates performance
- **Legal Agent** – Drafts or flags terms, IP, contracts
- **UX / UI Director** – Visual and interaction quality
- **Customer Research** – Synthesizes feedback, suggests pivots
- **Head of Ops** – Tooling, infra, execution health

> Roles are modular and can be specialized or delegated.

---

## 2. Decision Classes

Every CompanyOS instance must track and govern key decision types:

| Class               | Examples |
|---------------------|----------|
| **Fundraising**       | Term sheets, SAFEs, dilution decisions |
| **Hiring**            | Contractors, team additions |
| **Promotion**         | Role upgrades, title changes |
| **Product Roadmap**   | Feature prioritization, new directions |
| **Pivots / Repositioning** | Market/mission shift |
| **Pricing / Monetization** | Paywall strategies, freemium decisions |
| **Ethical Flags**     | Data use, manipulation risk |
| **Capital Allocation**| Budgeting, spend approvals |
| **Company Creation**  | Spinouts, new team instancing |
| **Research Requests** | Agents asking for human-assisted interviews |

---

## 3. Approval Flow (v0.1)

- All final decisions are made by the **Creative Director**
- Agents **propose, evaluate, flag** options
- Human operator **reviews + approves or rejects**

### Agent Response Structure:

- ✅ **Proposed Action**
- ⚠️ **Concerns or caveats**
- ❓ **Questions for clarification**

### Creative Director Responses:

- ✅ **Yes**
- ❌ **No**
- ✏️ **Additional Input**

---

## 4. Delegation Rules

- The Creative Director may delegate decision power
- Delegation may be:
  - **Role-based:** (e.g., “VP of Product can approve roadmap changes”)
  - **Time-based:** (e.g., “For 7 days, approve onboarding tweaks”)
  - **Task-based:** (e.g., “Approve orb PRs only”)

All delegation must be:
- **Revocable**
- **Logged with context:**
  - Who delegated
  - To whom
  - Why
  - Expiry or scope

---

## 5. Escalation & Overrides

- **Chief Ethics Officer** may **pause** any decision
- **Creative Director** may **override**, but must log rationale
- **Conflicts between agents** are escalated automatically to the Creative Director for resolution
- **Disagreements and overrides are versioned and logged**

This ensures:
- Autonomy with accountability  
- Transparency of disagreement  
- Ethical friction without bureaucracy

---

## ✅ Governance Status Check

The system is considered “live” when:

- [ ] Creative Director is defined
- [ ] At least 3 agents are running (Strategy, Ethics, Wellness)
- [ ] Daily Pulse ritual is functional
- [ ] Delegation toggles are usable
- [ ] Governance has been versioned and stored

---

*This document is a living protocol and will evolve with the company’s needs and the sophistication of its agents.*
