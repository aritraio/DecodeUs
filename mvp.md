# DecodeUs — MVP Specification & Implementation Roadmap

> **Document Version**: 1.0.0  
> **Status**: Approved Master Specification  
> **Scope**: V1 (MVP) Release Definition, Scope Boundaries, and Sprint Plan  

---

## 1. Executive Summary & Value Proposition

### 1.1 The Core Problem
When romantic relationships encounter friction, partners frequently rely on subjective memory, emotional bias, or pop-psychology buzzwords ("gaslighting", "narcissist", "toxic"). There is no neutral, evidence-backed mirror that demonstrates how two people actually communicate.

### 1.2 The Solution
**DecodeUs** is a privacy-first conversation intelligence tool that parses exported WhatsApp chats into an objective, evidence-based relationship dossier. It combines the viral, shareable aesthetic of **Spotify Wrapped** with deep, non-judgmental behavioral analytics powered by **Gemini 2.5 Flash**.

### 1.3 Guiding Principle
> **"Analyze patterns, not people."**  
> We evaluate observable communication dynamics across both participants, separating empirical data from interpretation.

---

## 2. Scope Matrix: V1 (MVP) vs. V1.5 vs. V2

| Feature Area | V1 (MVP) — Immediate Build | V1.5 — Fast Follow (2-4 wks) | V2 — Future Roadmap |
| :--- | :--- | :--- | :--- |
| **Ingestion Engine** | • WhatsApp `.txt` (iOS & Android)<br>• Client-side Web Worker parse<br>• 2-person direct chats | • Multi-month file merging<br>• iMessage `.txt` import<br>• Error correction helper | • Telegram `.json` ingestion<br>• Signal export ingestion<br>• Instagram data download |
| **Deterministic Metrics** | • Initiation share (3h rule)<br>• Median & average reply latency<br>• 24h circadian heatmap<br>• Double texts & questions<br>• Top 10 emojis/phrases | • Temporal drift (month-by-month)<br>• Day-of-week trends<br>• Response speed percentiles | • Voice note length analysis<br>• Photo/sticker ratio tracking<br>• Read receipt lag analysis |
| **AI Diagnostics (Gemini)**| • Relationship Fingerprint (7 dims)<br>• Behavioral Signals (Green/Red/Amber)<br>• Reality Check (Insecurity testing)<br>• Confidence ratings on all claims | • Pattern Replay cyclical loops<br>• "You Might Be Missing"<br>• "You Might Be the Problem Too" | • Multi-relationship benchmark<br>• Couple synchronization mode<br>• Therapeutic discussion prompts |
| **Visual Presentation** | • Swiss International UI (design.md)<br>• 6-Slide Wrapped Story Mode<br>• Diagnostic Dashboard (tabs)<br>• Recharts activity visualizations | • Animated dynamic SVG charts<br>• Interactive Evidence Drawer<br>• High-res PNG card export | • Video Wrapped generator<br>• PDF Executive Dossier export<br>• Dark/Light theme toggle |
| **Chat Interaction** | • "Ask Your Chat" (vectorless RAG)<br>• 5 curated prompt buttons<br>• Direct excerpt citations | • Multi-turn conversational memory<br>• Jump-to-chat context drawer<br>• Filter by date range | • Full semantic search index<br>• Relationship timeline scrub<br>• Voice Q&A input |
| **Privacy & Security** | • 100% in-browser parsing<br>• Client-side PII scrubbing<br>• Ephemeral server proxy (zero DB)<br>• Non-diagnostic ethics filter | • Client-side local key option<br>• Cryptographic hash verification | • On-device LLM (WebLLM)<br>• Fully offline desktop app |

---

## 3. User Stories & Acceptance Criteria (Gherkin Format)

### US-01: Client-Side WhatsApp File Ingestion
**As a** privacy-conscious user,  
**I want to** drop my exported WhatsApp `.txt` file into DecodeUs,  
**So that** my sensitive personal chat is parsed safely on my device without being sent to an untrusted database.

```gherkin
Scenario: Successful parsing of standard iOS WhatsApp export
  Given I have a valid iOS WhatsApp chat export named "_chat.txt" with 2 participants
  When I drag and drop the file into the upload zone
  Then the Web Worker should complete parsing within 1.5 seconds for up to 50,000 lines
  And I should immediately see the total message count, date range, and participant names
  And no raw unmasked chat text should be transmitted over the network

Scenario: Error handling for single-participant (self-chat) file
  Given I upload an export containing messages from only one person
  When the parser detects sender_count < 2
  Then the upload should halt gracefully
  And an alert should read: "Only 1 participant detected. DecodeUs requires a two-person conversation."
```

