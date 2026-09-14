# DecodeUs — Design System & UI/UX Architecture Specification
**Style**: Swiss International (International Typographic Style)  
**Status**: Approved Master Specification  
**Version**: 1.0.0  
**Target Stack**: Next.js 15+ (App Router, TypeScript), Tailwind CSS, shadcn/ui, Framer Motion, Recharts  

---

## 1. Executive Summary & Brand Convergence

### 1.1 The Thesis
**DecodeUs** is an objective, privacy-first relationship intelligence platform that analyzes exported WhatsApp chats. Its guiding tenet is:
> **"Analyze patterns, not people."**

Traditional relationship apps rely on fuzzy pastels, ambiguous pop-psychology buzzwords, soft drop shadows, and patronizing therapy tropes. DecodeUs rejects this entirely. 

By uniting DecodeUs with the **Swiss International Typographic Style (International Typographic Style)** born in 1950s Switzerland, the visual interface becomes a direct manifestation of the product's moral and analytical philosophy:
*   **Neutrality over Sentimentality**: The software acts as an impartial lens and scientific conduit for empirical communication data.
*   **The Grid as Law**: Every metric, message excerpt, and confidence score is locked into a mathematical, visible grid structure.
*   **Typography is the Interface**: Legibility, scale contrast, and grotesque typefaces (Inter) deliver hierarchy without decorative distraction.
*   **Tactile Flat Depth**: Zero drop shadows or artificial bevels. Visual depth is engineered through layered architectural textures: 24px structural grids, 16px dot matrices, 45° diagonal lines, and organic noise overlays.
*   **Functional Signal Color**: The palette is uncompromisingly monochrome (Pure White `#FFFFFF`, Pure Black `#000000`, Muted Gray `#F2F2F2`) pierced exclusively by **Swiss Red (`#FF3000`)** used as an alert, diagnostic indicator, and critical focal point.

---

## 2. Core Design Philosophy & Tenets

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SWISS CORE TENETS                             │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ 01. OBJECTIVITY   │ 02. THE GRID      │ 03. TYPOGRAPHY AS INTERFACE     │
│ Content speaks;   │ Visible skeleton; │ Scale & weight create           │
│ zero ornamentation│ asymmetric tension│ hierarchy; grotesque sans-serif │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ 04. ACTIVE SPACE  │ 05. TEXTURE DEPTH │ 06. UNIVERSAL INTELLIGIBILITY   │
│ Structural vacuum │ 4 CSS patterns;   │ Instant comprehension;          │
│ provides tension  │ flat tactile feel │ uncompromising precision        │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

### Tenet 01: Objectivity over Subjectivity
The design recedes so the empirical communication data commands the stage. DecodeUs does not diagnose clinical pathologies (e.g., "narcissist", "toxic"). It plots observable behaviors: initiation ratios, median response delays, double-text bursts, and recurring conflict loops. Every visual decision must be justifiable by data density and clarity.

### Tenet 02: The Grid as Law
The grid is neither invisible nor advisory—it is the structural frame of the interface. 
- Layouts adopt deliberate **asymmetrical organization** (e.g., 8:4 hero split, 7:5 evidence balance, 5:7 reality check matrix).
- Visible 2px and 4px black borders delineate data cells.
- Backgrounds expose structural coordinates through a subtle 24×24px grid overlay.

### Tenet 03: Typography is the Interface
Scale contrast replaces graphic ornamentation. Massive responsive headlines (`text-7xl` to `text-[10rem]`) juxtapose against ultra-dense, uppercase, tracked-out micro-labels (`text-[10px] tracking-widest`). The grotesque typeface `Inter` operates as an objective instrument of truth.

### Tenet 04: Active Negative Space
White space is an active structural counterweight. Expansive white fields give physical weight to bold black data points, allowing users to process sensitive emotional findings with mental clarity.

### Tenet 05: Layered Texture & Depth (Zero Shadows)
Drop shadows, blurry glassmorphism, and color gradients are prohibited. Depth is achieved strictly through four mathematical CSS pattern overlays:
1.  **Grid Pattern (`.swiss-grid-pattern`)**: 24×24px lines at 3% opacity for structural frames.
2.  **Dot Matrix (`.swiss-dots`)**: 16×16px radial dots at 4% opacity evoking print ephemera.
3.  **Diagonal Lines (`.swiss-diagonal`)**: 45° repeating strokes at 2% opacity for contextual emphasis.
4.  **Noise Overlay (`.swiss-noise`)**: 1.5% SVG fractal noise across the global canvas simulating high-grade archival paper.

### Tenet 06: Universal Intelligibility & Functional Signal
DecodeUs communicates findings without ambiguity. The single signal color—**Swiss Red (`#FF3000`)**—acts like a physical stop sign or precision laser, reserved exclusively for:
- Critical action buttons (CTAs)
- Primary warnings / high-risk communication bottlenecks
- Section index numerals (`01.`, `02.`, `03.`)
- Live hover inversion states

---

## 3. Design Token Architecture

