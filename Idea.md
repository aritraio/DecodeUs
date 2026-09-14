# DecodeUs

> **Understand what your relationship actually looks like through your conversations.**

DecodeUs is a privacy-first WhatsApp conversation analyzer that turns an exported chat into a **relationship intelligence report**. Instead of simply declaring someone a “red flag,” it identifies measurable communication patterns, recurring dynamics, positive signals, concerns, changes over time, and practical next steps.

The product should combine the **shareability of Spotify Wrapped**, the usefulness of relationship analytics, and the reasoning ability of an LLM.

---

## 1. Product Vision

### Core idea

User exports a WhatsApp chat and uploads it to DecodeUs.

DecodeUs:

1. Parses the chat.
2. Calculates objective communication statistics.
3. Detects semantic and behavioral patterns.
4. Identifies potential red flags, green flags, and mixed signals.
5. Shows evidence for important conclusions.
6. Explains uncertainty instead of pretending to know intent.
7. Produces a concise, visual, shareable report.
8. Lets the user ask questions about the conversation.

### Positioning

Do **not** position DecodeUs as:

> “AI that tells you whether your partner is toxic.”

Position it as:

> **“AI that helps you understand your relationship through your conversations.”**

The core philosophy:

> **Analyze patterns, not people.**

---

# 2. Product Principles

### 2.1 Evidence over assumptions

Never make a serious claim without supporting evidence.

Bad:

> “They don't care about you.”

Better:

> “They initiated 23% of conversations in the analyzed period. This pattern may indicate lower conversational initiative, but it does not establish how much they care.”

### 2.2 Analyze both people

DecodeUs must not become a confirmation-bias machine that only searches for flaws in the other person.

It should analyze:

- User's patterns
- Other person's patterns
- Shared patterns
- Positive behavior
- Negative behavior
- Imbalances
- Repeated cycles

### 2.3 Uncertainty is a feature

Every important finding should have a confidence level:

- High
- Moderate
- Low
- Insufficient evidence

DecodeUs should be comfortable saying:

> “There isn't enough evidence to determine this.”

### 2.4 No psychological diagnosis

Do not diagnose:

- Narcissism
- Personality disorders
- Mental illnesses
- Abuse as a definitive clinical/legal conclusion
- Hidden intentions

Use behavioral language:

> “Repeated guilt-based communication detected.”

> “Potential boundary-pressure pattern.”

> “Repeated conflict deflection.”

### 2.5 Facts first, interpretation second

The system should separate:

**Observed data → detected pattern → possible interpretation → recommendation**

---

# 3. Target Users

Primary:

- People analyzing romantic relationships
- Dating situations
- Ex-partners
- People unsure about communication dynamics

Secondary:

- Friendships
- Family relationships
- Roommates
- Workplace communication

The initial MVP should focus on **romantic relationships** because the use case is immediately understandable.

---

# 4. Core User Flow

```text
Landing Page
    ↓
Choose Relationship Type
    ↓
Optional: "What are you worried about?"
    ↓
Upload WhatsApp Export
    ↓
Parse Locally
    ↓
Calculate Statistics
    ↓
Semantic / Pattern Analysis
    ↓
Generate Findings
    ↓
Relationship Wrapped
    ↓
Deep Analysis
    ↓
Ask Your Chat
```

---

# 5. WhatsApp Input

## Initial MVP

Support the normal WhatsApp exported `.txt` conversation format.

Typical flow:

```text
WhatsApp
→ Open chat
→ Export Chat
→ Without Media
→ Upload .txt to MixSignal
```

Make this flow extremely obvious inside the product.

### Important

Do not make users manually clean or reformat the chat.

The parser should handle:

- Different WhatsApp date formats
- 12-hour / 24-hour times
- Single-digit / double-digit dates
- System messages
- Media omitted messages
- Multiline messages
- Emojis
- Unicode
- Names containing spaces
- Changed phone/device formats where possible

---

# 6. What MixSignal Should Analyze

## 6.1 Basic Communication Metrics

Calculate locally whenever possible:

- Total messages
- Messages per participant
- Percentage of conversations initiated by each person
- Average message length
- Median message length
- Average response time
- Median response time
- Longest conversation
- Longest silence
- Messages per day/week/month
- Active hours
- Active days
- Double-text frequency
- Questions asked
- Follow-up rate
- Conversation ending patterns

---

## 6.2 Effort Balance

Estimate communication effort using multiple signals rather than one metric.

Possible signals:

