# DecodeUs 🔍💬

> **Understand what your relationship actually looks like through your conversations.**

DecodeUs is a privacy-first conversation intelligence app that turns an exported WhatsApp chat into an objective, evidence-based relationship report. It pairs the viral, shareable excitement of a **Spotify Wrapped-style story** with deep, non-judgmental behavioral analytics powered by **Gemini 2.5 Flash**.

Instead of declaring someone a "red flag" or offering armchair diagnoses, DecodeUs analyzes communication *patterns* across *both* people — initiation balance, reply rhythms, recurring conflict loops, emotional reciprocity — and every claim ships with verifiable receipts. Its motto, enforced in code and prompts alike: **analyze patterns, not people.**

**Status:** V1 (MVP) implemented — parser, metrics engine, Wrapped story, diagnostic dashboard, Ask-Your-Chat Q&A, share cards, and safety off-ramp, covered by 112 automated tests.

---

## How it works

```text
WhatsApp Export (.txt)
        ↓
[In-browser parsing] ── Web Worker, inline fallback ── 100% on-device
        ↓
[Deterministic metrics] ── counts, timers, ratios, distributions
        ↓
[PII scrubbing + excerpt windowing] ── max 25 excerpts, ≤12k tokens
        ↓
[Gemini 2.5 Flash] ── structured JSON only, via /api/analyze ── no raw chat stored
        ↓
[Wrapped story → Deep diagnostic dashboard]
```

1. **Drop a `.txt` export.** Parsing runs in a Web Worker (with an identical inline fallback), so the UI never blocks — even on 50k-line chats.
2. **Instant local stats appear immediately** — message counts, date ranges, initiation splits, median reply times — with zero server round-trip.
3. **One click generates deep analysis.** Only small, redacted excerpt windows (trigger ±8 messages, deduplicated, byte-capped) are sent to Gemini, which returns a strictly-validated JSON report: fingerprint scores, signal badges, pattern loops, reality-check verdicts, and Wrapped highlights.
4. **Explore two views:** a 6-slide Relationship Wrapped story, then the full 5-tab diagnostic dashboard with evidence receipts, grounded Q&A, and PNG share cards.

---

## 🌟 Features

### 🎁 1. Relationship Wrapped (6 slides)
A Framer Motion story-mode breakdown of your communication rhythms:
- **Volume** — total messages, days covered, msgs/day
- **Initiative** — who actually starts conversations (with skew-aware copy)
- **Rhythm** — 24-hour activity map with peak-hour highlight
- **Lexicon** — signature emojis, catchphrases, double-text and question counts
- **Signals** — top Green Flag + top Mixed Signal poster card
- **Archetype** — relationship vibe title, 7-dimension preview, confetti reveal, and CTAs into the dashboard and share-card exporter

### 🧬 2. Relationship Fingerprint & Signals Matrix
A 7-dimension diagnostic assessment — Communication, Emotional Reciprocity, Conflict Handling, Effort Balance, Affection, Consistency, Boundaries — with signals categorized as **Green Flags**, **Red Flags**, and nuanced **Mixed Signals** (e.g. *High Affection + Weak Conflict Resolution*).

### 🔄 3. Pattern Replay
Tracks recurring conversational sequences rather than isolated messages:
> *Concern Raised → Defensiveness → Blame Shift → Truce → Issue Returns (Detected 8 times)*
with dates, timelines, and instances for every loop.

### ⚖️ 4. Reality Check
Tests anxieties against empirical data:
> *Concern:* "I feel like they're losing interest."
> *Observed:* Initiation dropped 32%, but affectionate language and validation stayed steady.
> *Verdict:* Disentangles conversational shift from lack of interest.

### 🔎 5. Evidence Drawer (receipts for everything)
Every claim links to monospaced dialogue receipts with timestamps, pseudonymized senders, and trigger-word highlights — plus confidence badges (*High / Moderate / Low / Insufficient Evidence*) and an explicit abstention path when evidence is thin.

### 💬 6. Ask Your Chat
Grounded natural-language Q&A (*"Who apologizes first?"*, *"What topics cause silence?"*) over vectorless keyword retrieval with synonym expansion. Retrieved windows are PII-scrubbed client-side before reaching `/api/chat`, and cited excerpts open directly in the Evidence Drawer.

### 🖼️ 7. Privacy-safe share cards
Branded 9:16 story + 16:9 post PNG exports via `html-to-image` — stats and archetype only, never names, numbers, or dialogue.

### 🛟 8. Safety by default
A crisis detector scans for self-harm/threat indicators and surfaces a support modal with helplines and one-tap local data wipe. Severely skewed uploads (>95% one-sided) get a non-blocking bilateral-evidence warning instead of a silent misread.

---

## 🛡️ Privacy architecture

- **Local-first:** parsing, metrics, and all PII scrubbing run in the browser. Raw chat lives in memory only — never persisted, never logged.
- **Aggressive redaction before any AI call:** phone numbers, international numbers, emails, URLs (reduced to hostname), 13–16 digit financial runs, street addresses, plus full- and first-name pseudonymization to Person A / Person B.
- **Minimal context:** at most 25 excerpt windows (~±8 messages around triggers, overlap-deduplicated, <250 KB / ~12k tokens). Ask-Your-Chat uses ±5-message windows, redacted the same way.
- **No clinical labeling:** guardrail filters block diagnostic terms ("narcissist", "toxic", …) from AI output.
- **Server hygiene:** API routes validate with Zod, rate-limit per IP, retry Gemini with exponential backoff, and run in mock mode when no key is set.