---

### US-02: Instant Deterministic Metrics Preview
**As a** user awaiting deep analysis,  
**I want to** view immediate communication numbers and balance metrics,  
**So that** I receive instant value before the AI model finishes generating the full report.

```gherkin
Scenario: Viewing instant deterministic stats
  Given parsing has completed in the Web Worker
  When the worker emits the STATS_READY event
  Then I should immediately see:
    | Metric | Format |
    | Initiation Split | Percentage per participant (e.g. 54% / 46%) |
    | Median Reply Time | Human-readable duration (e.g. 4 mins / 12 mins) |
    | Circadian Peak | Top active texting hour (e.g. 10:00 PM) |
    | Double Texts | Total bursts per participant |
  And a progress indicator should show: "Generating deep behavioral intelligence with Gemini..."
```

---

### US-03: Relationship Wrapped (Story Mode)
**As a** user who loves visual storytelling,  
**I want to** experience my communication dynamics as a full-screen, 6-slide story,  
**So that** I can consume complex behavioral data in an engaging, shareable format.

```gherkin
Scenario: Navigating the Wrapped Story Flow
  Given the AI analysis payload has successfully returned
  When I click "Launch Relationship Wrapped"
  Then a full-screen 6-slide interface should open with a progress bar at the top
  And I should be able to advance slides using spacebar, right arrow, or tapping the right half
  And I should be able to step back using left arrow or tapping the left half
  And Slide 06 should provide a CTA button: "Explore Deep Diagnostic Dashboard"
```

---

### US-04: Structured Behavioral Signals & Fingerprint
**As a** user seeking objective relationship clarity,  
**I want to** see balanced Green Flags, Red Flags, and Mixed Signals with evidence,  
**So that** I understand recurring dynamics without receiving biased or diagnostic labels.

```gherkin
Scenario: Reviewing behavioral signals
  Given I am in the Diagnostic Dashboard
  When I view the Signals tab
  Then signals should be categorized as GREEN, RED, or AMBER
  And every signal must specify a confidence level (HIGH, MODERATE, LOW, or INSUFFICIENT_EVIDENCE)
  And every signal must cite at least one supporting excerpt ID
  And no diagnostic clinical terms ("narcissist", "toxic", "bipolar") should appear
```

---

### US-05: Reality Check (Assumption Testing)
**As an** anxious user worried about my partner's feelings,  
**I want to** test an assumption like "I feel like they're losing interest",  
**So that** empirical data either validates or debunks my personal anxiety.

```gherkin
Scenario: Testing a communication insecurity
  Given I select or type the question "Are they losing interest?"
  When the Reality Check module processes the request
  Then it must compare my assumption against actual temporal initiation and reply delay metrics
  And it must output an explicit Verdict ("Debunked", "Partially Supported", or "Supported by Data")
  And it must provide behavioral context explaining the empirical difference
```

---

### US-06: Ask Your Chat (Context-Grounded Q&A)
**As an** inquisitive user,  
**I want to** ask natural-language questions about our messaging history,  
**So that** I can get factual answers backed directly by conversation excerpts.

```gherkin
Scenario: Asking who tends to apologize first
  Given I type "Who apologizes first after an argument?" into the terminal
  When the server performs vectorless retrieval and queries Gemini 2.5 Flash
  Then the response must cite the percentage of apology initiations per participant
  And the response must display the exact dates or excerpt references supporting the answer
  And if insufficient conflict data exists, it must reply: "Insufficient evidence in the chat history to determine apology patterns."
```

---

