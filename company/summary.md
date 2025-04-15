# Company Summary – v0.1

## Name
**Blanks**

## Identity
Blanks is named for the idea of a blank canvas—an empty space ready to be filled with your imagination. In the app, each “blank” is a tab: a mini-world, a personalized app, a creative slot just for you. It’s about expression, possibility, and simplicity.

---

## What It Is (One Sentence)
Blanks is a magical mobile app that lets anyone create personalized mini-apps using just their voice—no code, no friction, just pure creativity and the power of AI.

---

## What the Product Does (Technically)
- Blanks is a native iOS app (built in SwiftUI)
- Users speak (or type) to describe what app they want
- That input is transcribed and routed to a backend orchestrator
- The backend uses multiple LLMs (GPT-4o, Claude, Gemini, etc.) to collaboratively generate React Native code
- The code is bundled using Metro and hosted remotely
- The frontend loads the bundle and renders the app into a tab
- Users can:
  - Instantly edit their app via suggested edits
  - Create follow-up variations with voice
  - Explore and remix other users' apps
- Each app can have “superpowers” like:
  - Web search
  - LLM-powered APIs
  - Future integrations with Gmail, calendar, and more

> Input = voice + intent  
> Output = a working React Native mini-app embedded in your phone

---

## Who It's For
- Initially: curious creatives and nerdy tinkerers who want to build but can’t code
- Future: mass market users who want personalized tools, games, or utilities on their phones
- People who want magic over mechanics

---

## Why It’s Different
- Built for mobile first
- Voice-first, not text-first
- Abstracts away **all** technical complexity
- Targets fun, emotion, beauty—not dashboards and SaaS
- Competes with Replit, V0, Bolt, etc.—but aims for **emotion + elegance**, not developer speed

---

## Current Focus (Week of April 15, 2025)
- Finalizing stable LLM orchestration pipeline (Claude, GPT-4o, Gemini)
- Fixing inconsistent code output and invalid bundles
- Optimizing Metro bundling performance on Render (currently fast locally, slow on Render)
- Getting to a state where:
  - Voice → App works 90% of the time
  - Apps load fast and feel right
- Preparing to ship TestFlight beta to first testers

---

## Key Challenges
- Metro bundler performance on server
- Bundle caching edge cases
- Code generation edge cases
- TypeScript false-positive errors
- App Store approval nuances (for dynamic code loading + future app marketplace)

---

## Current Team & Org Structure
- **Solo founder** (Ben)
- Strategic + design decisions supported by ChatGPT
- Engineering support provided by Gemini
- All decisions currently made by Ben
- Manual agent orchestration via CLI and web tools
- CompanyOS now being used to run and reflect on Blanks daily

---

## External Constraints
- App Store: initial build will likely be approved, but future app discovery features will require careful design to avoid rejection
- Investors: no pressure, but early cap table may trigger significant dilution if old deal is accepted (from Giftshop rollover at $5M valuation)
- No other major regulatory concerns at this time

---

## Emotional / Intuitive Goals
Blanks should feel:
- Lightweight, fun, and magical
- Stable, fast, and quietly powerful
- Emotionally affirming — like the system believes in you
- Beautiful, not just functional
- Guided — every interaction should feel like a human gently helping you build something meaningful

Blanks is not just a product. It’s an **emotionally intelligent co-creator**.

---