- Conversation initiation
- Questions
- Follow-ups
- Planning
- Check-ins
- Reconciliation attempts
- Emotional support
- Conversation continuation
- Responses to important disclosures

Output example:

```text
Communication Effort

You      64%
Them     36%

Note:
This is a communication-effort estimate, not a measurement of love or care.
```

---

## 6.3 Emotional Reciprocity

Analyze:

- Emotional disclosure
- Emotional response
- Support
- Affection
- Appreciation
- Validation
- Dismissal
- Hostility
- Contempt-like language
- Emotional availability

Example:

> You disclosed emotional concerns 18 times. In 14 cases, the other person responded with supportive or validating language.

---

## 6.4 Conflict Analysis

Detect:

- Arguments
- Conflict frequency
- Conflict escalation
- Defensiveness
- Topic switching
- Blame shifting
- Insults
- Threatening language
- Repeated unresolved issues
- Apologies
- Repair attempts
- Resolution

Do not classify a single sentence in isolation when the surrounding conversation changes its meaning.

---

## 6.5 Boundary Signals

Look for repeated patterns such as:

- Pressure after a refusal
- Possessive language
- Controlling requests
- Repeated unwanted demands
- Monitoring-oriented language
- Jealousy-related patterns
- Boundary disrespect

Important:

> A detected pattern is not automatically proof of malicious intent.

---

## 6.6 Positive Signals

MixSignal must actively look for healthy signals:

- Mutual support
- Genuine curiosity
- Emotional responsiveness
- Appreciation
- Accountability
- Apologies
- Repair attempts
- Encouragement
- Shared humor
- Consistent effort
- Respect for boundaries

This prevents the product from becoming an endless red-flag generator.

---

# 7. Relationship Fingerprint

Instead of one fake-precise “relationship score,” use multiple dimensions.

Example:

| Dimension | Result |
|---|---|
| Communication | 🟢 Healthy |
| Emotional reciprocity | 🟡 Mixed |
| Conflict handling | 🔴 Concerning |
| Effort balance | 🟡 Uneven |
| Affection | 🟢 Strong |
| Consistency | 🟡 Mixed |
| Boundaries | 🟢 Healthy |

Then summarize the overall pattern:

> **Primary relationship pattern: Strong affection + weak conflict resolution**

Avoid a single numeric score unless it is clearly presented as a playful summary rather than an objective scientific measurement.

---

# 8. Red Flags, Green Flags, and Mixed Signals

## Red Flags

Potential concerns such as:

- Repeated guilt-based communication
- Repeated blame shifting
- Persistent hostility
- Boundary pressure
- Contempt or insults
- Strong controlling language
- Repeated unresolved conflict cycles
- One-sided repair attempts

## Green Flags

Examples:

- Genuine emotional support
- Accountability
- Mutual effort
- Healthy repair attempts
- Respect for boundaries
- Consistency
- Curiosity about the other person's feelings

## Mixed Signals

Examples:

> High affection + poor conflict management

> Strong emotional support + large effort imbalance

> Frequent communication + repeated hostility during arguments

Mixed signals are important because real relationships are rarely all-good or all-bad.

---

# 9. Pattern Replay

This should be one of MixSignal's flagship features.

Instead of analyzing messages independently, identify recurring sequences.

Example:

```text
Concern raised
      ↓
Defensiveness
      ↓
Blame shift
      ↓
Argument
      ↓
Apology
      ↓
Temporary resolution
      ↓
Same issue returns
```

Then:

> **This pattern appeared 8 times.**

Show the individual instances and dates.

This is significantly more useful than simply labeling individual messages.

---

# 10. Relationship Timeline

Analyze how communication changes over time.

Example:

```text
January   🟢
February  🟢
March     🟢
April     🟡
May       🔴
June      🟡
July      🟢
```

Possible change signals:

- Message frequency
- Initiation
- Response times
- Affection
- Conflict
- Emotional reciprocity
- Support
- Effort

Example insight:

> Communication changed significantly around May. Initiation decreased while conflict frequency increased.

Never interpret a change as proof of a specific cause without evidence.

---

# 11. Reality Check

This should be a signature MixSignal feature.

The user provides a concern:

> “I think they're losing interest.”

MixSignal compares the concern against the conversation.

Example:

### Your assumption

> “They are losing interest.”

### Observed signals

- Messaging frequency ↓ 27%
- Initiation ↓ 34%
- Affectionate language → stable
- Emotional support → stable
- Response time ↑ moderately

### Reality Check

> Your concern has some supporting evidence, but the conversation does not strongly establish that they have lost interest.

