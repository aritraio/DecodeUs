# DecodeUs — Master Autonomous Agent Task Roadmap

> **Target Audience**: Autonomous AI Coding Agent  
> **Human Developer Role**: None (Agent will implement, test, and verify this entire repository autonomously from first to last)  
> **Document Version**: 1.0.0  
> **Governing Specifications**:
> - [`workflow.md`](workflow.md) — User journey state machine, edge cases, synthetic data rules, CI/CD, test pyramid
> - [`design.md`](design.md) — Swiss International Design System, 0px border radius, black/white/muted with Swiss Red (`#FF3000`), typography, CSS pattern engine
> - [`architecture.md`](architecture.md) — System architecture, Web Worker off-thread parsing, deterministic metrics algorithms, context windowing, Gemini 2.5 Flash pipeline
> - [`api-spec.md`](api-spec.md) — TypeScript domain interfaces, Gemini JSON `responseSchema`, `/api/analyze` and `/api/chat` contracts, test fixtures
> - [`privacy-security.md`](privacy-security.md) — Zero-knowledge local-first processing, client PII scrubbing, zero DB persistence, ethical AI non-diagnostic guardrails, crisis off-ramp
> - [`Idea.md`](Idea.md) — Core philosophy: *"Analyze patterns, not people"*, two-way accountability, uncertainty ratings
> - [`mvp.md`](mvp.md) — MVP scope boundaries, Gherkin acceptance criteria, 4-week sprint milestones, Definition of Done

---

## 🤖 Agent Execution Protocol & Ground Rules

Before beginning any task, the executing AI agent **MUST** review and enforce the following absolute rules:

1. **Self-Governing Progress Tracking**:
   - Update this file (`task.md`) after completing each subtask by changing `[ ]` to `[x]`.
   - Never skip phases or subtasks. Complete dependencies strictly in numerical order.
   - If an error or regression occurs, halt and resolve it before proceeding to the next task.

2. **Strict Adherence to the Swiss International Design System ([`design.md`](design.md))**:
   - **Zero Rounded Corners**: Every element in the DOM must have `rounded-none` or `border-radius: 0px !important`. Soft blobs, pills, and rounded cards are strictly prohibited.
   - **Zero Drop Shadows**: No `shadow-*` or blur effects. Depth must be achieved strictly through 4 CSS textures: `.swiss-grid-pattern` (24px grid), `.swiss-dots` (16px dot matrix), `.swiss-diagonal` (45° lines), and `.swiss-noise` (subtle SVG noise overlay).
   - **Palette Discipline**: 95% Pure Black (`#000000`), Pure White (`#FFFFFF`), and Muted Gray (`#F2F2F2`). **Swiss Red (`#FF3000`)** is reserved strictly for signal indicators, CTAs, alert borders, and numbered section prefixes (`01.`, `02.`). Botanical Green (`#008A39`) and Amber (`#E05300`) are used exclusively for Green Flag and Mixed Signal pills.
   - **Typography**: Scale contrast using `Inter` (`text-[10rem]`, `text-8xl`, `text-6xl` down to uppercase tracked-out micro-labels `text-[10px] tracking-widest`).

3. **Strict Privacy & Zero-Knowledge Enforcement ([`privacy-security.md`](privacy-security.md))**:
   - Raw WhatsApp `.txt` exports must **NEVER** leave the browser or be transmitted over the network.
   - 100% of raw chat parsing, multiline stitching, and deterministic statistics must occur inside a client-side **Web Worker** (`parse.worker.ts`).
   - All text sent to `/api/analyze` must pass through the client-side PII scrubbing engine (`anonymizer.ts`) to mask phone numbers, emails, URLs, physical addresses, and map personal names to "Person A" and "Person B".
   - **Zero Persistent Storage**: No persistent databases (SQL/NoSQL) and no saving raw chats to server disk or long-term storage.

4. **Ethical AI & Non-Diagnostic Guardrails ([`privacy-security.md`](privacy-security.md), [`Idea.md`](Idea.md))**:
   - The LLM and system prompts must **NEVER** output armchair psychiatric labels: *"narcissist"*, *"borderline"*, *"bipolar"*, *"sociopath"*, *"gaslighter"*, or *"toxic"* (as a clinical verdict).
   - System prompts must enforce observable, objective behavioral descriptions (e.g., *"Repeated pattern of redirecting conflict back toward the other person's shortcomings"*).
   - All claims must carry a confidence score (`HIGH`, `MODERATE`, `LOW`, `INSUFFICIENT_EVIDENCE`) and cite direct excerpt IDs.

5. **Mandatory Synthetic Data Policy ([`workflow.md`](workflow.md))**:
   - **NEVER** commit or use real personal chat files in source control or tests.
   - All tests must use synthetic fixtures generated in `tests/fixtures/synthetic/`.

---

## 🗺️ Master Phase Overview

```
Phase 00: Project Foundation & Tooling Setup
   ↓
Phase 01: Synthetic Test Data & Test Fixture Generation Engine
   ↓
Phase 02: Client-Side Web Worker Parsing & Normalization Engine
   ↓
Phase 03: Deterministic Mathematical Metrics Engine
   ↓
Phase 04: Client-Side PII Redaction & Context Windowing Sampler
   ↓
Phase 05: Server-Side API Proxies & Gemini 2.5 Flash Pipeline
   ↓
Phase 06: Swiss International UI Kit & Atomic Primitives
   ↓
Phase 07: Screen 01 — Landing Canvas, Ingestion Dropzone & Privacy Manifest
   ↓
Phase 08: Screen 02 — Relationship Wrapped (6-Slide Story Mode)
   ↓
Phase 09: Screen 03 — Deep Diagnostic Dashboard & Analytical Tabs
   ↓
Phase 10: Interactive Modules — "Ask Your Chat" & Social Share Card Export
   ↓
Phase 11: Edge Case Resilience, Error Recovery & Ethical Safety Nets
   ↓
Phase 12: End-to-End Verification, Performance Benchmarking & Launch Audit
```

---

## Phase 00: Project Foundation & Tooling Setup

> **Goal**: Scaffold a clean, production-ready Next.js 15+ App Router application with TypeScript, Tailwind CSS, Swiss International tokens, Vitest unit test runner, and strict code quality configurations.

