# DecodeUs 🔍💬

> **Understand what your relationship actually looks like through your conversations.**

DecodeUs is a privacy-first conversation intelligence tool that turns an exported WhatsApp chat into an objective, evidence-based relationship report. It combines the viral, shareable excitement of **Spotify Wrapped** with deep, non-judgmental behavioral analytics powered by **Gemini**.

Instead of declaring someone a "red flag" or offering armchair diagnoses, DecodeUs analyzes communication patterns, recurring conflict cycles, emotional reciprocity, and balance across *both* people.

---

## 🌟 Key Features

### 🎁 1. Relationship Wrapped
A visual, shareable, story-style breakdown of your relationship's communication rhythms:
- **Conversation Initiation:** Who actually starts conversations?
- **Response Dynamics:** Average & median reply speeds, longest talks, and longest silences.
- **Rhythm & Habits:** Most active hours, busiest days, double-text counts, and signature emojis/phrases.

### 🚦 2. Relationship Fingerprint & Signals
A multi-dimensional diagnostic matrix assessing health across critical communication pillars:
- **Dimensions Analyzed:** Communication, Emotional Reciprocity, Conflict Handling, Effort Balance, Affection, Consistency, and Boundaries.
- **Signal Badges:** Categorized into **Green Flags**, **Red Flags**, and nuanced **Mixed Signals** (e.g., *High Affection + Weak Conflict Resolution*).

### 🔄 3. Pattern Replay
Identifies and tracks recurring conversational sequences rather than isolated messages:
> *Concern Raised → Defensiveness → Blame Shift → Truce → Issue Returns (Detected 8 times)*
View exact dates, timelines, and instances for every repeated loop.

### ⚖️ 4. Reality Check
Tests personal anxieties and assumptions against actual empirical data:
> *User Concern:* "I feel like they're losing interest."  
> *Observed Data:* Initiation dropped 32%, but affectionate language and emotional validation remained steady over the past 3 months.  
> *Verdict:* Disentangles conversational shift from lack of interest.

### 🔎 5. Evidence Mode (Why do you think this?)
Every claim or pattern provides verifiable receipts:
- Number of occurrences and time periods.
- Confidence score (*High / Moderate / Low / Insufficient Evidence*).
- Interactive excerpts demonstrating the observed dynamic.

### 💬 6. Ask Your Chat
Natural-language Q&A grounded exclusively in your conversation data:
- *"Who tends to apologize first?"*
- *"When did our messaging patterns start shifting?"*
- *"What topics trigger our longest arguments?"*

---

## 🛡️ Privacy by Design

Communication data is deeply sensitive. DecodeUs is engineered around strict privacy principles:

```text
WhatsApp Export (.txt)
         ↓
  [In-Browser Parsing (Web Worker)]  ← Stays 100% on your device
         ↓
  [Deterministic Metrics Calculated] ← Message counts, timers, ratios, charts
         ↓
  [Sanitized Excerpt Windows]        ← Only necessary context segments
         ↓
  [Gemini Structured AI API]         ← Secure server proxy, no raw chat stored
         ↓
  [Intelligence Report Generated]
```