The app should be willing to **disagree with the user**.

---

# 12. Evidence Mode

Every major finding should support:

> **Why do you think this?**

Show:

- Relevant conversation excerpts
- Number of detected instances
- Relevant statistics
- Time range
- Confidence
- Caveats

Example:

### Potential guilt-based communication

**Confidence:** Moderate  
**Detected:** 7 times  
**Period:** March–July

> View supporting conversations

This dramatically improves trust.

---

# 13. Ask Your Chat

After analysis, the user can ask natural-language questions.

Examples:

- Who usually starts conversations?
- Who apologizes first?
- Do we actually resolve arguments?
- When did the communication change?
- Who seems to put in more conversational effort?
- What do we argue about most?
- Are my concerns supported by the chat?
- What patterns do I keep repeating?
- What patterns does the other person keep repeating?

Answers must be grounded in the uploaded conversation and computed metrics.

The system should explicitly say when the evidence is insufficient.

---

# 14. "You Might Be Missing"

A valuable section that challenges the user's initial interpretation.

Example:

> You're focusing heavily on response time, but the stronger signal in the conversation is how the two of you handle disagreement.

This makes the product feel analytical rather than validating.

---

# 15. "You Might Be the Problem Too"

MixSignal should analyze the user's behavior honestly.

Example:

### Your patterns

- You initiate 68% of conversations.
- You initiate 74% of serious discussions.
- You apologize first 61% of the time.
- You sometimes continue conflicts after an apparent repair attempt.

### Their patterns

- They initiate 32%.
- They are more consistent at post-conflict follow-up.
- They provide strong emotional support.
- They frequently become defensive during criticism.

The goal is:

> **Understand the relationship, not prove that one person is guilty.**

---

# 16. Spotify Wrapped Model

This is the main growth / shareability strategy.

The first layer should be fun and surprising.

Example:

# Your Relationship Wrapped

**24,821 messages analyzed**

- Most active day: Sunday
- Most active hour: 11 PM
- Most common emoji: 😂
- Longest conversation: 6h 42m
- You initiated: 67%
- Them: 33%
- Most common phrase: "okay"
- Most common argument time: 11:38 PM

Then move into meaningful analysis:

### Your relationship fingerprint

> Affectionate + inconsistent conflict resolution

### Biggest green flag

> Strong emotional support during stressful periods.

### Biggest concern

> The same conflict pattern appeared 8 times.

The result should feel screenshot-able and shareable.

---

# 17. Shareable Report

Create a privacy-safe share card.

Include:

- No private message content by default
- No names unless explicitly chosen
- High-level statistics
- Relationship fingerprint
- Fun metrics
- Red / green / mixed signal counts

Example:

```text
MIXSIGNAL

Your Relationship Wrapped

21,482 messages
67% conversations initiated by you
Most active time: 11 PM

🟢 11 healthy patterns
🟡 6 mixed signals
🔴 4 recurring concerns

Relationship fingerprint:
Affectionate + conflict-avoidant
```

---

# 18. Privacy Architecture

Privacy is one of the most important product constraints.

### Preferred approach

Process as much as possible on-device / in-browser.

```text
User chat
   ↓
Local parsing
   ↓
Local statistics
   ↓
Local preprocessing
   ↓
Only necessary analysis context → AI
```

Avoid uploading the complete raw conversation by default.

### Privacy requirements

- Clear data-retention policy
- Delete analysis option
- Delete raw chat option
- No sale of chat data
- Explain AI processing
- Explain third-party model processing
- No unnecessary analytics on message contents
- No raw chat in logs
- Avoid storing raw conversation unless essential

Future goal:

> Full on-device analysis using local models where practical.

---

# 19. Technical Architecture

## Recommended MVP Stack

### Frontend

**Next.js + React + TypeScript**

Why:

- Fast development
- Strong ecosystem
- Excellent web UX
- Easy deployment
- Good fit for local browser processing

### Styling / UI

**Tailwind CSS**

Optional component system:

- shadcn/ui

### Backend

**Python + FastAPI**

Why:

- Excellent text-processing ecosystem
- Easy data-analysis workflows
- Strong LLM integration
- Good fit for parsing and NLP

### Data / Auth

**Supabase**

Use for:

- Authentication
- Postgres
- User profiles
- Analysis metadata
- Optional saved report metadata

Do NOT automatically store raw WhatsApp chats in the database.

### AI

Start with a Gemini Flash model suitable for fast structured analysis.

Use the LLM for:

- Semantic classification
- Contextual pattern interpretation
- Conflict analysis
- Recommendations
- Natural-language Q&A