---

## 🛠️ Tech stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, TypeScript, React 19) | Full-stack app + API route proxies (`/api/analyze`, `/api/chat`) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) + bespoke Swiss component library | 0px-radius, flat, `#FF3000`-accented design system (no external UI kit) |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) | Wrapped story transitions, rigid mechanical displacement |
| **Visualizations** | [Recharts](https://recharts.org/) | Response-speed charts, circadian heatmaps, radar matrix |
| **Local processing** | Web Worker + identical inline fallback | 50k-line chats parsed off the main thread, on-device |
| **AI engine** | [Gemini 2.5 Flash](https://ai.google.dev/) via `@google/genai` | Structured-JSON pattern detection + grounded Q&A (mock mode included) |
| **Sharing & delight** | `html-to-image`, `canvas-confetti` | PNG share cards, archetype reveal burst |
| **Testing** | Vitest + Testing Library, Playwright | 112 unit/integration tests, e2e + privacy leak-check specs |

---

## 🚀 Getting started

### Prerequisites
- Node.js 20+
- npm (or pnpm/bun)
- A Google Gemini API key — **optional for local dev** (the app serves a mock report without one, consuming zero quota)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aritraio/DecodeUs.git
   cd DecodeUs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Required? | Purpose |
   | :--- | :--- | :--- |
   | `GEMINI_API_KEY` | Only for live AI | Server-side Gemini auth (never `NEXT_PUBLIC_`-prefixed) |
   | `MOCK_MODE=true` | No | Offline dev with the synthetic fixture report |
   | `NEXT_PUBLIC_APP_URL` | No | Canonical app URL (defaults to localhost) |

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000), export any WhatsApp chat **without media**, and drop in the `.txt`.

### Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` / `build` / `start` | Dev server / production build / serve |
| `npm test` | Full Vitest suite (unit + integration) |
| `npm run test:coverage` | Coverage report (80%+ lines/functions enforced) |
| `npm run test:e2e` | Playwright browser specs |
| `npm run test:leak-check` | Anonymizer + privacy leak-check specs |
| `npm run test:generate-fixture` | Regenerate synthetic chat fixtures |
| `npm run lint` / `type-check` | ESLint (Next.js flat config) / `tsc --noEmit` |

---

## 📱 Exporting your WhatsApp chat

1. Open the conversation in **WhatsApp**.
2. Tap the contact name (iOS) or `⋮` → **More** (Android).
3. Select **Export Chat** → **Without Media**.
4. Drag the `.txt` file into DecodeUs. Two-person chats only; group chats and single-participant exports are rejected with a clear message.

---

## 📚 Documentation suite

| Document | Purpose |
| :--- | :--- |
| 🏗️ [**System Architecture**](architecture.md) | Worker parsing, metrics engine, context windowing, Gemini pipeline |
| 🔄 [**User & Developer Workflows**](workflow.md) | User state machine, edge-case recovery, branching, synthetic testing rules, CI/CD |
| 🎯 [**MVP Specification & Roadmap**](mvp.md) | Scope matrix, Gherkin acceptance criteria, sprint plan, Definition of Done |
| ✅ [**Task Tracker**](task.md) | Phase-by-phase build checklist (all V1 tasks complete) |
| 🛡️ [**Privacy & Ethical AI Governance**](privacy-security.md) | Zero-knowledge architecture, PII scrubbing, anti-diagnostic guardrails |
| 🔌 [**API & Data Contracts**](api-spec.md) | Canonical models, Gemini `responseSchema`, `/api/analyze` + `/api/chat` specs |
| 🎨 [**Swiss Design System**](design.md) | Typographic spec, tokens, motion rules, anti-generic-UI policy |
| 💡 [**Product Vision & Philosophy**](Idea.md) | Original manifesto: *"Analyze patterns, not people"* |
| 🤝 [**Contributing Guidelines**](contributing.md) | Onboarding, parser extension guide, PR checklist |

---

## 🗺️ Roadmap

- [x] Product vision & philosophy ([`Idea.md`](Idea.md))
- [x] Swiss design system ([`design.md`](design.md))
- [x] Architecture, privacy, and API blueprints ([`architecture.md`](architecture.md), [`privacy-security.md`](privacy-security.md), [`api-spec.md`](api-spec.md))
- [x] **V1 (MVP) — shipped:**
  - [x] Web Worker WhatsApp `.txt` parsing engine (+ inline fallback)
  - [x] Deterministic stats (initiation, reply speeds, rhythm, lexicon)
  - [x] 6-slide Relationship Wrapped story
  - [x] Gemini pattern/signal extraction as strict JSON
  - [x] 5-tab diagnostic dashboard: fingerprint, signals, pattern replay, reality check, Ask-Your-Chat
  - [x] Evidence drawer, reality check, crisis off-ramp
  - [x] Grounded Q&A + privacy-safe PNG share cards
- [ ] **V1.5 (fast follows):**
  - [ ] Temporal drift analysis & relationship timeline
  - [ ] Self-reflection module ("you might be the problem too")
  - [ ] Cross-browser + accessibility audit sign-off, Vercel production deploy
- [ ] **V2 (expansion):**
  - [ ] Multi-platform ingestion (Telegram, Signal, iMessage where permitted)
  - [ ] On-device LLM support (WebLLM)

---

## 📄 License

No license file is present yet — add a `LICENSE` (e.g. MIT) before public release or distribution.