## 4. Four-Week Sprint Implementation Plan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             DECODEUS MVP SPRINT TIMELINE                    │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│ SPRINT 1 (Week 1)   │ SPRINT 2 (Week 2)   │ SPRINT 3 (Week 3)               │
│ Parser & Metrics    │ Gemini & API Route  │ Swiss UI & Story Mode           │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│ SPRINT 4 (Week 4)   │ LAUNCH & AUDIT      │ POST-LAUNCH (Week 5+)           │
│ Ask Chat & Cards    │ Privacy Verification│ V1.5 Fast Follows               │
└─────────────────────┴─────────────────────┴─────────────────────────────────┘
```

### Sprint 1 (Days 1–7): Parsing Worker & Deterministic Engine
- [x] Initialize Next.js 15+ App Router project with TypeScript and Tailwind CSS.
- [x] Implement `src/workers/parse.worker.ts` with iOS and Android regex matchers.
- [x] Implement multiline message stitching and canonical schema normalization.
- [x] Implement deterministic metric algorithms:
  - Initiation counter (3h threshold).
  - Median and average response latency calculator.
  - Circadian 24-hour distribution and busiest day calculator.
  - Double-text burst and question counter.
  - Top emoji and catchphrase frequency analyzer.
- [x] Write comprehensive unit tests in Vitest using synthetic fixtures.

### Sprint 2 (Days 8–14): AI Pipeline & Gemini Integration
- [x] Set up server-side route handler `src/app/api/analyze/route.ts`.
- [x] Integrate `@google/genai` with Gemini 2.5 Flash.
- [x] Define and test strict JSON Schema (`responseSchema`) for structured output.
- [x] Build the Context Windowing & Excerpt Selection Sampler.
- [x] Build client-side PII scrubbing regex (phones, emails, addresses, credit cards).
- [x] Build mock response generator for local offline development without consuming API quota.

### Sprint 3 (Days 15–21): Swiss Design System & Wrapped Presentation
- [x] Implement Swiss International design system tokens in Tailwind config ([`design.md`](design.md)).
- [x] Build base layout components: `SwissHeader`, `GridBackground`, `NoiseOverlay`, `SwissButton`.
- [x] Build the 6-slide **Relationship Wrapped** story flow using Framer Motion.
- [x] Build the **Deep Diagnostic Dashboard** with tabs:
  - *Fingerprint*: 7-dimension diagnostic radar / matrix.
  - *Signals*: Green, Red, and Mixed signal badges.
  - *Reality Check*: Assumption vs. empirical reality cards.
  - *Evidence Drawer*: Slide-over receipts modal.
- [x] Implement Recharts visualizations for response speeds and circadian heatmaps.

### Sprint 4 (Days 22–28): "Ask Your Chat", Share Cards & Production Audit
- [x] Implement `src/app/api/chat/route.ts` with vectorless keyword-matched excerpt retrieval.
- [x] Build "Ask Your Chat" terminal component with 5 quick-prompt pills.
- [x] Build privacy-safe branded card generator using `html-to-image` for social sharing.
- [x] Execute comprehensive Privacy & Security audit (verify zero raw chat logging, verify zero PII leaks).
- [x] Perform cross-browser testing (Chrome, Safari, Firefox, iOS Safari, Android Chrome).
- [x] Conduct accessibility review (keyboard navigation, high-contrast ratios).
- [x] Deploy production build to Vercel.

---

## 5. Definition of Done (DoD) & Launch Checklist

A feature is considered **Done** and ready for production deployment only when:

1. **Test Coverage**: Unit tests pass with > 90% code coverage on parsers, anonymizers, and metric calculation algorithms.
2. **Zero PII Storage**: Confirmed through network interception tests that raw, un-redacted chat logs are never sent to third-party endpoints or stored in databases.
3. **Performance Benchmark**: Parsing 50,000 chat lines takes less than 1.5 seconds on modern desktop browsers and less than 3.0 seconds on mobile devices.
4. **Design Fidelity**: All UI components strictly adhere to [design.md](design.md) (0px border-radius, zero drop shadows, Swiss Red `#FF3000` accent).
5. **No Hallucinated Intent**: All generated AI signals cite evidence IDs and provide a confidence rating.
6. **Graceful Fallbacks**: Handlers are present for corrupted files, single-participant exports, and Gemini API rate limits.

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

| Metric | Target (30 Days Post-Launch) | Measurement Method |
| :--- | :--- | :--- |
| **Parsing Success Rate** | > 96% of uploaded exports | Telemetry counter for worker success vs parse exceptions |
| **Client Parse Duration** | < 1.5 seconds median | Client-side performance mark timing |
| **Time to Story Mode** | < 5.0 seconds total | Upload drop to Slide 01 render timestamp |
| **Wrapped Completion Rate** | > 75% of users finish slide 6 | Story slide progress funnel tracking |
| **Share Rate** | > 15% of users save/share card | Click tracking on "Save Share Card" button |
| **Privacy Compliance** | 0 reported leaks / 0 DB chats | Continuous automated log and storage audits |