```
TOKENS SCHEMA (Tailwind & CSS Variables)
 ├── Colors: Base (Pure White, Pure Black, Muted Gray, Swiss Red)
 ├── Typography: Inter (Weights 400, 500, 700, 900; Ratios 1.25 -> 1.414)
 ├── Borders: 0px Radius (rounded-none), 1px/2px/4px Widths
 ├── Spacing: 4px Baseline (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
 └── Elevation: 0px Blur, Flat Inversion, Sharp Borders
```

### 3.1 Color Specification

| Token Name | Hex Code | HSL / CSS Var | Semantic Function & Application Rules |
| :--- | :--- | :--- | :--- |
| `swiss-bg` | `#FFFFFF` | `0 0% 100%` | Primary canvas. Absolute pure white. No warm/cool tints. |
| `swiss-fg` | `#000000` | `0 0% 0%` | Primary typography, structural frames, solid buttons. |
| `swiss-muted`| `#F2F2F2` | `0 0% 94.9%`| Secondary surfaces, data card backings, table headers. |
| `swiss-muted-border`| `#E5E5E5`| `0 0% 89.8%`| Subtle secondary dividers inside dense data grids. |
| `swiss-accent`| `#FF3000` | `11 100% 50%`| **Swiss Red**. Single signal color. CTAs, alerts, section numbers. |
| `swiss-accent-hover`| `#D62700`| `11 100% 42%`| Active press/hover state for accent buttons. |
| `swiss-green`| `#008A39` | `145 100% 27%`| High-contrast dark botanical green (Green Flags only). |
| `swiss-amber`| `#E05300` | `22 100% 44%` | High-contrast deep industrial amber (Mixed Signals only). |

> [!IMPORTANT]
> `swiss-green` and `swiss-amber` are used solely for diagnostic status pills inside reports. They must never be used for background floods or decorative treatments. The UI remains 95% black, white, and gray, with red as the primary system accent.

### 3.2 Typography Tokens

*   **Primary Typeface**: `Inter`, sans-serif (Google Font).
*   **Fallback Font Stack**: `Helvetica Neue, Helvetica, Arial, sans-serif`.
*   **Scale Hierarchy**:

| Scale Token | Class Name | Size (Desktop / Mobile) | Line Height | Tracking | Weight | Case | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-2xl` | `text-[10rem] / text-6xl` | `160px / 64px` | `0.9` | `tracking-tighter` | 900 (Black) | Uppercase | Wrapped key stats, hero impact |
| `display-xl` | `text-8xl / text-5xl` | `96px / 48px` | `0.95` | `tracking-tighter` | 900 (Black) | Uppercase | Major page section headings |
| `display-lg` | `text-6xl / text-4xl` | `60px / 36px` | `1.0` | `tracking-tight` | 900 (Black) | Uppercase | Feature slide titles, card numbers |
| `heading-1` | `text-4xl / text-2xl` | `36px / 24px` | `1.1` | `tracking-tight` | 700 (Bold) | Uppercase | Card headers, module titles |
| `heading-2` | `text-2xl / text-xl` | `24px / 20px` | `1.2` | `tracking-tight` | 700 (Bold) | Uppercase | Sub-section headers, modal titles |
| `heading-3` | `text-lg / text-base` | `18px / 16px` | `1.3` | `tracking-normal`| 700 (Bold) | Uppercase | Evidence item titles, table headers |
| `body-lg` | `text-lg / text-base` | `18px / 16px` | `1.5` | `tracking-normal`| 400 (Regular)| Sentence | Reality Check narrative summaries |
| `body-md` | `text-base / text-sm` | `16px / 14px` | `1.5` | `tracking-normal`| 400 / 500 | Sentence | General body copy, chat excerpts |
| `body-sm` | `text-sm / text-xs` | `14px / 12px` | `1.4` | `tracking-normal`| 400 / 500 | Sentence | Excerpt metadata, timestamps |
| `mono-code` | `text-xs / text-[11px]` | `12px / 11px` | `1.2` | `tracking-wider` | 500 (Mono) | Uppercase | Timestamps, confidence tags |
| `label-meta` | `text-[10px]` | `10px` | `1.0` | `tracking-widest`| 700 (Bold) | Uppercase | Section prefix indices (`01. SYSTEM`)|

### 3.3 Spatial System & Geometry
*   **Corner Radii**: Strictly `0px` (`rounded-none`). Rounded corners, pills, and soft blobs are forbidden.
*   **Borders**: 
    - Structural outer containers: `4px solid #000000` (`border-4 border-black`).
    - Internal grid dividers & cards: `2px solid #000000` (`border-2 border-black`).
    - Fine data table lines: `1px solid #E5E5E5` (`border border-swiss-muted-border`).
*   **Spacing Multiples**: 4px base unit. Primary spatial steps: `8px` (`p-2`), `16px` (`p-4`), `24px` (`p-6`), `32px` (`p-8`), `48px` (`p-12`), `64px` (`p-16`), `96px` (`p-24`).

### 3.4 Textures & Pattern Library (CSS Engine)