Do not use the LLM for basic arithmetic or statistics that can be computed deterministically.

### Deployment

Possible:

- Vercel → frontend
- Railway / Render / Fly.io → Python backend
- Supabase → database/auth

The exact deployment provider can change later.

---

# 20. Parsing Strategy

For WhatsApp `.txt` files, Python is a good choice if parsing occurs on the backend.

Useful Python libraries / tools:

- `re` for parsing formats
- `datetime` for timestamps
- `pandas` for analysis
- `numpy` for numerical calculations
- `pydantic` for structured models
- FastAPI for API endpoints

However, for privacy, prefer:

### Phase 1

Browser parser where practical.

### Phase 2

Python backend parser for supported fallback cases.

### Phase 3

More complete local/browser-based analysis.

Important:

> The WhatsApp export is normally a text file, not a PDF.

Do not build a PDF parser as the primary ingestion method unless a future feature specifically requires PDFs.

If MixSignal later accepts PDF conversation exports, use a proper PDF text-extraction library and then normalize the result into the same internal message schema.

---

# 21. Canonical Message Schema

Normalize every message into a structure similar to:

```json
{
  "id": "msg_001",
  "timestamp": "2026-09-14T11:42:00",
  "sender": "person_a",
  "text": "Are you okay?",
  "message_type": "text"
}
```

Then derive:

```json
{
  "conversation_id": "conv_001",
  "sender_a": "Person A",
  "sender_b": "Person B",
  "message_count": 18432,
  "date_start": "2026-01-01",
  "date_end": "2026-09-01"
}
```

This makes the analysis engine independent of WhatsApp's original text format.

---

# 22. AI Analysis Architecture

Do not send the raw conversation in one giant prompt.

Use a layered pipeline:

```text
WhatsApp Export
      ↓
Parser
      ↓
Normalized Messages
      ↓
Deterministic Metrics
      ↓
Conversation Segmentation
      ↓
Relevant Excerpts
      ↓
LLM Analysis
      ↓
Structured JSON Findings
      ↓
Pattern Engine / Validation
      ↓
Final Report
```

### Deterministic layer

Calculate:

- Counts
- Ratios
- Timing
- Message lengths
- Initiation
- Response times
- Frequencies
- Trends

### AI layer

Interpret:

- Emotional meaning
- Conflict dynamics
- Recurring patterns
- Possible manipulation/boundary concerns
- Context
- Recommendations
- User questions

This keeps the system cheaper, faster, and easier to validate.

---

# 23. Suggested LLM Output Schema

Use structured JSON rather than free-form output.

Example:

```json
{
  "finding": {
    "title": "Repeated conflict deflection",
    "category": "conflict",
    "severity": "moderate",
    "confidence": 0.81,
    "occurrences": 7,
    "description": "The original concern is repeatedly redirected toward blame about the other person's behavior.",
    "possible_explanations": [
      "Defensiveness",
      "Poor conflict skills",
      "Difficulty accepting criticism"
    ],
    "evidence_ids": ["msg_1321", "msg_1831"],
    "recommendation": "Address the pattern directly and evaluate whether future conflicts are resolved rather than redirected."
  }
}
```

The frontend can render this consistently.

---

# 24. Gemini Usage Strategy

Gemini is sufficient for an MVP if the system is designed efficiently.

Use Gemini for semantic work, not everything.

### Good Gemini tasks

- Analyze selected message windows
- Classify conflict patterns
- Detect emotional responses
- Interpret recurring dynamics
- Explain findings
- Generate concise recommendations
- Answer user questions using provided evidence

### Do locally / deterministically

- Message counts
- Ratios
- Response times
- Message length
- Frequency
- Timeline calculations
- Simple lexical statistics

### Important security rule

Never expose a production Gemini API key directly in client-side JavaScript.

Use a secure server-side proxy/backend or an architecture that keeps credentials protected.

### Privacy note

Before production, verify the current provider's terms, retention, and data-use policy for the exact API/service tier you use. Do not assume a free development tier has the same data protections as a paid production configuration.

---

# 25. MVP Scope

Do not build everything at once.

## V1

### Input
- WhatsApp `.txt` upload
- Relationship type
- Optional user concern

### Analysis
- Message statistics
- Initiation balance
- Response patterns
- Emotional reciprocity
- Positive/negative signals
- Conflict patterns
- Basic red/green/mixed signals

### Output
- Relationship Wrapped
- Relationship fingerprint
- Evidence-backed findings
- Reality Check
- Recommendations

