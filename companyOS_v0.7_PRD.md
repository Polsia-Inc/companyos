# CompanyOS v0.7 – Agent Trust, Self-Reflection, and LLM Promotion

**Author:** Ben Broca (with ChatGPT)  
**Date:** 2025-04-17

---

## 🎯 Core Idea

v0.7 is about creating **a self-evolving agent ecosystem.**

You don’t just delegate. You **observe, reflect, score, and promote.** Agents begin to:
- Compete based on results
- Improve based on feedback
- Reflect on performance
- Evolve into high-trust teammates

And critically:
> Agents can be backed by **different LLMs**, creating diversity of thought and real competition inside the system.

---

## 🔁 Core Capabilities Introduced in v0.7

### 1. Agent Feedback Tracking
Every agent response can now be reviewed via a `start:review` CLI or UI:
- 1–5 rating (effectiveness, clarity, usefulness)
- Optional text feedback ("Missed context about Metro fix")

Stored in:
```json
agent-feedback/engineering.json
{
  "feedback_history": [...],
  "average_score": 4.6,
  "last_updated": "2025-04-17"
}
```

### 2. Self-Review Protocol
Once a week, each agent writes a `self_review.md`:
- What went well
- What was missed
- What should be improved

This becomes:
- A performance trail
- A memory feed for Chief of Staff and CEO

### 3. Agent Comparison & Promotion
CompanyOS supports multiple agents **per role**, powered by **different LLMs**.

For example:
| Role            | Agents                |
|-----------------|------------------------|
| Engineering     | `eng_gpt4.1`, `eng_gemini25` |
| Product         | `prod_chatgpt`, `prod_gemini` |

Each one:
- Writes proposals
- Gets rated
- Builds trust over time
- Can be promoted to default **or** assigned to scoped domains (e.g., "infra-only")

Agent metadata:
```json
{
  "agent": "eng_gemini25",
  "llm": "Gemini 2.5 Pro",
  "trust_score": 4.8,
  "role": "engineering",
  "scope": ["backend", "infra"],
  "status": "default"
}
```

### 4. Arena / Tournament Mode (Optional)
Inspired by LLM Arena:
- Run multiple agents side by side
- Collect feedback
- Visualize which LLM/agent consistently produces better recommendations
- Promote, demote, or reassign based on feedback, task success, or confidence

---

## 🛠️ File Structure Additions

```bash
companyos/
├── agent-feedback/
│   ├── strategy.json
│   ├── engineering_gpt4.json
│   ├── engineering_gemini.json
├── reviews/
│   ├── engineering_self_review.md
├── agents.json (agent metadata: LLM, trust score, status)
```

---

## 🧠 Why This Matters

- CompanyOS becomes **self-tuning** over time
- You start to **trust agents differently** based on history
- You unlock **LLM diversity** without chaos
- You pave the way for:
  - Specialization
  - Scoped delegation
  - Skill-based promotion

This makes CompanyOS more:
- Realistic
- Meritocratic
- Scalable

And more importantly:
> It gives you a *governable brain*, not just a reactive system.

---

## 🔮 Looking Ahead (v0.8+)

- Confidence-weighted agent voting
- Dynamic role reassignment (CoS recommends promotions)
- Runtime LLM switching based on task class ("use Gemini for code, GPT for strategy")
- Slack-based approval queue for feedback and promotions

---

## ✅ Summary

CompanyOS v0.7 creates:
- **Agent memory**
- **Self-review pipelines**
- **Trust scoring**
- **LLM-backed role diversity**
- **Governable agent evolution**

This is where agents become real teammates — not because you believe in them blindly, but because they’ve *earned it.*

Let’s ship it.