```css
/* ==========================================================================
   SWISS PATTERN ENGINE (Add to globals.css)
   ========================================================================== */

/* 1. Structural Grid (24x24px, 3% opacity) */
.swiss-grid-pattern {
  background-size: 24px 24px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
}

/* 2. Traditional Print Dot Matrix (16x16px, 4% opacity) */
.swiss-dots {
  background-size: 16px 16px;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.06) 1.5px, transparent 1.5px);
}

/* 3. Kinetic Diagonal Line Matrix (10px spacing, 2% opacity) */
.swiss-diagonal {
  background-size: 14px 14px;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.03),
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px,
    transparent 10px
  );
}

/* 4. Archival Paper Noise Texture Overlay */
.swiss-noise {
  position: relative;
}
.swiss-noise::before {
  content: "";
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
```

---

## 4. Component Architecture & UI Kit Specification

### 4.1 Button System

Buttons operate on instant, mechanical color inversion. Rounded edges and spring animations are strictly forbidden.

```
BUTTON ANATOMY
┌───────────────────────────────────────────────────────────┐
│ [01] PRIMARY ACTION                             [ARROW ↗] │ ← Height: 56px / 64px
└───────────────────────────────────────────────────────────┘
Hover state: Invert #000000 → #FF3000 (Swiss Red) with text staying White.
```

*   **Primary Button (`ButtonPrimary`)**:
    - Default: `bg-black text-white rounded-none border-2 border-black font-black uppercase tracking-wider text-sm h-14 px-8`
    - Hover: `hover:bg-swiss-accent hover:border-swiss-accent transition-colors duration-150`
    - Focus: `focus-visible:ring-2 focus-visible:ring-swiss-accent focus-visible:ring-offset-2`
*   **Secondary Button (`ButtonSecondary`)**:
    - Default: `bg-white text-black rounded-none border-2 border-black font-black uppercase tracking-wider text-sm h-14 px-8`
    - Hover: `hover:bg-black hover:text-white transition-colors duration-150`
*   **Accent Signal Button (`ButtonAccent`)**:
    - Default: `bg-swiss-accent text-white rounded-none border-2 border-swiss-accent font-black uppercase tracking-wider text-sm h-14 px-8`
    - Hover: `hover:bg-black hover:border-black transition-colors duration-150`

### 4.2 Structural Card System (`SwissCard`)

All containers utilize visible structural black borders, zero radius, and optional pattern overlays on muted surfaces.

```
SWISS CARD SCHEMATIC
┌──────────────────────────────────────────┬────────────────┐
│ 02. EFFORT BALANCE                       │ CONFIDENCE: HI │ ← Header Cell
├──────────────────────────────────────────┴────────────────┤
│ 82%                                                       │ ← Massive Metric
│ INITIATION ASYMMETRY DETECTED                             │
│                                                           │
│ Person A initiated 82% of threads (142 of 173 instances). │ ← Objective Body
├───────────────────────────────────────────────────────────┤
│ [EXAMINE RECEIPTS (142) →]                                │ ← Footer Cell
└───────────────────────────────────────────────────────────┘
```

*   **Standard Content Card**:
    - Container: `bg-white border-2 border-black rounded-none p-6 md:p-8 relative`
    - Interactive Variant: `hover:border-swiss-accent group transition-colors duration-150`
*   **Muted Pattern Card**:
    - Container: `bg-swiss-muted swiss-grid-pattern border-2 border-black rounded-none p-6 md:p-8`
*   **Alert Diagnostic Box**:
    - Container: `bg-white border-4 border-swiss-accent rounded-none p-6 md:p-8`

### 4.3 Signal Badges & Status Pills

Status indicators replace amorphous tags with precision geometric badges.

```html
<!-- Green Flag Badge -->
<div class="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-none">
  <span class="w-2.5 h-2.5 bg-[#008A39]"></span>
  <span class="text-xs font-black uppercase tracking-widest text-black">GREEN SIGNAL</span>
</div>

<!-- Red Alert Signal Badge -->
<div class="inline-flex items-center gap-2 px-3 py-1 bg-swiss-accent text-white border-2 border-black rounded-none">
  <span class="w-2.5 h-2.5 bg-white"></span>
  <span class="text-xs font-black uppercase tracking-widest">CRITICAL PATTERN</span>
</div>

<!-- Mixed Signal Badge -->
<div class="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F2F2] border-2 border-black rounded-none">
  <span class="w-2.5 h-2.5 bg-[#E05300]"></span>
  <span class="text-xs font-black uppercase tracking-widest text-black">MIXED SIGNAL</span>
</div>

<!-- Confidence Indicator -->
<div class="inline-flex items-center px-2 py-0.5 bg-black text-white text-[10px] font-mono tracking-widest uppercase">
  EVIDENCE: HIGH (94%)
</div>
```

### 4.4 Form Controls & Ingestion Dropzone

*   **File Dropzone (WhatsApp `.txt` Parser)**:
    - Container: `border-4 border-dashed border-black bg-swiss-muted swiss-dots p-12 md:p-20 text-center rounded-none cursor-pointer hover:border-swiss-accent hover:bg-white transition-all duration-150`
    - Iconography: Strict geometric square container enclosing a minimalist black upload symbol.
    - Accompanying Typography: `text-2xl font-black uppercase tracking-tight` with micro-label `text-xs uppercase tracking-widest text-neutral-600 mt-2`.
