**Product Requirements Document: CompanyOS v0.2.5**

---

**Overview:**
CompanyOS v0.2.5 introduces the foundational loop for multi-agent collaboration after a daily Pulse submission. Each enabled agent represents a domain (e.g. wellness, legal, growth) and engages in a lightweight one-on-one with the user. The goal is to create a deeply personal, collaborative support experience that mimics having a real team who cares about you.

---

**Goals:**
- Let the user feel heard and supported by a team of domain-specific agents
- Create structured one-on-one loops where agents offer feedback and advice
- Enable the Chief of Staff to synthesize all inputs into one final actionable plan
- Keep the experience emotionally intelligent, lightweight, and modular

---

**Core Features:**

1. **Daily Pulse (Input Layer)**
   - User fills out a structured reflection form
     - Emotional state
     - What’s on their mind
     - Current worries, goals, blockers
   - Pulse becomes the shared context for all agents

2. **Agent One-on-Ones (Loop Layer)**
   - Each *enabled* agent receives the pulse as input
   - Agent returns a brief summary:
     - "Hey Ben, based on what you said, here’s what I think…"
     - Includes personalized advice or insight (1–3 sentences max)
   - User can then:
     - **Next** – if they agree or don’t want to engage
     - **Respond** – to give feedback or ask clarifying questions
   - If the user responds, agent replies once more, integrating the feedback
   - User can continue or say **Pass** to end that thread

3. **Conversation Control**
   - Only one agent is visible at a time
   - User moves linearly from one agent to the next
   - Option to **Skip** an agent entirely
   - Agents cannot access each other's conversations

4. **Chief of Staff Summary (Synthesis Layer)**
   - After all one-on-ones, Chief of Staff receives:
     - The original pulse
     - All agents’ briefs
     - The full thread for each agent: every agent message and user response
   - Returns a final recommendation:
     - "Here’s what I think you should prioritize today."
     - Optional reasoning or encouragement
   - User can engage further with Chief of Staff (Respond / Next)

5. **Agent Enable/Disable Toggle**
   - User can choose which agents are active for their check-ins
   - New agents can be introduced over time (e.g. Fundraising, Legal)

---

**Agent Examples:**
- **Wellness Agent:** Flags energy dips, recommends habits or accountability
- **Legal Agent:** Advises on doc workflows, contract reviews, risks
- **Capital Agent:** Flags runway issues, recommends funding plans
- **Growth Agent:** Surfaces growth ideas, warnings, user insights

---

**Interaction Flow:**
1. Submit Daily Pulse
2. Enter Agent One-on-Ones (can skip any)
3. After final agent, receive Chief of Staff recommendation
4. Respond or move forward

---

**Out of Scope for v0.2.5:**
- Agent memory beyond current session
- Voice input/output (text only for now)
- Multi-agent group synthesis (only Chief of Staff does this)

---

**Success Criteria:**
- 90% of users complete Pulse and at least one agent 1-on-1
- 80% of sessions end with a Chief of Staff recommendation
- High subjective feeling of "support," "clarity," and "team presence"

---

**Next Steps:**
- v0.3: Agent memory
- v0.4: Agent personas / voice tone
- v0.5: Workflow delegation to agents

