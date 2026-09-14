# Contributing to DecodeUs 🔍💬

Thank you for your interest in contributing to **DecodeUs**! We welcome bug fixes, performance optimizations, parser enhancements, and feature contributions.

To preserve product integrity, user privacy, and visual excellence, all contributors must strictly adhere to the guidelines set forth in this document.

---

## 1. Non-Negotiable Core Rules

### 1.1 The Privacy & Synthetic Data Mandate
> [!CAUTION]
> **NEVER COMMIT REAL CHAT LOGS OR PII TO GIT.**  
> Committing real conversations, telephone numbers, full names, or private messages to this repository is an immediate security incident. Any pull request containing real chat data will be rejected and permanently scrubbed from Git history.
>
> **Always use synthetic fixtures** generated via `npm run test:generate-fixture`.

### 1.2 The Swiss International Design Tenets
All UI additions must strictly obey [`design.md`](design.md):
- **Zero Border Radius**: Every container, button, card, and input must use `rounded-none` (`border-radius: 0px`).
- **Zero Artificial Elevation**: Prohibit `shadow-*`, blurred glassmorphism, and color gradients. Visual depth is created solely via 2px/4px solid borders and mathematical pattern overlays (`.swiss-grid-pattern`, `.swiss-dots`, `.swiss-diagonal`, `.swiss-noise`).
- **Single Signal Color**: The color palette is 95% black, white, and gray. The only primary accent color is **Swiss Red (`#FF3000`)**. Green (`#008A39`) and Amber (`#E05300`) are strictly reserved for diagnostic status badges.

### 1.3 Behavioral Framing (No Clinical Diagnoses)
DecodeUs adheres to: *"Analyze patterns, not people."*  
Never introduce prompts, algorithms, or UI text that output diagnostic psychiatric labels (e.g., "narcissist", "toxic", "borderline", "bipolar"). Describe observable communication behaviors and dynamics only.

---

## 2. Development Setup & Tooling

### Prerequisites
- **Node.js**: `v20.10.0+` (LTS recommended)
- **Package Manager**: `npm` (or `pnpm` / `bun`)
- **API Key**: A valid [Google Gemini API Key](https://ai.google.dev/) for server-side testing (or use offline mock fixtures).

### Step-by-Step Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/DecodeUs.git
cd DecodeUs

# 2. Install dependencies
npm install

# 3. Configure local environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Architecture & Codebase Map

```
DecodeUs/
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── api/                  # Server-side API route proxies
│   │   │   ├── analyze/route.ts  # Gemini structured intelligence synthesis
│   │   │   └── chat/route.ts     # Grounded Q&A terminal route
│   │   ├── layout.tsx            # Global layout, Swiss noise & font setup
│   │   └── page.tsx              # Primary application interface
│   ├── components/
│   │   ├── swiss/                # Atomic Swiss design components (Buttons, Grids, Badges)
│   │   ├── wrapped/              # 6-slide Relationship Wrapped story experience
│   │   ├── dashboard/            # Deep diagnostic tabs (Fingerprint, Signals, Replay)
│   │   └── chat/                 # "Ask Your Chat" interactive terminal
│   ├── lib/
│   │   ├── anonymizer.ts         # Client-side PII scrubbing & pseudonymization
│   │   ├── windowing.ts          # Excerpt sampling & context windowing
│   │   └── gemini.ts             # Server-side Gemini client & schema validation
│   └── workers/
│       └── parse.worker.ts       # Off-thread Web Worker for parsing & deterministic stats
├── tests/
│   ├── fixtures/
│   │   ├── mock-report.json      # Offline Gemini mock report
│   │   └── synthetic/            # Synthetic WhatsApp .txt chat logs
│   ├── unit/                     # Vitest unit tests (parsers, metrics, anonymizer)
│   └── e2e/                      # Playwright end-to-end user journeys
├── architecture.md               # Detailed system architecture document
├── workflow.md                   # User journeys & operational workflows
├── mvp.md                        # MVP scope, acceptance criteria & sprint roadmap
├── privacy-security.md           # Zero-knowledge architecture & ethical AI governance
├── api-spec.md                   # TypeScript interfaces & API endpoint contracts
├── design.md                     # Swiss International design system master spec
└── Idea.md                       # Core product philosophy & feature breakdown
```

---

## 4. How to Extend DecodeUs

### 4.1 Adding a New WhatsApp Export Format / Regex
WhatsApp frequently modifies its timestamp formatting across different OS updates and countries.

1. Open `src/workers/parse.worker.ts`.
2. Locate the `MATCH_PATTERNS` regex array.
3. Add your regex pattern with named capture groups:
   ```typescript
   // Example: Adding French bracketed format [JJ/MM/AAAA à HH:MM:SS]
   const FRENCH_IOS_REGEX = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4})\s+à\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s+(.*)$/;
   ```
4. Create a synthetic test case in `tests/unit/parser.test.ts` to verify matching and multiline stitching.

### 4.2 Adding a New Deterministic Metric
1. Add the type definition to `DeterministicMetrics` in [`api-spec.md`](api-spec.md) and `src/types/metrics.ts`.
2. Implement the pure mathematical calculation inside `src/workers/metrics.ts`.
3. Add unit tests in `tests/unit/metrics.test.ts` verifying accuracy against known synthetic arrays.
4. Render the new metric in the appropriate dashboard tab or Wrapped story slide.

---

## 5. Testing & Quality Assurance

All pull requests must pass the local test suite prior to submission:

```bash
# 1. Run unit tests
npm run test

# 2. Run unit tests with code coverage (> 90% required on parser & metrics)
npm run test:coverage

# 3. Run type-checking
npm run type-check

# 4. Run linter
npm run lint

# 5. Run end-to-end tests
npm run test:e2e

# 6. Check for accidental real PII or secret commits
npm run test:leak-check
```

---

## 6. Pull Request Submission Checklist

Before opening a pull request, ensure:

- [ ] **Zero PII**: No real chat files, personal names, or phone numbers are included.
- [ ] **Tests Pass**: `npm run test` and `npm run type-check` pass with zero errors.
- [ ] **Design Token Compliance**: All new UI components use `rounded-none`, zero drop shadows, and Swiss Red (`#FF3000`) for accents.
- [ ] **Non-Diagnostic Language**: No clinical psychological labels appear in code, prompts, or UI copy.
- [ ] **Conventional Commit Messages**: Commit messages follow the format: `feat(...)`, `fix(...)`, `docs(...)`, `style(...)`, or `test(...)`.
- [ ] **Documentation**: Any new metric or API modification is documented in [`api-spec.md`](api-spec.md).

Thank you for helping build an objective, ethical, and privacy-first tool for human relationships!