*   **Input Fields**:
    - Base: `bg-white border-2 border-black rounded-none px-4 py-3 text-sm font-medium focus:outline-none focus:border-swiss-accent focus:ring-0 placeholder:text-neutral-400 placeholder:uppercase placeholder:text-xs placeholder:tracking-wider`

---

## 5. Detailed Feature UI/UX Specifications

```
DECODEUS SCREEN FLOW PIPELINE
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│ 01. LANDING & INGESTION │ ──> │ 02. RELATIONSHIP WRAPPED│ ──> │ 03. FULL DIAGNOSTIC HUB │
│ • Local Parser Dropzone │     │ • 5-Slide Story Poster  │     │ • Fingerprint Matrix    │
│ • Privacy Spec Sheet    │     │ • Massive Type Dynamics │     │ • Pattern Replay Loops  │
└─────────────────────────┘     └─────────────────────────┘     │ • Reality Check Lab     │
                                                                │ • Evidence Drawer       │
                                                                │ • Ask Your Chat Grounded│
                                                                └─────────────────────────┘
```

### 5.1 Screen 01: Landing & Local-First Ingestion

#### Layout Architecture
*   **Grid Division**: Asymmetric 8:4 desktop layout (`col-span-8` / `col-span-4`).
*   **Left Column (8 cols)**:
    - Numbered Section Index: `01. INGESTION ENGINE` in Swiss Red (`text-xs tracking-widest font-black text-swiss-accent`).
    - Massive Headline: `UNDERSTAND WHAT YOUR RELATIONSHIP ACTUALLY LOOKS LIKE.` (`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95]`).
    - The Dropzone: 4px border-dashed rectangular box with dot matrix texture. Accepts drag-and-drop of `.txt` exports.
*   **Right Column (4 cols)**:
    - The "Privacy by Design" architectural manifest table.
    - Displays client-side execution parameters:
      - `PARSING`: `100% IN-BROWSER (WEB WORKER)`
      - `RAW CHAT STORAGE`: `ZERO PERSISTENCE`
      - `DIAGNOSTIC POLICY`: `NO CLINICAL LABELS`
      - `AI SCOPE`: `SANITIZED EXCERPT WINDOWS ONLY`
    - Each parameter is boxed in a 2px black grid cell with muted background.

---

### 5.2 Feature 02: Relationship Wrapped (The Swiss Story Flow)

Traditional "Wrapped" experiences are cartoonish and bubbly. The DecodeUs Swiss Wrapped is structured as a series of high-density, collectible typographic exhibition posters.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [01/05] INITIATION RATIO                          DECODEUS ARCHIVE '26 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   74%                                     26%                          │
│   ALEX                                    JORDAN                       │
│                                                                        │
│   █                                       █                            │
│   █                                       █                            │
│   █                                       █                            │
│   █                                       ░                            │
│   █                                       ░                            │
│                                                                        │
│   OUT OF 412 CONVERSATION STARTS OVER 9 MONTHS, ALEX INITIATED 305.    │
│   RESPONSE DELAY: ALEX (4m MEDIAN) vs JORDAN (46m MEDIAN).             │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [← PREVIOUS METRIC]                                  [NEXT: RHYTHM →]  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Slide Breakdown

##### Slide 1: The Initiation Split
*   **Visual Hero**: Two monolithic geometric vertical bars (black for User A, white with 4px black outline for User B).
*   **Metric Scale**: `text-8xl md:text-[9rem] font-black tracking-tighter`.
*   **Accompanying Copy**: Monospaced mathematical breakdown (`305 of 412 total conversational epochs initiated by Participant A`).

##### Slide 2: Response Dynamics & Silence Limits
*   **Visual Hero**: Asymmetric comparison block.
*   **Metrics**:
    - Median Response Speed: `4 MIN` vs `46 MIN`.
    - The Longest Silence: Massive date and duration stamp (`18 DAYS, 4 HOURS — OCT 12 TO OCT 30`).
*   **Background**: Layered with `.swiss-diagonal` pattern.

##### Slide 3: 24-Hour Rhythm & Habit Heatmap
*   **Visual Hero**: 24-column bar matrix representing hours of the day (00:00 to 23:00).
*   **Visual Encoding**: Solid black bars for normal activity, Swiss Red bars for peak messaging spikes (e.g., late-night emotional discussions between 01:00 and 03:30 AM).

##### Slide 4: Vocabulary & Emoji Signatures
*   **Visual Hero**: Typographic word-frequency composition.
*   Words and emoji clusters are arranged in a strict rectangular grid without rotation or random scattering. Sized strictly according to mathematical frequency ratios.

##### Slide 5: The Relationship Archetype Card
*   **Final Shareable Slide**: Formatted in a 9:16 mobile-first aspect ratio suitable for social export (`html-to-image`).
*   Contains the summary fingerprint: Archetype Title (e.g., `THE ASYMMETRIC PERSISTENT LOOP`), Primary Green Signal, Primary Friction Point, and total words decoded.
*   Enclosed in a 4px black frame with a Swiss Red badge stamp in the top right.

