# DecodeUs — Privacy, Security & Ethical AI Governance

> **Document Version**: 1.0.0  
> **Status**: Approved Master Specification  
> **Guiding Principle**: *"Zero-Knowledge Ingestion. Evidence-Backed Reasoning. Zero Diagnostic Stigma."*

---

## 1. The Privacy Imperative

Personal chat conversations are among the most intimate, sensitive records of human life. They contain financial disclosures, private emotional vulnerabilities, home addresses, phone numbers, family secrets, and relational conflicts.

A breach or misuse of this data can inflict devastating emotional, social, and reputational harm. Consequently, **DecodeUs treats privacy not as a compliance checkbox, but as a foundational architectural boundary.**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FOUR PILLARS OF PRIVACY                           │
├───────────────────┬───────────────────┬─────────────────────────────────────┤
│ 01. LOCAL-FIRST   │ 02. ZERO STORAGE  │ 03. CLIENT REDACTION                │
│ 100% of raw chat  │ Raw chat text is  │ PII and names are stripped BEFORE   │
│ parsing & metrics │ never saved to a  │ any excerpt reaches an LLM endpoint │
│ stay in browser   │ database or disk  │                                     │
├───────────────────┴───────────────────┴─────────────────────────────────────┤
│ 04. ETHICAL AI SAFEGUARDS                                                   │
│ Strict prohibition on armchair clinical psychiatric diagnoses               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Client-Side Anonymization & PII Redaction Pipeline

Before any contextual excerpts are assembled and transmitted to the server proxy for semantic analysis, they must pass through an aggressive, client-side redaction engine running in `anonymizer.ts`.

### 2.1 Anonymization Order of Operations
```
Raw Excerpt Window (e.g. 20 messages)
                   │
                   ▼
     ┌────────────────────────────┐
     │ 1. Telephone Numbers       │  Regex: International E.164 + local patterns
     └─────────────┬──────────────┘  Replace with: [PHONE_REDACTED]
                   │
                   ▼
     ┌────────────────────────────┐
     │ 2. Email Addresses         │  Regex: RFC 5322 compliant email filter
     └─────────────┬──────────────┘  Replace with: [EMAIL_REDACTED]
                   │
                   ▼
     ┌────────────────────────────┐
     │ 3. Physical Addresses      │  Regex: Street/Zip/Postal code heuristics
     └─────────────┬──────────────┘  Replace with: [ADDRESS_REDACTED]
                   │
                   ▼
     ┌────────────────────────────┐
     │ 4. Financial & Card Data   │  Regex: Luhn-valid 13-16 digit strings
     └─────────────┬──────────────┘  Replace with: [FINANCIAL_REDACTED]
                   │
                   ▼
     ┌────────────────────────────┐
     │ 5. Participant Pseudonym   │  Map: Maya Lin ──> "Person A"
     │    Mapping                 │  Map: Alex Rivera ──> "Person B"
     └─────────────┬──────────────┘
                   │
                   ▼
Sanitized Ingestion Payload Transmitted to /api/analyze
```

### 2.2 Redaction Implementation Rules
```typescript
export interface RedactionResult {
  sanitizedText: string;
  redactedCount: number;
}

export function redactPII(text: string, personAName: string, personBName: string): RedactionResult {
  let redactedCount = 0;

  // 1. Phone numbers (international and regional formats)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  let sanitized = text.replace(phoneRegex, () => {
    redactedCount++;
    return "[PHONE_REDACTED]";
  });

  // 2. Email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  sanitized = sanitized.replace(emailRegex, () => {
    redactedCount++;
    return "[EMAIL_REDACTED]";
  });

  // 3. URLs containing query parameters / tokens
  const urlRegex = /https?:\/\/[^\s]+/g;
  sanitized = sanitized.replace(urlRegex, (url) => {
    try {
      const parsed = new URL(url);
      return `[LINK: ${parsed.hostname}]`;
    } catch {
      return "[LINK_REDACTED]";
    }
  });

  // 4. Participant Name Pseudonymization (case-insensitive)
  if (personAName && personAName.trim().length > 1) {
    const escA = personAName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    sanitized = sanitized.replace(new RegExp(`\\b${escA}\\b`, "gi"), "Person A");
  }

  if (personBName && personBName.trim().length > 1) {
    const escB = personBName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    sanitized = sanitized.replace(new RegExp(`\\b${escB}\\b`, "gi"), "Person B");
  }

  return { sanitizedText: sanitized, redactedCount };
}
```

---

## 3. Zero Persistent Storage Guarantee

| Data Asset | Storage Medium | Lifecycle / Retention |
| :--- | :--- | :--- |
| **Raw `.txt` Chat File** | Browser Memory (Blob / RAM) | Discarded immediately after Web Worker normalization. Never written to disk. |
| **Canonical Message Array** | In-Memory Web Worker State | Kept only for the duration of the browser session. Destroyed on page refresh/close. |
| **Server Route Payload** | Server RAM Buffer | Exists solely during HTTP request execution (~4s). Zero database writes. Zero disk writes. |
| **Server Log Files** | Log Streams (Vercel / Cloud) | Chat payloads are strictly excluded from logging. Only metadata (e.g. `status: 200`, `duration: 3420ms`) is logged. |
| **Generated Intelligence Dossier** | React Component State | Stored in browser memory. Discarded when session terminates unless exported as PNG by user. |