### Interaction
- Ask Your Chat

### Privacy
- Local parsing where possible
- Minimal retention
- Clear deletion

---

# 26. V1.5

Add:

- Relationship timeline
- Pattern Replay
- "You Might Be Missing"
- "You Might Be the Problem Too"
- More robust evidence viewer
- Shareable result cards
- Better conversation segmentation

---

# 27. V2

Potential additions:

- Re-analysis with a newer chat export
- Before/after comparisons
- Long-term relationship trends
- Friend / family modes
- Couples mode
- Local model option
- Fully on-device semantic analysis
- Additional chat platforms if legally/technically practical

---

# 28. Product Risks

## Risk 1: False certainty

Solution:

- Evidence
- Confidence
- Caveats
- No diagnosis
- "Insufficient evidence" outcome

## Risk 2: Confirmation bias

Solution:

- Analyze both participants
- Include positive evidence
- Include counter-signals
- Reality Check

## Risk 3: Privacy concerns

Solution:

- Local processing
- Minimal storage
- Clear deletion
- Transparent AI processing

## Risk 4: People don't want to upload chats

Solution:

- Make privacy a primary value proposition
- Explain processing clearly
- Move more analysis on-device

## Risk 5: Novelty wears off

Solution:

- Wrapped statistics
- Ask Your Chat
- Timeline
- Pattern Replay
- Periodic re-analysis

---

# 29. Design Direction

The UI should feel:

- Clean
- Modern
- Slightly playful
- Data-driven
- Emotionally intelligent

Avoid:

- Generic chatbot UI
- Huge walls of text
- Overly clinical therapy visuals
- Dark "toxic relationship" aesthetic
- Excessive red warnings

Use:

- Cards
- Charts
- Timelines
- Small data visualizations
- Progressive disclosure
- Evidence drawers
- Strong typography
- Clear severity labels

---

# 30. Brand Tone

MixSignal should sound:

- Direct
- Observant
- Slightly witty
- Non-judgmental
- Honest about uncertainty

Example:

> "You two aren't necessarily incompatible. You are, however, remarkably bad at resolving the same argument."

Another:

> "Your response-time anxiety is stronger than the evidence suggests."

The humor should be used in presentation, not in serious safety-critical conclusions.

---

# 31. Brand / Name

## Product name

**MixSignal**

The name fits:

- Mixed signals
- Relationship signals
- Communication signals
- Red / green / yellow signal system

Possible tagline:

> **Read the signals. Understand the relationship.**

Alternative tagline:

> **What does your chat actually say about you two?**

---

# 32. What Makes MixSignal Different

The competitive advantage should not be:

> "We use AI."

Almost everyone can claim that.

The differentiators should be:

1. **Evidence-backed analysis**
2. **Both-person analysis**
3. **Pattern Replay**
4. **Reality Check**
5. **Spotify Wrapped-style presentation**
6. **Privacy-first processing**
7. **Conversation-grounded Q&A**

---

# 33. The Core Product Loop

```text
Upload
  ↓
Instant surprising statistics
  ↓
"That's interesting."
  ↓
Relationship insights
  ↓
"Wait, it noticed that?"
  ↓
Evidence
  ↓
Pattern Replay
  ↓
Ask Your Chat
  ↓
Share Relationship Wrapped
```

This is the ideal user experience.

---

# 34. North Star

The product should not answer:

> **"Is my partner a red flag?"**

It should answer:

> **"What patterns actually exist in this relationship, and what should I pay attention to?"**

That distinction is the foundation of MixSignal.

---

# 35. Build Order

Recommended implementation sequence:

### Step 1
WhatsApp parser

### Step 2
Canonical message schema

### Step 3
Local statistics engine

### Step 4
Conversation segmentation

### Step 5
LLM structured analysis

### Step 6
Finding + evidence system

### Step 7
Relationship Wrapped UI

### Step 8
Reality Check

### Step 9
Pattern Replay

### Step 10
Ask Your Chat

### Step 11
Privacy hardening

### Step 12
Shareable cards

---

# 36. Final Product Definition

**MixSignal** is a privacy-first relationship intelligence product that analyzes exported WhatsApp conversations to identify communication patterns, emotional reciprocity, effort balance, conflict cycles, red flags, green flags, and changes over time.

It combines:

> **Spotify Wrapped-style discovery + behavioral analytics + LLM interpretation + evidence + privacy-first processing.**

The product should be fun enough to share, useful enough to revisit, and honest enough to tell the user when the evidence does not support their assumptions.