---

### 5.3 Feature 03: Relationship Fingerprint & Signals Matrix

A multi-dimensional diagnostic matrix displaying the 7 communication pillars:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 02. RELATIONSHIP FINGERPRINT MATRIX                 OVERALL BALANCE: 58│
├───────────────────────┬────────────────────────┬───────────────────────┤
│ COMMUNICATION         │ CONFLICT RESOLUTION    │ EMOTIONAL RECIPROCITY │
│ [████████░░] 78%      │ [███░░░░░░░] 32%       │ [██████░░░░] 61%      │
│ Balanced cadence      │ Avoidant retreat cycle │ Unequal validation    │
├───────────────────────┼────────────────────────┼───────────────────────┤
│ EFFORT BALANCE        │ AFFECTION & WARMTH     │ CONSISTENCY           │
│ [████░░░░░░] 41%      │ [█████████░] 91%       │ [█████░░░░░] 52%      │
│ High initiation drift │ High verbal affection  │ Weekend drop-off      │
├───────────────────────┴────────────────────────┴───────────────────────┤
│ BOUNDARIES: [████████░░] 80% — Clear limit enforcement, low intrusion  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Signal Card Taxonomy
Signals are cataloged as discrete data units:
1.  **Green Flags (`.signal-green`)**:
    - White background, 2px black border, solid dark-green square identifier (`w-3 h-3 bg-[#008A39]`).
    - Example: `PROACTIVE REPAIR ATTEMPTS — Apology or de-escalation initiated within 60 minutes in 7 of 9 arguments.`
2.  **Red Alert Patterns (`.signal-red`)**:
    - White background, 4px black border, solid Swiss Red square identifier (`w-3 h-3 bg-swiss-accent`).
    - Red Accent left border stripe (`border-l-8 border-l-swiss-accent`).
    - Example: `GUILT-BASED OBLIGATION CYCLES — Detected 14 instances of responsibility redirection following boundary requests.`
3.  **Mixed Signals (`.signal-mixed`)**:
    - Muted gray background, 2px black border, solid industrial amber identifier (`w-3 h-3 bg-[#E05300]`).
    - Example: `HIGH AFFECTION + WEAK CONFLICT RESOLUTION — High verbal warmth (94th percentile) accompanied by zero resolution follow-through after disagreements.`

---

### 5.4 Feature 04: Pattern Replay (Visual Behavioral Loop)

The Pattern Replay feature visualizes recurring interaction loops rather than isolated messages.

```
PATTERN REPLAY FLOW ENGINE
┌────────────────────────────────────────────────────────────────────────┐
│ LOOP 01: THE AVOIDANCE-ESCALATION CYCLE             DETECTED: 8 TIMES  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌───────────────┐        ┌───────────────┐        ┌───────────────┐  │
│   │ [STEP 01]     │        │ [STEP 02]     │        │ [STEP 03]     │  │
│   │ CONCERN       │ ─────> │ DEFENSIVE     │ ─────> │ STONEWALLING  │  │
│   │ RAISED        │        │ DEFLECTION    │        │ (SILENCE)     │  │
│   │ User A        │        │ User B        │        │ User B (18h)  │  │
│   └───────────────┘        └───────────────┘        └───────┬───────┘  │
│                                                             │          │
│                            ┌───────────────┐                │          │
│                            │ [STEP 04]     │                │          │
│                            │ SURFICIAL     │ <──────────────┘          │
│                            │ TRUCE         │                           │
│                            │ Unresolved    │                           │
│                            └───────┬───────┘                           │
│                                    │                                   │
│                                    v                                   │
│                        ┌───────────────────────┐                       │
│                        │ [CYCLE REPEATS IN     │                       │
│                        │  AVERAGE 14.2 DAYS]   │                       │
│                        └───────────────────────┘                       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [VIEW ALL 8 EVIDENCE TIMESTAMPS]               [EXPAND FULL TRANSCRIPT]│
└────────────────────────────────────────────────────────────────────────┘
```

*   **Node Architecture**: Rectangular boxes (`border-2 border-black bg-white p-4 rounded-none`).
*   **Step Indicators**: Red monospaced prefix tags (`[STEP 01]`).
*   **Connectors**: Orthogonal 2px solid black lines with sharp 90-degree elbows and solid black arrow heads. No smooth bezier curves.
*   **Cycle Time Badge**: Solid black footer block with white monospaced text.

---

### 5.5 Feature 05: Reality Check Lab

Tests subjective user fears against objective mathematical chat logs.