- **Local-First Processing:** 100% of basic parsing, regex matching, and statistical calculations happen client-side in the browser via Web Workers.
- **Zero Raw Chat Storage:** Raw WhatsApp logs are never saved to databases or persistent storage.
- **No Diagnostic Labeling:** Strictly analyzes observable behavior—no clinical psychological labeling (e.g., "narcissist", "toxic").

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router, TypeScript) | Full-stack architecture, SSR, and API route proxies |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Modern, responsive interface and accessible components |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) | Spotify-Wrapped story transitions and micro-interactions |
| **Visualizations** | [Recharts](https://recharts.org/) | Responsive charts for activity heatmaps, response speeds, and balance |
| **Local Processing**| Web Workers | High-throughput parsing of 50k+ chat lines directly on the client |
| **AI Engine** | [Gemini 2.5 Flash](https://ai.google.dev/) via `@google/genai` | Fast semantic pattern detection, structured JSON output, and chat Q&A |
| **Sharing** | `html-to-image` / `@vercel/og` | Generates privacy-safe, branded share cards for social media |
| **Auth & DB** *(Optional)* | [Supabase](https://supabase.com/) | User accounts and report metadata (excluding raw chats) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm, pnpm, or bun
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/DecodeUs.git
   cd DecodeUs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Exporting Your WhatsApp Chat

To analyze a conversation:
1. Open the conversation in **WhatsApp**.
2. Tap the contact name / menu options `⋮`.
3. Select **More** → **Export Chat**.
4. Choose **Without Media** (DecodeUs parses the resulting `.txt` export).
5. Drag and drop the `.txt` file into DecodeUs.

---

## 📚 Documentation Suite

DecodeUs is supported by an exhaustive, production-ready documentation foundation:

| Document | Purpose |
| :--- | :--- |
| 🏗️ [**System Architecture**](architecture.md) | Technical blueprint: Web Worker parsing, deterministic metrics engine, context windowing, and Gemini 2.5 Flash pipeline |
| 🔄 [**User & Developer Workflows**](workflow.md) | End-to-end user state machine, edge case recovery, Git branching, synthetic chat testing rules, and CI/CD |
| 🎯 [**MVP Specification & Roadmap**](mvp.md) | V1 vs V1.5 vs V2 scope matrix, Gherkin acceptance criteria, 4-week sprint plan, and Definition of Done |
| 🛡️ [**Privacy & Ethical AI Governance**](privacy-security.md) | Zero-Knowledge local-first architecture, client-side PII scrubbing, zero DB persistence, and anti-diagnostic guardrails |
| 🔌 [**API & Data Contracts**](api-spec.md) | Canonical TypeScript models, Gemini JSON `responseSchema`, REST route specs (`/api/analyze`, `/api/chat`), and fixtures |
| 🎨 [**Swiss Design System**](design.md) | Master UI/UX spec: Swiss International typographic style, 0px border radius, flat tactile depth, and `#FF3000` signal color |
| 💡 [**Product Vision & Philosophy**](Idea.md) | The original product manifesto: *"Analyze patterns, not people"*, relationship signals, and feature catalog |
| 🤝 [**Contributing Guidelines**](contributing.md) | Contributor onboarding, local setup, parser extension guide, and pull request checklist |

---

## 🗺️ Roadmap

- [x] Product Specification & Philosophy ([`Idea.md`](Idea.md))
- [x] Swiss International UI/UX Design System ([`design.md`](design.md))
- [x] Technical Architecture & System Design ([`architecture.md`](architecture.md))
- [x] Privacy, Security & Governance Blueprint ([`privacy-security.md`](privacy-security.md))
- [x] API Contracts & Data Specifications ([`api-spec.md`](api-spec.md))
- [x] MVP Milestone Definition & Sprint Plan ([`mvp.md`](mvp.md))
- [ ] **V1 (MVP Implementation):**
  - [ ] Client-side Web Worker WhatsApp `.txt` parsing engine
  - [ ] Deterministic statistics computation (Initiation, response speeds, emojis, active times)
  - [ ] Relationship Wrapped presentation flow (6-slide Framer Motion story)
  - [ ] Gemini-powered pattern & signal extraction (Structured JSON)
  - [ ] Reality Check & Evidence Drawer
  - [ ] Grounded "Ask Your Chat" Q&A
- [ ] **V1.5 (Fast Follow):**
  - [ ] Relationship Timeline & Temporal drift analysis
  - [ ] Pattern Replay visual flowchart
  - [ ] Privacy-safe shareable social image export (`.png`)
  - [ ] Self-reflection module ("You might be the problem too")
- [ ] **V2 (Expansion):**
  - [ ] Multi-platform chat ingestion (Telegram, Signal, iMessage where permitted)
  - [ ] Local model support (WebLLM / on-device LLM)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