- [x] **Task 00.1: Initialize Next.js 15+ App Router Project**
  - **Action**: Verify package structure or initialize Next.js 15 with TypeScript, Tailwind CSS, ESLint, App Router, and `src/` directory layout.
  - **Target Files**: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`
  - **Requirements**:
    - Enable strict mode in `tsconfig.json` (`strict: true`, `noImplicitAny: true`, `@/*` path alias mapped to `./src/*`).
    - Exclude `.env`, `.env.local`, and any chat exports from `.gitignore`.
  - **Verification**: Run `npm run build` or `npx tsc --noEmit` to verify type-checking configuration.

- [x] **Task 00.2: Install Core Application Dependencies**
  - **Action**: Install all required runtime and development packages.
  - **Commands**:
    ```bash
    npm install @google/genai clsx tailwind-merge lucide-react framer-motion recharts zod html-to-image canvas-confetti
    npm install -D @types/canvas-confetti vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom playwright
    ```
  - **Target Files**: `package.json`
  - **Verification**: `npm ls` runs without peer dependency conflicts.

- [x] **Task 00.3: Configure Swiss International Tailwind Tokens & Geometry**
  - **Action**: Implement exact tokens, color variables, borders, and animations as defined in [`design.md` §9.1](design.md#91-tailwind-configuration-tailwindconfigts).
  - **Target Files**: `tailwind.config.ts`
  - **Specifications**:
    - Colors: `swiss-bg` (`#FFFFFF`), `swiss-fg` (`#000000`), `swiss-muted` (`#F2F2F2`), `swiss-muted-border` (`#E5E5E5`), `swiss-accent` (`#FF3000`), `swiss-accent-hover` (`#D62700`), `swiss-green` (`#008A39`), `swiss-amber` (`#E05300`).
    - Border radius: Enforce `0px` across all sizes (`sm`, `md`, `lg`, `xl`, `full` all set to `"0px"`).
    - Transition timing: Add `mechanical: "cubic-bezier(0.2, 0.0, 0.0, 1.0)"`.
  - **Verification**: Inspect generated Tailwind theme to confirm zero radius values.

- [x] **Task 00.4: Implement Global CSS & Swiss Pattern Engine**
  - **Action**: Implement the 4 CSS pattern utilities (`.swiss-grid-pattern`, `.swiss-dots`, `.swiss-diagonal`, `.swiss-noise`) and global element overrides as defined in [`design.md` §3.4, §9.2](design.md#34-textures--pattern-library-css-engine).
  - **Target Files**: `src/app/globals.css`, `src/app/layout.tsx`
  - **Specifications**:
    - Set `:root` variables.
    - Enforce `* { border-radius: 0px !important; }`.
    - Set `::selection` background to `#FF3000` with white text.
    - Set up Inter font using `next/font/google`.
    - Add SVG noise overlay fixed pseudo-element on canvas.
  - **Verification**: Verify that `.swiss-grid-pattern` and `.swiss-dots` classes render valid background rules in `globals.css`.

- [x] **Task 00.5: Configure Vitest Test Environment**
  - **Action**: Configure Vitest with React plugin, jsdom environment, and path alias resolution.
  - **Target Files**: `vitest.config.ts`, `tests/setup.ts`
  - **Specifications**:
    - Support Web Worker imports or mock Web Workers for Node testing environment.
    - Add script `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"` to `package.json`.
  - **Verification**: Run `npm run test` on a sample test file and confirm it passes.

---

## Phase 01: Synthetic Test Data & Test Fixture Generation Engine

> **Goal**: Establish the mandatory synthetic chat fixtures required by the privacy policy ([`workflow.md` §4.2](workflow.md#42-synthetic-data-policy-mandatory-privacy-rule)), ensuring realistic test coverage across multiple WhatsApp formats without exposing real personal data.

- [x] **Task 01.1: Create Canonical TypeScript Types**
  - **Action**: Implement domain types and interfaces exactly matching [`api-spec.md` §1](api-spec.md#1-core-domain-models-typescript-interfaces).
  - **Target Files**: `src/types/chat.ts`, `src/types/metrics.ts`, `src/types/report.ts`
  - **Specifications**:
    - `CanonicalMessage` (`id`, `timestamp`, `senderId`, `originalSenderName`, `text`, `messageType`, `charCount`, `wordCount`, `hasQuestion`, `emojis`).
    - `ConversationMetadata` (`conversationId`, `senderA`, `senderB`, `totalMessages`, `startDate`, `endDate`, `totalDays`).
    - `DeterministicMetrics` (volume, initiation, responseSpeed, temporal, lexical).
    - `ContextExcerpt` and dialogue schemas.
  - **Verification**: Run `npx tsc --noEmit` to ensure zero type errors.

- [x] **Task 01.2: Construct Standard Synthetic WhatsApp Fixtures**
  - **Action**: Create deterministic, realistic synthetic chat files in `tests/fixtures/synthetic/` covering all key test scenarios.
  - **Target Files**:
    - `tests/fixtures/synthetic/synthetic-balanced-couple.txt` (iOS bracket format, balanced initiation ~50/50, healthy conflict repair).
    - `tests/fixtures/synthetic/synthetic-avoidant-pursuer.txt` (Android dash format, 1 double-texter, 1 long-delay replier).
    - `tests/fixtures/synthetic/synthetic-high-conflict.txt` (iOS 12-hour AM/PM format, repeated escalation cycles and apologies).
    - `tests/fixtures/synthetic/synthetic-multiline-ios.txt` (iOS bracket format containing multiline paragraphs, emojis, omitted media, and deleted messages).
    - `tests/fixtures/synthetic/synthetic-android-24h.txt` (Android 24-hour clock format `DD/MM/YYYY, HH:mm - Sender: Message`).
  - **Verification**: Validate each fixture file manually and verify line counts (>200 lines each).

- [x] **Task 01.3: Create Synthetic Mock Report Fixture**
  - **Action**: Save the approved canonical mock JSON report for offline development and integration testing matching [`api-spec.md` §4](api-spec.md#4-synthetic-mock-test-fixture).
  - **Target Files**: `tests/fixtures/mock-report.json`
  - **Specifications**: Contains complete `fingerprint`, `signals`, `patternLoops`, `realityChecks`, and `wrappedHighlights`.
  - **Verification**: Parse `tests/fixtures/mock-report.json` using a TypeScript test to verify schema conformity.

- [x] **Task 01.4: Implement Synthetic Chat Generator CLI Script**
  - **Action**: Build a Node script allowing developers to generate large synthetic chats (up to 50,000 lines) for performance benchmarking.
  - **Target Files**: `scripts/generate-fixture.ts`
  - **Specifications**: CLI flags `--type=(balanced|avoidant|conflict)`, `--messages=<count>`, `--format=(ios|android)`.
  - **Verification**: Run `npx tsx scripts/generate-fixture.ts --messages=1000 --format=ios` and verify output file syntax.

---

## Phase 02: Client-Side Web Worker Parsing & Normalization Engine

> **Goal**: Build an ultra-fast, non-blocking in-browser parsing engine in a dedicated Web Worker capable of processing 50,000+ lines in < 1.5 seconds across iOS and Android export variations ([`architecture.md` §2.1](architecture.md#21-client-side-parsing-pipeline-parseworkerts)).

- [x] **Task 02.1: Implement Multi-Locale Regex Matchers**
  - **Action**: Implement regex parsing patterns handling iOS and Android formats, 12h/24h timestamps, and international date delimiters (`/`, `.`, `-`).
  - **Target Files**: `src/lib/parser/regex-patterns.ts`
  - **Specifications**:
    - iOS pattern: `^\[(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]\s+([^:]+):\s+(.*)$`
    - Android pattern: `^(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s+-\s+([^:]+):\s+(.*)$`
    - International date format normalizer parsing `DD/MM/YYYY`, `MM/DD/YYYY`, and `YYYY-MM-DD` reliably into ISO 8601 UTC strings.
    - System message matchers: `<Media omitted>`, `image omitted`, `video omitted`, `sticker omitted`, `This message was deleted`, `Messages and calls are end-to-end encrypted`.
  - **Verification**: Write unit tests in `tests/unit/regex-patterns.test.ts` testing 20+ variation strings.

- [x] **Task 02.2: Implement Multiline Message Stitching & Unicode Emoji Extraction**
  - **Action**: Build the sequential line processor that stitches continuation lines into preceding message bodies and extracts emojis.
  - **Target Files**: `src/lib/parser/message-normalizer.ts`
  - **Specifications**:
    - Lines not starting with a timestamp header must append to the previous message's `text` field with `\n`.
    - Character and word count computation.
    - Question detection: Ends with `?` or contains interrogative markers.
    - Full Unicode emoji parser extracting all standard emoji characters into an array.
  - **Verification**: Unit test against `synthetic-multiline-ios.txt`.

- [x] **Task 02.3: Implement Participant Identification & Metadata Assembly**
  - **Action**: Identify the two conversation participants, assign consistent identifiers (`person_a` and `person_b`), and collect conversation metadata.
  - **Target Files**: `src/lib/parser/participant-detector.ts`
  - **Specifications**:
    - Tally sender display names across parsed messages (excluding system notifications).
    - If unique human senders count < 2: throw explicit error `SINGLE_PARTICIPANT_DETECTED` ([`workflow.md` §3](workflow.md#3-edge-cases--error-recovery-workflows)).
    - If unique human senders count > 2: group chat detected; throw `GROUP_CHAT_UNSUPPORTED`.
    - Assign `person_a` to the sender with the first message, `person_b` to the second.
    - Assemble `ConversationMetadata` (start date, end date, total days, message count).
  - **Verification**: Test with 1-person, 2-person, and 3-person synthetic test files.

- [x] **Task 02.4: Implement Dedicated Web Worker (`parse.worker.ts`)**
  - **Action**: Wrap the parser into a browser Web Worker with structured message passing.
  - **Target Files**: `src/workers/parse.worker.ts`, `src/lib/parser/worker-client.ts`
  - **Specifications**:
    - Worker accepts: `{ type: "PARSE_FILE", fileContent: string }`.
    - Worker emits progress updates: `{ type: "PARSE_PROGRESS", progress: number }` (every 5,000 lines).
    - Worker emits completion: `{ type: "PARSE_COMPLETE", messages: CanonicalMessage[], metadata: ConversationMetadata }`.
    - Error handling: emits `{ type: "PARSE_ERROR", error: string, code: string }`.
  - **Verification**: Unit test worker logic in Vitest using mock worker harness.

---

## Phase 03: Deterministic Mathematical Metrics Engine

> **Goal**: Implement the client-side mathematical analytics suite that computes initiation ratios, median response speeds, 24h circadian distributions, double-text bursts, and lexical stats in < 300ms without server involvement ([`architecture.md` §2.3](architecture.md#23-local-deterministic-metrics-engine)).

- [x] **Task 03.1: Implement Initiation & Session Dynamics Algorithm**
  - **Action**: Implement the 3-hour silence threshold algorithm for session segmentation and initiation counting.
  - **Target Files**: `src/lib/metrics/initiation.ts`
  - **Specifications**:
    - Threshold: `SESSION_GAP_THRESHOLD_MS = 3 * 60 * 60 * 1000` (180 minutes).
    - First message of a session counts as an initiation for that sender.
    - Return `personA` and `personB` counts and percentages.
    - Also calculate follow-up initiation after long silences (> 24 hours).
  - **Verification**: Unit tests in `tests/unit/initiation.test.ts` verifying exact counts against synthetic timestamps.

- [x] **Task 03.2: Implement Response Latency & Speed Distribution Calculator**
  - **Action**: Calculate response times for sender switches, deriving median and average latency.
  - **Target Files**: `src/lib/metrics/response-speed.ts`
  - **Specifications**:
    - Response latency is measured only when sender changes (`person_a` -> `person_b` or vice-versa).
    - Calculate **Median** response latency (robust against overnight sleep gaps).
    - Calculate **Average** response latency.
    - Track longest silence period in hours with start and end timestamps.
    - Categorize into speed distribution buckets: `<1m`, `1-5m`, `5-30m`, `30m-2h`, `2h+`.
  - **Verification**: Unit tests in `tests/unit/response-speed.test.ts` with known latency arrays.

- [x] **Task 03.3: Implement Circadian & Weekly Temporal Distribution**
  - **Action**: Compute 24-hour hourly activity distribution and 7-day weekly volume distribution.
  - **Target Files**: `src/lib/metrics/temporal.ts`
  - **Specifications**:
    - Hourly distribution: array of 24 numbers (0 to 23 hours in local time).
    - Peak messaging hour identification (`peakHour`).
    - Day of week distribution: array of 7 numbers (Sunday=0 to Saturday=6).
    - Busiest day identification (`busiestDay`).
  - **Verification**: Unit tests in `tests/unit/temporal.test.ts` verifying hour bucket assignments.

- [x] **Task 03.4: Implement Lexical Effort, Double-Texts & Emoji Frequency**
  - **Action**: Calculate message density, consecutive double-text bursts, question counts, and top emoji/word lists.
  - **Target Files**: `src/lib/metrics/lexical.ts`
  - **Specifications**:
    - Double-text burst: $\ge 2$ consecutive messages from the same sender without an intervening message from the other.
    - Average words per message.
    - Total questions asked per person.
    - Top 10 most frequent emojis per person with occurrence counts.
    - Top 5 recurring phrases / catchphrases (excluding common English stopwords).
  - **Verification**: Unit tests in `tests/unit/lexical.test.ts` on known synthetic dialogue.

- [x] **Task 03.5: Master Metrics Orchestrator & Worker Integration**
  - **Action**: Combine all metric modules into a single execution function and invoke it directly in `parse.worker.ts`.
  - **Target Files**: `src/lib/metrics/index.ts`, `src/workers/parse.worker.ts`
  - **Specifications**:
    - Worker emits `{ type: "STATS_READY", metrics: DeterministicMetrics, metadata: ConversationMetadata }` immediately upon computing stats.
  - **Verification**: Run comprehensive benchmark in `tests/unit/metrics-orchestrator.test.ts` ensuring < 300ms execution for 20,000 messages.

---

## Phase 04: Client-Side PII Redaction & Context Windowing Sampler

> **Goal**: Implement the client-side privacy firewall and intelligent context window sampler that extracts targeted excerpts while scrubbing all personally identifiable information before network transmission ([`privacy-security.md` §2](privacy-security.md#2-client-side-anonymization--pii-redaction-pipeline), [`architecture.md` §2.4](architecture.md#24-context-windowing--excerpt-extraction-engine)).

- [x] **Task 04.1: Implement Client-Side PII Redaction Engine**
  - **Action**: Build `anonymizer.ts` with aggressive regex masking for sensitive personal data.
  - **Target Files**: `src/lib/privacy/anonymizer.ts`
  - **Specifications**:
    - Telephone numbers: Replace with `[PHONE_REDACTED]`.
    - Email addresses: Replace with `[EMAIL_REDACTED]`.
    - URLs with query params/tokens: Replace with `[LINK: hostname]` or `[LINK_REDACTED]`.
    - Credit cards & 13-16 digit numbers: Replace with `[FINANCIAL_REDACTED]`.
    - Participant Name Pseudonymization: Case-insensitive replacement of original names with `"Person A"` and `"Person B"`.
    - Return `{ sanitizedText: string, redactedCount: number }`.
  - **Verification**: Write exhaustive unit tests in `tests/unit/anonymizer.test.ts` covering edge cases (names with punctuation, international phone formats, emails).

- [x] **Task 04.2: Implement Heuristic Trigger Scanner**
  - **Action**: Scan the canonical message stream for specific relational dynamic triggers.
  - **Target Files**: `src/lib/privacy/trigger-scanner.ts`
  - **Specifications**:
    - Trigger 1 (`conflict_lexicon`): Contains words like *"always", "never", "listen", "upset", "sorry", "apologize", "hurt", "fault", "tired of"*.
    - Trigger 2 (`long_delay`): Silence gap $> 12$ hours followed by short/terse reply ($< 5$ words).
    - Trigger 3 (`double_text`): Burst of $\ge 4$ consecutive messages from one participant.
    - Trigger 4 (`emotional_disclosure`): Message length $> 50$ words with question mark or vulnerability markers.
    - Trigger 5 (`sample`): Chronological anchor samples (1 representative segment per calendar month).
  - **Verification**: Unit tests in `tests/unit/trigger-scanner.test.ts`.

- [x] **Task 04.3: Implement Context Window Assembler & Token Budgeting**
  - **Action**: Extract balanced context windows around triggers, sanitize them with `anonymizer.ts`, and enforce a strict token/size budget.
  - **Target Files**: `src/lib/privacy/windowing.ts`
  - **Specifications**:
    - Window size: Trigger message $\pm 8$ surrounding messages for context.
    - Deduplicate overlapping message windows.
    - Cap total payload to a maximum of 25 excerpts ($\le 12,000$ estimated tokens / $< 250\text{KB}$ payload).
    - Format output into `ContextExcerpt[]` matching `api-spec.md`.
  - **Verification**: Verify that output from `windowing.ts` contains zero unredacted names or phone numbers and conforms to size limits.

- [x] **Task 04.4: Integrate Redaction Pipeline into Web Worker**
  - **Action**: Connect `windowing.ts` and `anonymizer.ts` to `parse.worker.ts`.
  - **Target Files**: `src/workers/parse.worker.ts`
  - **Specifications**:
    - Emits `{ type: "EXCERPTS_READY", payload: { excerpts: ContextExcerpt[], metrics: DeterministicMetrics } }`.
  - **Verification**: Test end-to-end worker execution and inspect exported payload.

---

## Phase 05: Server-Side API Proxies & Gemini 2.5 Flash Pipeline

> **Goal**: Build the secure Next.js API route handlers that authenticate with Google Gemini 2.5 Flash via `@google/genai`, enforce strict JSON schema output, rate-limit incoming requests, and guarantee zero persistent database storage ([`architecture.md` §2.5](architecture.md#25-gemini-25-flash-structured-analysis-pipeline), [`api-spec.md` §2, §3](api-spec.md#2-gemini-structured-output-schema-responseschema)).

- [x] **Task 05.1: Configure Gemini Client & Environment Validation**
  - **Action**: Initialize `@google/genai` with `process.env.GEMINI_API_KEY` and validate environment on boot.
  - **Target Files**: `src/lib/gemini/client.ts`, `.env.example`
  - **Specifications**:
    - Check for `GEMINI_API_KEY`. If missing in development, provide clear instructions and enable mock mode fallback.
    - Export configured `GoogleGenAI` instance.
  - **Verification**: Write connection sanity check test.

- [x] **Task 05.2: Implement Gemini Structured `responseSchema`**
  - **Action**: Translate the canonical report schema into `@google/genai` `Schema` using `Type.OBJECT`, `Type.ARRAY`, `Type.STRING`, `Type.INTEGER`.
  - **Target Files**: `src/lib/gemini/schemas.ts`
  - **Specifications**:
    - Schema must require: `fingerprint`, `signals`, `patternLoops`, `realityChecks`, `wrappedHighlights` exactly as defined in [`api-spec.md` §2](api-spec.md#2-gemini-structured-output-schema-responseschema).
    - Enforce field types and enum constraints (`type: ["GREEN", "RED", "AMBER"]`, `confidence: ["HIGH", "MODERATE", "LOW", "INSUFFICIENT_EVIDENCE"]`).
  - **Verification**: Unit test schema definition and validate mock payload against it with Zod.

- [x] **Task 05.3: Implement Ethical AI System Prompts & Anti-Diagnostic Guardrails**
  - **Action**: Author the master system prompt governing Gemini's behavioral analysis.
  - **Target Files**: `src/lib/gemini/prompts.ts`
  - **Specifications**:
    - Core Directive: *"Analyze patterns, not people. Evaluate observable communication dynamics across both participants."*
    - Strict prohibition on clinical psychiatric terms: *"narcissist", "sociopath", "psychopath", "borderline", "bipolar", "toxic", "gaslighter"*.
    - Mandate evidence citations: every signal must reference valid `evidenceExcerptIds` from the request.
    - Mandate two-way symmetry: analyze both Person A and Person B without one-sided bias.
    - Crisis detection instructions: flag any indicators of domestic violence or physical threat for safe off-ramp routing.
  - **Verification**: Prompt review against [`privacy-security.md` §6](privacy-security.md#6-ethical-ai--non-diagnostic-guardrails).

- [x] **Task 05.4: Implement `POST /api/analyze` Route Handler**
  - **Action**: Build the primary analysis endpoint with Zod input validation, rate limiting, and Gemini invocation.
  - **Target Files**: `src/app/api/analyze/route.ts`, `src/lib/server/rate-limiter.ts`
  - **Specifications**:
    - In-memory sliding window rate limiter: max 5 requests per IP per hour.
    - Validate request body using Zod (`relationshipType`, `optionalConcern`, `deterministicMetrics`, `contextExcerpts`). Reject payloads $> 4\text{MB}$ with HTTP 400.
    - Call `ai.models.generateContent` with `model: "gemini-2.5-flash"`, `systemInstruction`, and `config: { responseMimeType: "application/json", responseSchema }`.
    - Fallback: If `MOCK_MODE=true` or Gemini returns rate limit (HTTP 429), provide structured mock fixture with appropriate status code.
    - Zero persistence: do not write request body or response to any database or log stream.
  - **Verification**: Integration test with Vitest mocking Gemini API response in `tests/integration/api-analyze.test.ts`.

- [x] **Task 05.5: Implement `POST /api/chat` Route Handler ("Ask Your Chat")**
  - **Action**: Build the grounded natural language Q&A endpoint using vectorless excerpt filtering and Gemini.
  - **Target Files**: `src/app/api/chat/route.ts`
  - **Specifications**:
    - Accepts `{ query: string, relevantExcerpts: ContextExcerpt[], conversationMetadata: ConversationMetadata }`.
    - Prompts Gemini to answer strictly based on provided excerpts.
    - If evidence is missing, outputs: *"Insufficient evidence in the chat history to determine this pattern."*
    - Returns `{ answer: string, confidence: string, supportingExcerptIds: string[] }`.
  - **Verification**: Integration test in `tests/integration/api-chat.test.ts`.

---

## Phase 06: Swiss International UI Kit & Atomic Primitives

> **Goal**: Build the reusable Swiss International UI component library adhering strictly to [`design.md` §4, §9.3](design.md#4-component-architecture--ui-kit-specification) (0px border-radius, visible structural borders, instant mechanical color inversion, accessible typography).

- [x] **Task 06.1: Build `SwissCard` Primitive**
  - **Action**: Implement master container with 2px/4px black borders, optional header labels, and CSS pattern support.
  - **Target Files**: `src/components/ui/swiss-card.tsx`
  - **Specifications**:
    - Props: `indexLabel`, `variant` (`"white" | "muted" | "alert"`), `pattern` (`"none" | "grid" | "dots" | "diagonal"`).
    - Index label rendered in Swiss Red uppercase monospaced text.
    - Zero rounded corners (`rounded-none`).
  - **Verification**: Component render test in Vitest.

- [x] **Task 06.2: Build `SwissButton` Primitive**
  - **Action**: Implement mechanical color-inversion buttons with high-contrast accessibility.
  - **Target Files**: `src/components/ui/swiss-button.tsx`
  - **Specifications**:
    - Variants:
      - `primary`: Black background, white text. On hover: instant snap to Swiss Red (`#FF3000`).
      - `secondary`: White background, black text. On hover: instant snap to Black with white text.
      - `accent`: Swiss Red background, white text. On hover: instant snap to Black.
    - Sizes: `sm` (h-10), `default` (h-14), `lg` (h-16).
    - 0px border radius, 2px solid border, 150ms mechanical transition.
  - **Verification**: Verify visual hover states and keyboard focus rings.

- [x] **Task 06.3: Build `SignalBadge` Component**
  - **Action**: Build geometric status pills for Green Flags, Red Alert Patterns, and Mixed Signals.
  - **Target Files**: `src/components/ui/signal-badge.tsx`
  - **Specifications**:
    - Green: Dark botanical green square (`#008A39`), 2px black border.
    - Red: Swiss Red square (`#FF3000`), 8px Swiss Red left border stripe.
    - Mixed: Industrial amber square (`#E05300`), muted gray background.
    - Optional occurrence count tag `[{count}× OBSERVED]`.
  - **Verification**: Snapshot test in Vitest for each badge variant.

- [x] **Task 06.4: Build `SectionHeader` & Typography Elements**
  - **Action**: Implement standard architectural section headings with red numerals and large grotesk typography.
  - **Target Files**: `src/components/ui/section-header.tsx`
  - **Specifications**:
    - Numbered prefix (e.g. `01.`, `02.`) in Swiss Red (`text-swiss-accent font-black`).
    - Title in bold uppercase Inter with tight tracking.
    - Optional subtitle or metadata pill.
  - **Verification**: Render component test.

- [x] **Task 06.5: Build `NoiseOverlay` & Global Frame Components**
  - **Action**: Implement the SVG paper noise overlay and master responsive Swiss layout frame.
  - **Target Files**: `src/components/ui/noise-overlay.tsx`, `src/components/layout/swiss-layout.tsx`, `src/components/layout/swiss-header.tsx`
  - **Specifications**:
    - Persistent top navigation bar with monospace logo: `DECODEUS // CONVERSATION INTELLIGENCE`.
    - Privacy status pill: `ZERO_KNOWLEDGE: ACTIVE`.
  - **Verification**: Inspect DOM structure to verify 0px radius and z-index ordering.

---

## Phase 07: Screen 01 — Landing Canvas, Ingestion Dropzone & Privacy Manifest

> **Goal**: Build the public landing page with an asymmetric 8:4 Swiss grid, drag-and-drop file ingestion, interactive export instructions, privacy manifest table, and instant stats preview ([`design.md` §5.1](design.md#51-screen-01-landing--local-first-ingestion), [`workflow.md` §2 Phase 1-2](workflow.md#phase-1-discovery--education)).

- [x] **Task 07.1: Build Asymmetric Hero Section**
  - **Action**: Implement desktop 8:4 asymmetric hero layout with high-impact typography.
  - **Target Files**: `src/components/landing/hero-section.tsx`
  - **Specifications**:
    - Left column (8 cols): Numbered tag `01. INGESTION ENGINE`, massive headline: `UNDERSTAND WHAT YOUR RELATIONSHIP ACTUALLY LOOKS LIKE.`, subtitle: *"Analyze patterns, not people. Zero raw chat storage."*
    - Right column (4 cols): Privacy manifest table.
  - **Verification**: Verify responsive behavior from 320px mobile to 1920px desktop.

- [x] **Task 07.2: Build WhatsApp Drag-and-Drop Dropzone**
  - **Action**: Build the interactive file upload zone with format validation and Web Worker dispatch.
  - **Target Files**: `src/components/landing/dropzone.tsx`
  - **Specifications**:
    - Container: 4px dashed black border, dot-matrix pattern background, turns solid black on drag-over.
    - Accepts `.txt` files only. File size validation (up to 50MB).
    - Rejects invalid files with clear error banner: *"Unsupported file format. Please upload a WhatsApp .txt chat export."*
    - Dispatches file content to `parse.worker.ts` via `worker-client.ts`.
    - Displays real-time progress bar (0% to 100%) during worker regex parsing.
  - **Verification**: Unit test dropzone events (valid `.txt`, invalid `.pdf`, oversized file).

- [x] **Task 07.3: Build Interactive Export Guide Modal**
  - **Action**: Build tabbed modal displaying step-by-step export instructions for iOS and Android.
  - **Target Files**: `src/components/landing/export-guide-modal.tsx`
  - **Specifications**:
    - Tab toggle: `[iOS INSTRUCTIONS]` and `[ANDROID INSTRUCTIONS]`.
    - Clear visual steps emphasizing: *"Choose 'Without Media' when exporting"*.
    - Accessible modal with keyboard navigation (Esc to close) and 0px corners.
  - **Verification**: Test modal open/close interactions.

- [x] **Task 07.4: Build "Privacy by Design" Manifest Table**
  - **Action**: Implement the 4-cell technical privacy manifest table.
  - **Target Files**: `src/components/landing/privacy-manifest-table.tsx`
  - **Specifications**:
    - Display key parameters: `PARSING: 100% IN-BROWSER`, `STORAGE: ZERO PERSISTENCE`, `DIAGNOSTIC POLICY: NO CLINICAL LABELS`, `AI SCOPE: REDACTED EXCERPTS ONLY`.
    - High-contrast 2px black grid borders with muted background.
  - **Verification**: Render test.

- [x] **Task 07.5: Build Instant Deterministic Stats Preview Banner**
  - **Action**: When `parse.worker.ts` emits `STATS_READY`, immediately reveal initial empirical metrics while Gemini runs in the background.
  - **Target Files**: `src/components/landing/instant-stats-preview.tsx`
  - **Specifications**:
    - Displays: Total messages, date range, initiation split percentages, median response speeds.
    - Animated Swiss Red status bar: *"Generating deep behavioral intelligence with Gemini 2.5 Flash..."*
    - "Launch Wrapped" CTA button enabled when full analysis completes.
  - **Verification**: Test transition from file drop to instant stats display in < 1.5s.

---

## Phase 08: Screen 02 — Relationship Wrapped (6-Slide Story Mode)

> **Goal**: Build the full-screen, 6-slide typographic exhibition story experience using Framer Motion step transitions, keyboard/tap navigation, and high-impact visual statistics ([`design.md` §5.2](design.md#52-feature-02-relationship-wrapped-the-swiss-story-flow), [`mvp.md` §3 US-03](mvp.md#us-03-relationship-wrapped-story-mode)).

- [x] **Task 08.1: Build Story Mode Container & Navigation Controller**
  - **Action**: Implement the full-screen story viewer with top segmented progress bar and multi-input navigation.
  - **Target Files**: `src/components/wrapped/wrapped-container.tsx`, `src/components/wrapped/progress-bar.tsx`
  - **Specifications**:
    - 6-segment top progress bar indicating current slide (active segment fills; previous filled; next empty).
    - Navigation:
      - Spacebar or Right Arrow / Tap right 50% of screen $\rightarrow$ Next slide.
      - Left Arrow / Tap left 50% of screen $\rightarrow$ Previous slide.
      - Escape key $\rightarrow$ Exit to Dashboard.
    - Rigid horizontal step displacement using Framer Motion (`x: 100% -> 0%`, 250ms mechanical snap, zero rounded corners).
  - **Verification**: Test navigation keys and tap zones with synthetic state.

- [x] **Task 08.2: Build Slide 01 — The Volume & Endurance**
  - **Action**: Implement Slide 01 showcasing total volume, days active, and longest conversation marathon.
  - **Target Files**: `src/components/wrapped/slides/slide-01-volume.tsx`
  - **Specifications**:
    - Massive display metric: `text-[10rem]` message count.
    - Daily average messages and longest continuous texting exchange duration.
    - Monospaced timestamp range.
  - **Verification**: Component visual test.

- [x] **Task 08.3: Build Slide 02 — The Initiation Split**
  - **Action**: Implement Slide 02 with monolithic vertical comparison bars.
  - **Target Files**: `src/components/wrapped/slides/slide-02-initiative.tsx`
  - **Specifications**:
    - Two high-contrast vertical bars representing Person A vs. Person B initiation percentage.
    - Numbers: `text-8xl` bold percentages.
    - Contextual explanation: *"Out of X conversation starts over Y months, Person A initiated Z%."*
  - **Verification**: Test with balanced (50/50) and heavily skewed (80/20) data.

- [x] **Task 08.4: Build Slide 03 — The Rhythm & 24-Hour Circadian Clock**
  - **Action**: Implement Slide 03 displaying the 24-hour activity distribution.
  - **Target Files**: `src/components/wrapped/slides/slide-03-rhythm.tsx`
  - **Specifications**:
    - 24-column bar graph (00:00 to 23:00).
    - Solid black bars for standard volume, Swiss Red bars highlighting the peak communication window.
    - Busiest day of the week callout.
  - **Verification**: Visual verification of bar heights mapping to hourly values.

- [x] **Task 08.5: Build Slide 04 — The Lexicon & Emoji Signatures**
  - **Action**: Implement Slide 04 displaying top emojis and idiosyncratic phrases.
  - **Target Files**: `src/components/wrapped/slides/slide-04-lexicon.tsx`
  - **Specifications**:
    - Strict rectangular grid of top emojis per participant with occurrence counts.
    - Double-text count and question counts compared side-by-side.
  - **Verification**: Component render test.

- [x] **Task 08.6: Build Slide 05 — The Behavioral Signals**
  - **Action**: Implement Slide 05 highlighting the primary Green Flag and primary Mixed Signal.
  - **Target Files**: `src/components/wrapped/slides/slide-05-signals.tsx`
  - **Specifications**:
    - Poster card featuring Top Green Flag (`SignalBadge` green) and Top Mixed Signal (`SignalBadge` amber).
    - Brief empirical justification from Gemini payload.
  - **Verification**: Render test.

- [x] **Task 08.7: Build Slide 06 — The Relationship Archetype Dossier**
  - **Action**: Implement the final Wrapped summary slide with archetype title and CTA to full diagnostic dashboard.
  - **Target Files**: `src/components/wrapped/slides/slide-06-archetype.tsx`
  - **Specifications**:
    - Relationship Vibe Title (e.g. *"The Thoughtful Sprints"*).
    - Compact 7-dimension score preview.
    - Primary CTA button: `[EXPLORE DEEP DIAGNOSTIC DASHBOARD →]` triggering transition to dashboard.
    - Secondary CTA: `[SAVE SHARE CARD]`.
  - **Verification**: Test CTA click opens diagnostic dashboard.

---

## Phase 09: Screen 03 — Deep Diagnostic Dashboard & Analytical Tabs

> **Goal**: Build the multi-tab analytical workstation featuring the 7-pillar Relationship Fingerprint, categorized Signals & Flags, step-by-step Pattern Replay loops, the Reality Check lab, and the mechanical Evidence Receipts Drawer ([`design.md` §5.3-§5.6](design.md#53-feature-03-relationship-fingerprint--signals-matrix), [`architecture.md` §2.5](architecture.md#25-gemini-25-flash-structured-analysis-pipeline)).

- [x] **Task 09.1: Build Dashboard Layout & Architectural Tab Navigation**
  - **Action**: Implement the master diagnostic layout with sticky tab bar and section index counters.
  - **Target Files**: `src/components/dashboard/dashboard-layout.tsx`, `src/components/dashboard/dashboard-nav.tsx`
  - **Specifications**:
    - Tabs:
      - `[01. FINGERPRINT]`
      - `[02. SIGNALS & FLAGS]`
      - `[03. PATTERN REPLAY]`
      - `[04. REALITY CHECK]`
      - `[05. ASK CHAT]`
    - Monospaced active tab indicator with Swiss Red highlight.
    - Full keyboard navigation between tabs (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
  - **Verification**: Test tab switching maintains active state and updates URL hash or state.

- [x] **Task 09.2: Build Tab 01 — Relationship Fingerprint Matrix**
  - **Action**: Implement the 7-pillar communication assessment matrix (Communication, Emotional Reciprocity, Conflict Handling, Effort Balance, Affection, Consistency, Boundaries).
  - **Target Files**: `src/components/dashboard/tabs/fingerprint-tab.tsx`, `src/components/dashboard/charts/radar-chart.tsx`
  - **Specifications**:
    - Recharts radar or bar chart styled in monochrome + Swiss Red.
    - 7 individual dimension cards displaying 0-100 score, horizontal progress meter, and objective behavioral commentary.
    - Overall balance score badge.
  - **Verification**: Test rendering with mock report scores.

- [x] **Task 09.3: Build Tab 02 — Behavioral Signals & Flags Matrix**
  - **Action**: Implement the filtered signal list organized into Green Flags, Red Alert Patterns, and Mixed Signals.
  - **Target Files**: `src/components/dashboard/tabs/signals-tab.tsx`, `src/components/dashboard/signal-card.tsx`
  - **Specifications**:
    - Filter pills: `[ALL]`, `[GREEN SIGNALS]`, `[CRITICAL PATTERNS]`, `[MIXED SIGNALS]`.
    - Each card displays: Category pill, confidence rating (`HIGH`, `MODERATE`, `LOW`), occurrence count, description, and recommendation.
    - Clicking `[EXAMINE RECEIPTS (N) →]` opens the Evidence Drawer populated with cited excerpt IDs.
  - **Verification**: Unit test filter toggles and receipt click handler.

- [x] **Task 09.4: Build Tab 03 — Pattern Replay Flow Engine**
  - **Action**: Visualize recurring behavioral feedback loops with orthogonal step-by-step flowchart nodes.
  - **Target Files**: `src/components/dashboard/tabs/pattern-replay-tab.tsx`, `src/components/dashboard/pattern-node.tsx`
  - **Specifications**:
    - Rectangular step nodes (`[STEP 01] Concern Raised`, `[STEP 02] Deflection`, `[STEP 03] Truce`).
    - Orthogonal 2px black connecting lines with sharp 90-degree elbows.
    - Loop metrics: Occurrences count and typical resolution summary.
  - **Verification**: Component visual test.

- [x] **Task 09.5: Build Tab 04 — Reality Check Lab**
  - **Action**: Implement the assumption testing comparison matrix comparing user insecurity against observed chat metrics.
  - **Target Files**: `src/components/dashboard/tabs/reality-check-tab.tsx`
  - **Specifications**:
    - 2-column table: Left cell = *Your Assumption*; Right cell = *Observed Chat Data*.
    - Bottom verdict banner: Black background, white bold text, explicit verdict pill (`SUPPORTED_BY_DATA`, `PARTIALLY_SUPPORTED`, `DEBUNKED_BY_DATA`).
    - Pre-populated common queries + custom input field allowing users to test a specific worry.
  - **Verification**: Test with mock reality checks.

- [x] **Task 09.6: Build Evidence Receipts Slide-Over Drawer**
  - **Action**: Implement the mechanical slide-over drawer displaying exact raw timestamps and dialogue receipts.
  - **Target Files**: `src/components/dashboard/drawers/evidence-drawer.tsx`
  - **Specifications**:
    - Opens from bottom boundary or side panel with 200ms mechanical slide (`ease-out`).
    - Formats dialogue lines in monospaced font with timestamps and sender labels.
    - Highlights trigger keywords in Swiss Red (`bg-swiss-accent text-white`).
    - Close button: `[ESC / CLOSE RECEIPT DOSSIER]`.
  - **Verification**: Test opening drawer with excerpt IDs passes correct dialogue items.

---

## Phase 10: Interactive Modules — "Ask Your Chat" & Social Share Card Export

> **Goal**: Build the context-grounded Q&A terminal and privacy-safe branded social image exporter ([`design.md` §5.7](design.md#57-feature-07-ask-your-chat-interactive-query-terminal), [`architecture.md` §2.6](architecture.md#26-vectorless-context-retrieval-for-ask-your-chat), [`workflow.md` §2 Phase 5](workflow.md#phase-5-ask-your-chat--export)).

- [x] **Task 10.1: Build Vectorless Chat Search & Excerpt Matcher**
  - **Action**: Implement client-side keyword and dialogue segment retrieval for user questions.
  - **Target Files**: `src/lib/chat/retrieval.ts`
  - **Specifications**:
    - Tokenizes user question into keywords (e.g. *"apologize"*, *"sorry"*, *"talk less"*).
    - Scans canonical messages for matching dialogue clusters.
    - Packages top 5 matching dialogue segments into `ContextExcerpt[]` to send to `/api/chat`.
  - **Verification**: Unit test keyword matcher in `tests/unit/retrieval.test.ts`.

- [x] **Task 10.2: Build "Ask Your Chat" Terminal Component**
  - **Action**: Build terminal UI with monospaced command input, quick-prompt pills, and grounded response viewer.
  - **Target Files**: `src/components/chat/ask-your-chat-terminal.tsx`
  - **Specifications**:
    - Prompt input prefix: `> QUERY:`.
    - 5 preset prompt pills:
      - `[WHO APOLOGIZES FIRST?]`
      - `[WHEN DID WE TALK THE MOST?]`
      - `[WHAT TOPICS CAUSE SILENCE?]`
      - `[ARE OUR REPLY TIMES BALANCED?]`
      - `[HOW HAS TEXTING CHANGED OVER TIME?]`
    - Response card displays answer, confidence badge (`HIGH`, `MODERATE`, etc.), and clickable excerpt citation buttons.
    - If evidence is weak, displays explicit Swiss Amber alert: `INSUFFICIENT EVIDENCE: CHAT HISTORY DOES NOT CONTAIN ENOUGH CONFLICT EXCERPTS.`
  - **Verification**: Test query submission with mocked `/api/chat` route.

- [x] **Task 10.3: Build Privacy-Safe Social Share Card Generator**
  - **Action**: Implement social media image generation using `html-to-image` for Instagram Stories (9:16) and Twitter/X (16:9).
  - **Target Files**: `src/components/sharing/share-card-generator.tsx`, `src/components/sharing/share-card-template.tsx`
  - **Specifications**:
    - Generates high-resolution `.png` card matching Swiss exhibition poster aesthetics.
    - Zero PII guarantee: Card includes only statistical fingerprints, initiation percentages, and archetype title. **Strictly excludes personal names, phone numbers, and raw dialogue.**
    - Download button: `[DOWNLOAD PNG EXPORT]`.
  - **Verification**: Verify exported `.png` dimensions, DPI, and absence of private text.

- [x] **Task 10.4: Build Crisis & Domestic Safety Support Off-Ramp**
  - **Action**: Implement the non-judgmental crisis support modal triggered if self-harm or domestic violence indicators are flagged ([`privacy-security.md` §6.4](privacy-security.md#64-crisis-detection--safe-off-ramp)).
  - **Target Files**: `src/components/safety/crisis-support-modal.tsx`
  - **Specifications**:
    - Automatically displays solemn, high-contrast support notice with national helplines:
      - *National Domestic Violence Hotline: 1-800-799-SAFE (7233)*
      - *Crisis Text Line: Text HOME to 741741*
      - *International Helplines: findahelpline.com*
    - Actions: `[Download Local Safe Copy]` and `[Clear All Chat Data Now]`.
  - **Verification**: Unit test modal triggers on crisis keyword flag.

---

## Phase 11: Edge Case Resilience, Error Recovery & Ethical Safety Nets

> **Goal**: Implement bulletproof error handling for corrupted files, single-participant exports, extreme skew, network failures, and Gemini rate limits ([`workflow.md` §3](workflow.md#3-edge-cases--error-recovery-workflows)).

- [x] **Task 11.1: Implement Edge Case Handlers in Ingestion Pipeline**
  - **Action**: Handle corrupt, non-WhatsApp, or single-participant files gracefully.
  - **Target Files**: `src/lib/parser/error-handler.ts`, `src/components/landing/error-banner.tsx`
  - **Specifications**:
    - Non-WhatsApp/Binary file: Display: *"Unsupported file format. Please upload an exported WhatsApp .txt file."*
    - Single-participant export (notes to self): Display: *"Only 1 participant detected. DecodeUs requires a two-person conversation."*
    - Extreme skew (> 95% 1 user): Banner notice: *"Highly unbalanced conversation sample. Certain reciprocity metrics will indicate insufficient bilateral evidence."*
    - Non-standard date format: Cycle through 6 known international heuristics before throwing friendly error with format helper.
  - **Verification**: Test with edge-case synthetic files in Vitest.

- [x] **Task 11.2: Implement Server Proxy Resilience & Exponential Backoff**
  - **Action**: Add retry logic with exponential backoff for Gemini API calls.
  - **Target Files**: `src/lib/gemini/retry.ts`, `src/app/api/analyze/route.ts`
  - **Specifications**:
    - Exponential backoff: 1s, 2s, 4s retries on HTTP 429 or 503.
    - If retries exhausted: return deterministic metrics report with advisory note: *"AI semantic reasoning temporarily busy; showing empirical statistics only."*
  - **Verification**: Test retry handler with mocked failing responses.

- [x] **Task 11.3: Implement Automated Ethical AI Output Guardrail Filter**
  - **Action**: Implement post-processing sanity check verifying zero prohibited psychiatric terms in Gemini outputs.
  - **Target Files**: `src/lib/gemini/guardrail-filter.ts`
  - **Specifications**:
    - Reject or replace any prohibited words: *"narcissist", "sociopath", "psychopath", "borderline", "bipolar", "gaslighter", "toxic"*.
    - Rephrase into objective behavioral language.
  - **Verification**: Unit test guardrail filter in `tests/unit/guardrail-filter.test.ts`.

---

## Phase 12: End-to-End Verification, Performance Benchmarking & Launch Audit

> **Goal**: Perform comprehensive end-to-end integration testing, accessibility audit, performance benchmarking against KPIs, and verify production build readiness ([`mvp.md` §5, §6](mvp.md#5-definition-of-done-dod--launch-checklist), [`workflow.md` §4.3](workflow.md#43-testing-strategy--quality-gates)).

- [x] **Task 12.1: Implement End-to-End User Flow Tests (Playwright)**
  - **Action**: Write complete browser automation tests from file drop to Wrapped story and dashboard navigation.
  - **Target Files**: `tests/e2e/upload-and-wrapped.spec.ts`
  - **Specifications**:
    - Test upload of `synthetic-balanced-couple.txt`.
    - Assert instant stats preview renders within 1.5 seconds.
    - Assert Wrapped story opens, advances 6 slides via keyboard, and transitions to Dashboard.
    - Assert all 5 dashboard tabs render without JavaScript errors.
  - **Verification**: Run `npx playwright test`.

- [x] **Task 12.2: Automated Privacy & Data Leak Verification Test**
  - **Action**: Verify that network requests never transmit unmasked names or raw chat text.
  - **Target Files**: `tests/e2e/privacy-leak-check.spec.ts`
  - **Specifications**:
    - Intercept all outgoing HTTP requests during upload and analysis.
    - Assert payload to `/api/analyze` contains zero original names, phone numbers, or emails.
    - Assert no request is sent to third-party endpoints other than our local API route.
  - **Verification**: Test passes with 0 leaks reported.

- [x] **Task 12.3: Accessibility & Design Fidelity Audit**
  - **Action**: Run automated WCAG 2.1 AA audits and verify Swiss design geometric constraints.
  - **Target Files**: `tests/e2e/accessibility.spec.ts`
  - **Specifications**:
    - Assert `border-radius` of all buttons, cards, inputs, and modals is exactly `0px`.
    - Assert color contrast ratios meet WCAG AA standards.
    - Verify keyboard focusability on all interactive elements.
  - **Verification**: Axe accessibility audit passes with 0 critical violations.

- [x] **Task 12.4: Performance Benchmarking Audit**
  - **Action**: Measure throughput and execution latency against KPI targets.
  - **Target Files**: `tests/benchmark/parser-benchmark.test.ts`
  - **Specifications**:
    - Parsing 50,000 synthetic chat lines in Web Worker must complete in $< 1.5$ seconds.
    - Peak memory footprint must stay $< 80\text{MB}$.
    - Time from upload to Slide 01 render must stay $< 5.0$ seconds total.
  - **Verification**: Run benchmark test and assert metrics stay within thresholds.

- [x] **Task 12.5: Production Build Verification & Clean Launch**
  - **Action**: Execute production build, linting, and type-checking.
  - **Commands**:
    ```bash
    npm run lint
    npm run type-check
    npm run test
    npm run build
    ```
  - **Verification**: Clean exit code 0 on all four commands with zero warnings or errors.

---

## 📋 Definition of Done (DoD) Verification Checklist

Every phase and task in this document must satisfy these final release gates before being marked complete:

| Criterion | Requirement | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **Parsing Performance** | $\le 1.5\text{s}$ for 50,000 lines in Web Worker | `npm run test:benchmark` | [x] |
| **Zero Raw Chat Storage** | Raw `.txt` never touches server disk or database | Network interception audit | [x] |
| **Zero PII Leaks** | Excerpts scrub names, phones, emails, and financial data | `tests/e2e/privacy-leak-check.spec.ts` | [x] |
| **Swiss Design Fidelity** | 0px border-radius, pure black/white + Swiss Red `#FF3000` | DOM computed styles inspection | [x] |
| **Ethical AI Guardrails** | Zero prohibited clinical diagnoses in outputs | `tests/unit/guardrail-filter.test.ts` | [x] |
| **Evidence Grounding** | All signals cite valid `evidenceExcerptIds` and confidence | JSON schema validation | [x] |
| **Test Coverage** | $> 90\%$ code coverage on parsers, anonymizers, metrics | `npm run test:coverage` | [x] |
| **Production Build** | Zero TypeScript errors, zero lint warnings | `npm run build` | [x] |