```
REALITY CHECK MATRIX
┌───────────────────────────────────┬───────────────────────────────────┐
│ YOUR ASSUMPTION                   │ OBSERVED CHAT DATA                │
├───────────────────────────────────┼───────────────────────────────────┤
│ "I feel like they are completely  │ • Initiation dropped from 52% to  │
│ losing interest in me."           │   18% over the last 90 days.      │
│                                   │ • HOWEVER: Emotional depth & word │
│                                   │   count per reply increased +24%. │
│                                   │ • Validation statements remained  │
│                                   │   constant (1.8/day avg).         │
├───────────────────────────────────┴───────────────────────────────────┤
│ VERDICT: COMMUNICATION CADENCE SHIFT, NOT EMOTIONAL DETACHMENT.       │
│ CONFIDENCE: MODERATE (EVIDENCE SCORE: 72/100)                         │
└───────────────────────────────────────────────────────────────────────┘
```

*   **Layout**: 2-column comparison table with 2px black grid lines.
*   **Left Cell (Assumption)**: White background, 700 bold typography, representing human feeling.
*   **Right Cell (Observed Data)**: Muted gray background (`bg-swiss-muted`), monospaced bullet points, representing empirical receipts.
*   **Verdict Block**: Spans full width at the bottom. Background is pure black with pure white uppercase typography. Swiss Red confidence badge aligned to the right.

---

### 5.6 Feature 06: Evidence Mode & Receipts Drawer

Every finding, badge, and pattern has a verifiable chain of custody back to the raw messages.

```
EVIDENCE DRAWER (EXPANDED STATE)
┌────────────────────────────────────────────────────────────────────────┐
│ EVIDENCE DOSSIER: PATTERN #04 (GUILT-BASED REDIRECTION)                │
│ 14 TOTAL INSTANCES DETECTED • CONFIDENCE: HIGH                         │
├────────────────────────────────────────────────────────────────────────┤
│ [INSTANCE 03 OF 14] — TIMESTAMP: 2025-11-14 22:41:04                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ 22:40:12 | User A: "I felt hurt when you cancelled our plans after I   │
│                    waited for two hours."                              │
│                                                                        │
│ 22:41:04 | User B: "If you didn't stress me out so much about work,   │
│                    I wouldn't need to take space for myself."          │
│                    ▲ [TRIGGER: RESPONSIBILITY REDIRECTION]             │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ REASONING: User B shifts focus from the broken commitment to User A's  │
│ alleged fault, redirecting accountability without addressing the hurt. │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Transcript Typography**: Strict monospaced format (`font-mono text-sm`), flush-left, ragged-right.
*   **Trigger Annotations**: Highlighted in Swiss Red background with white text (`bg-swiss-accent text-white px-1.5 py-0.5 font-mono text-xs uppercase`).
*   **Drawer Behavior**: Slides in vertically from the bottom or anchors inline below the finding. Rigid 200ms mechanical slide transition (`ease-out`).

---

### 5.7 Feature 07: Ask Your Chat (Interactive Query Terminal)

Grounded Q&A interface allowing users to interrogate their conversation data.

```
ASK YOUR CHAT TERMINAL
┌────────────────────────────────────────────────────────────────────────┐
│ > QUERY: "Who apologizes first after an argument?"                     │
├────────────────────────────────────────────────────────────────────────┤
│ SUGGESTED QUERIES:                                                     │
│ [WHEN DID WE START TALKING LESS?]  [WHAT TOPICS TRIGGER ARGUMENTS?]    │
├────────────────────────────────────────────────────────────────────────┤
│ ANALYSIS RESULT (GROUNDED IN 1,280 DAYS OF CHAT):                      │
│                                                                        │
│ In 18 documented disagreements:                                        │
│ • User A apologized first in 14 instances (77.8%).                     │
│ • User B apologized first in 2 instances (11.1%).                      │
│ • 2 arguments reached surficial truce with no explicit apology (11.1%).│
│                                                                        │
│ AVERAGE TIME TO FIRST REPAIR ATTEMPT:                                  │
│ User A: 2 hours, 14 minutes.                                           │
│ User B: 31 hours, 45 minutes.                                          │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [EXAMINE 18 APOLOGY RECEIPTS →]                                        │
└────────────────────────────────────────────────────────────────────────┘
```

*   **Style**: Emulates an architectural data terminal.
*   **Prompt Input**: Monospaced terminal prompt starting with `>`.
*   **Suggested Chips**: Rectangular buttons with 2px black borders, white background, turning black on hover with white text.
*   **Honesty on Uncertainty**: If data is insufficient, an unmistakable alert box appears:
    `INSUFFICIENT EVIDENCE: CHAT HISTORY DOES NOT CONTAIN ENOUGH CONFLICT EXCERPTS TO ESTABLISH A REPAIR CORRELATION.`

---

## 6. Micro-Interactions & Animation Specs

Swiss design motion is **mechanical, snappy, and instantaneous**. It avoids organic springs, elastic bounces, and whimsical floating effects.

```
MOTION SPECIFICATION
├── Duration: 150ms to 200ms
├── Easing: [0.2, 0.0, 0.0, 1.0] (Mechanical Snap)
├── Transforms: Instant scale (1.0 -> 1.03), Orthogonal icon rotation (0° -> 90°)
└── Color Changes: Sharp 1-frame or 100ms swaps (White -> Black, Black -> Red)
```

| Element | Interaction Event | Visual & Transform Behavior | Timing / Easing |
| :--- | :--- | :--- | :--- |
| **Primary Button** | Hover | Background snaps `#000000` → `#FF3000`. Text remains pure white. | `150ms linear` |
| **Secondary Button** | Hover | Background snaps `#FFFFFF` → `#000000`. Text snaps `#000000` → `#FFFFFF`. | `150ms linear` |
| **Data Metric Card** | Hover | Border switches `border-black` → `border-swiss-accent`. Upward lift `-2px`. | `200ms ease-out` |
| **Plus / Expand Icon**| Click / Open | Rotates precisely `0deg` → `90deg`. | `150ms ease-in-out` |
| **Arrow Link (`↗`)** | Hover | Shifts `4px` top-right along 45° vector (`translate-x-1 -translate-y-1`). | `150ms ease-out` |
| **Story Slide Transition** | Next / Prev | Horizontal rigid displacement without crossfade blur (`x: 100%` → `0%`). | `250ms [0.2, 0.0, 0.0, 1.0]` |
| **Evidence Drawer** | Open | Vertical slide-up from bottom boundary. 0px rounded corners. | `200ms [0.2, 0.0, 0.0, 1.0]` |