---

## 4. Secure API Proxy & Credentials Architecture

```
┌───────────────────────────────┐
│ Browser (Client Bundle)       │
│ - Zero API keys exposed       │
│ - Only calls /api/analyze     │
└───────────────┬───────────────┘
                │ HTTPS (Strict Transport Security)
                ▼
┌───────────────────────────────┐
│ Next.js API Route (/api)      │
│ - Loads process.env.GEMINI_KEY│
│ - Rate Limiting (Token Bucket)│
│ - Payload size limit (< 4MB)  │
│ - Origin verification & CORS  │
└───────────────┬───────────────┘
                │ TLS 1.3
                ▼
┌───────────────────────────────┐
│ Google Gemini API Endpoint    │
│ - Paid / Enterprise tier      │
│ - Zero model training policy  │
└───────────────────────────────┘
```

### Security Measures:
1. **Zero Client-Side Secrets**: `GEMINI_API_KEY` is strictly managed as a private server-side environment variable. It is never prefixed with `NEXT_PUBLIC_` and never included in JavaScript client bundles.
2. **Rate Limiting**: To prevent abuse and denial-of-service, `/api/analyze` enforces an in-memory sliding-window rate limit:
   - Max 5 analysis runs per IP address per hour.
   - Max 20 "Ask Your Chat" queries per session.
3. **Payload Sanitization**: Server-side request bodies are validated using a strict **Zod** schema. Oversized payloads (> 4MB) or malformed structures are rejected with HTTP 400.

---

## 5. Model Provider Compliance (Google Gemini)

DecodeUs utilizes **Gemini 2.5 Flash** under Google's commercial API terms:

- **Data Privacy Terms**: Under Google Cloud and Google AI Studio commercial terms for paid API usage, customer prompts and outputs are **not used to train or fine-tune Google models**.
- **Data at Rest & Transit**: Data transmitted between our server proxy and Google's API is encrypted using TLS 1.3. Google does not persistently store customer API prompts beyond short-term operational debugging.
- **Enterprise Verification**: Before any enterprise or commercial launch, the production Google Cloud project must have data retention logging disabled.

---

## 6. Ethical AI & Non-Diagnostic Guardrails

### 6.1 Strict Prohibition on Psychiatric Diagnosis
DecodeUs is a **communication analytics tool**, not a licensed medical professional, therapist, or diagnostic instrument.

> [!WARNING]
> **PROHIBITED TERMS**:  
> The system must NEVER output diagnostic psychiatric labels, including but not limited to:  
> *"narcissist", "sociopath", "psychopath", "borderline", "bipolar", "toxic", "gaslighter", "abusive" (as an absolute verdict).*

### 6.2 Behavioral Framing Matrix
Findings must always describe **observable actions and communication dynamics**, rather than internal moral character:

| Reject (Diagnostic / Accusatory) | Require (Behavioral / Pattern-Focused) |
| :--- | :--- |
| ❌ "Your partner is a covert narcissist." | ✅ "Repeated pattern of redirecting conflict back toward the other person's shortcomings." |
| ❌ "They are deliberately gaslighting you." | ✅ "Discrepancy detected between previously stated agreements and subsequent denials." |
| ❌ "They don't care about you at all." | ✅ "Initiation dropped by 44% in the last 60 days, while message length decreased." |
| ❌ "You are an insecure attachment double-texter." | ✅ "High frequency of follow-up messages sent before receiving a response." |

---

### 6.3 Symmetric Two-Way Accountability
To avoid becoming a "confirmation bias weapon" used in relationship arguments:
- The system must analyze both participants symmetrically.
- The system highlights positive communication behaviors alongside areas of friction.
- The system includes a self-reflection dimension (*"Your patterns"* alongside *"Their patterns"*).

---

### 6.4 Crisis Detection & Safe Off-Ramp

If the parsing or analysis engine identifies recurring keywords or statements indicating **domestic violence, physical threats, severe coercive control, or self-harm**, DecodeUs must not display game-like Wrapped slides.

Instead, the UI displays a solemn, supportive **Resource & Safety Support Card**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SAFETY & SUPPORT NOTICE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ DecodeUs has detected communication patterns that may involve emotional,    │
│ verbal, or physical coercion. Your safety and well-being are paramount.     │
│                                                                             │
│ If you or someone you know is feeling unsafe, support is available 24/7:   │
│                                                                             │
│ • National Domestic Violence Hotline (US): 1-800-799-SAFE (7233)            │
│   or text "START" to 88788 (thehotline.org)                                 │
│ • Crisis Text Line: Text "HOME" to 741741                                   │
│ • International Helplines: findahelpline.com                                │
│                                                                             │
│ [ Download Local Safe Copy ]               [ Clear All Chat Data Now ]      │
└─────────────────────────────────────────────────────────────────────────────┘
```