---

## 7. Responsive Breakpoint Strategy

```
RESPONSIVE COLUMN TRANSITIONS
Mobile (< 768px)         Tablet (768px - 1024px)    Desktop (1024px+)
┌─────────────────┐      ┌────────┬────────┐        ┌──────────────┬────────┐
│ 1 COLUMN STACK  │      │ 6 COLS │ 6 COLS │        │ 8 COLS       │ 4 COLS │
│ • 4px borders   │      │ • 2-col│ balance│        │ • Asymmetric │ Sidecar│
│ • Full-w CTA    │      │ • 64px │ display│        │ • 96px-160px │ Table  │
│ • 48px heading  │      └────────┴────────┘        └──────────────┴────────┘
└─────────────────┘
```

### 7.1 Mobile (< 768px)
*   **Layout**: Single column rigid vertical stack.
*   **Typography**: Massive display scales down proportionally but maintains high contrast (Hero display scales to `text-6xl` / `48px`).
*   **Borders**: Remain strictly `4px` on main outer boxes and `2px` on interior dividers. They **never** thin out to 1px.
*   **Action Targets**: All buttons expand to full width (`w-full`) with a minimum touch height of `56px` (`h-14`) to ensure accessible touch targets.
*   **Textures**: Dot matrices and grid patterns remain at identical CSS pixel densities.

### 7.2 Tablet (768px - 1024px)
*   **Layout**: 2-column balanced grid (`grid-cols-2`).
*   **Typography**: Headings expand to `text-7xl` / `72px`.
*   **Signals Matrix**: 2-column card layout with sticky section indices.

### 7.3 Desktop (1024px+)
*   **Layout**: Asymmetrical multi-column layouts (8:4 hero grid, 7:5 evidence balance, 3-column diagnostic cards).
*   **Typography**: Headings reach full architectural magnitude (`text-8xl` to `text-[10rem]`).
*   **Sticky Sidecars**: Navigation and section indexes lock into place while evidence dossiers scroll cleanly past.

---

## 8. Accessibility (a11y) & Engineering Rigor

1.  **Contrast Ratio Compliance**:
    - Pure Black (`#000000`) on Pure White (`#FFFFFF`): **21:1** (Exceeds WCAG AAA standard of 7:1).
    - Swiss Red (`#FF3000`) on Pure White (`#FFFFFF`): **3.99:1** for normal text, **suitable for large text (>=18pt/24px)**. For smaller text, Swiss Red is used as a background pill with pure white text (**4.2:1**) or pure black text (**5.3:1**).
    - Dark Botanical Green (`#008A39`) on Pure White: **5.1:1** (Meets WCAG AA).
2.  **Focus Indicator**:
    - Custom high-visibility 2px focus ring in Swiss Red:
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent focus-visible:ring-offset-2`
3.  **Reduced Motion**:
    - All mechanical slide and rotation animations gracefully degrade to instant cut-swaps when `prefers-reduced-motion: reduce` is active:
      `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }`
4.  **Semantic Hierarchy**:
    - Strict `<h1>` per view, followed by hierarchical `<h2>` for numbered sections and `<h3>` for individual metric cards.
    - All interactive cards, drawers, and tabs feature ARIA states (`aria-expanded`, `aria-controls`, `role="region"`).

---

## 9. Concrete Implementation Files

### 9.1 Tailwind Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          bg: "#FFFFFF",
          fg: "#000000",
          muted: "#F2F2F2",
          "muted-border": "#E5E5E5",
          accent: "#FF3000",
          "accent-hover": "#D62700",
          green: "#008A39",
          amber: "#E05300",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "Courier New", "monospace"],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "0px",
      },
      borderWidth: {
        DEFAULT: "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
      },
      transitionTimingFunction: {
        mechanical: "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 9.2 Global Styles & Pattern Injection (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
    --font-inter: 'Inter', sans-serif;
  }

  * {
    border-radius: 0px !important;
  }

  body {
    background-color: #FFFFFF;
    color: #000000;
    font-family: var(--font-inter);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Structural selection highlight */
  ::selection {
    background-color: #FF3000;
    color: #FFFFFF;
  }
}

@layer utilities {
  /* Pattern: 24px Structural Grid */
  .swiss-grid-pattern {
    background-size: 24px 24px;
    background-image: 
      linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  }

  /* Pattern: 16px Dot Matrix */
  .swiss-dots {
    background-size: 16px 16px;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.5px, transparent 1.5px);
  }

  /* Pattern: 45° Kinetic Diagonal */
  .swiss-diagonal {
    background-size: 14px 14px;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.035),
      rgba(0, 0, 0, 0.035) 1px,
      transparent 1px,
      transparent 10px
    );
  }
}
```

### 9.3 Core Component Implementations

#### A. Master Card Primitive (`components/ui/swiss-card.tsx`)
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface SwissCardProps extends React.HTMLAttributes<HTMLDivElement> {
  indexLabel?: string;
  variant?: "white" | "muted" | "alert";
  pattern?: "none" | "grid" | "dots" | "diagonal";
}

export const SwissCard = React.forwardRef<HTMLDivElement, SwissCardProps>(
  ({ className, indexLabel, variant = "white", pattern = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-none border-2 border-black relative transition-all duration-150",
          variant === "white" && "bg-white",
          variant === "muted" && "bg-swiss-muted",
          variant === "alert" && "bg-white border-4 border-swiss-accent",
          pattern === "grid" && "swiss-grid-pattern",
          pattern === "dots" && "swiss-dots",
          pattern === "diagonal" && "swiss-diagonal",
          className
        )}
        {...props}
      >
        {indexLabel && (
          <div className="border-b-2 border-black px-4 py-2 bg-white flex justify-between items-center">
            <span className="text-[10px] font-black tracking-widest uppercase text-swiss-accent">
              {indexLabel}
            </span>
            <span className="w-2 h-2 bg-black"></span>
          </div>
        )}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    );
  }
);
SwissCard.displayName = "SwissCard";
```

#### B. Inversion Button (`components/ui/swiss-button.tsx`)
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface SwissButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "default" | "lg" | "sm";
}

export const SwissButton = React.forwardRef<HTMLButtonElement, SwissButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-none font-black uppercase tracking-wider text-sm transition-colors duration-150 inline-flex items-center justify-center gap-3 border-2 border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swiss-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          size === "sm" && "h-10 px-4 text-xs",
          size === "default" && "h-14 px-8 text-sm",
          size === "lg" && "h-16 px-10 text-base",
          variant === "primary" && "bg-black text-white hover:bg-swiss-accent hover:border-swiss-accent",
          variant === "secondary" && "bg-white text-black hover:bg-black hover:text-white",
          variant === "accent" && "bg-swiss-accent text-white border-swiss-accent hover:bg-black hover:border-black",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SwissButton.displayName = "SwissButton";
```

#### C. Signal Badge (`components/ui/signal-badge.tsx`)
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  type: "green" | "red" | "mixed";
  title: string;
  occurrences?: number;
  className?: string;
}

export function SignalBadge({ type, title, occurrences, className }: SignalBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-none border-2 border-black px-4 py-3 flex items-center justify-between gap-4 bg-white",
        type === "red" && "border-l-8 border-l-swiss-accent",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-3 h-3 rounded-none flex-shrink-0",
            type === "green" && "bg-swiss-green",
            type === "red" && "bg-swiss-accent",
            type === "mixed" && "bg-swiss-amber"
          )}
        />
        <span className="text-xs font-black uppercase tracking-wide text-black">
          {title}
        </span>
      </div>
      {typeof occurrences === "number" && (
        <span className="text-[11px] font-mono tracking-widest text-neutral-600 uppercase">
          [{occurrences}× OBSERVED]
        </span>
      )}
    </div>
  );
}
```

---

## 10. Summary & Implementation Roadmap

| Phase | Milestone | Deliverables | Verification Standard |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation & Tokens | `tailwind.config.ts`, `globals.css`, Inter Font stack, SVG noise generator | Zero rounded corners anywhere in DOM; 24px grid texture rendering at 3% opacity. |
| **Phase 2** | Atomic UI Primitives | `SwissButton`, `SwissCard`, `SignalBadge`, `SectionHeader`, Dropzone component | Color inversion hovers perform under 150ms; WCAG AA/AAA contrast ratios confirmed. |
| **Phase 3** | Wrapped Experience | 5-slide typographic story carousel using Framer Motion step transitions | Desktop displays scale to 160px; mobile scales to 64px; no horizontal overflow. |
| **Phase 4** | Diagnostic Core | Signals Matrix, Pattern Replay flowchart, Reality Check table, Evidence Drawer | Receipts drawer slides open mechanically; trigger timestamps clearly annotated. |
| **Phase 5** | Social Share Generator | Headless image generator (`@vercel/og` or `html-to-image`) | 9:16 and 1:1 crisp PNG export matching Swiss poster aesthetics. |
