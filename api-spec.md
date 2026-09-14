# DecodeUs — API & Data Contracts Specification

> **Document Version**: 1.0.0  
> **Status**: Approved Master Specification  
> **Framework**: Next.js 15+ App Router, TypeScript 5+, Gemini 2.5 Flash (`@google/genai`)

---

## 1. Core Domain Models (TypeScript Interfaces)

These types define the canonical representations of messages, metrics, and report objects used across both client and server.

```typescript
/**
 * Normalized representation of a single conversation line
 */
export interface CanonicalMessage {
  id: string;                      // E.g., "msg_00001"
  timestamp: string;               // ISO 8601 UTC string: "2026-09-14T08:30:00.000Z"
  senderId: "person_a" | "person_b" | "system";
  originalSenderName: string;      // Scraped name from WhatsApp (redacted before LLM)
  text: string;                    // Cleaned message body
  messageType: "text" | "media_omitted" | "deleted" | "system";
  charCount: number;
  wordCount: number;
  hasQuestion: boolean;
  emojis: string[];
}

/**
 * High-level summary of the imported conversation
 */
export interface ConversationMetadata {
  conversationId: string;
  senderA: { id: "person_a"; displayName: string };
  senderB: { id: "person_b"; displayName: string };
  totalMessages: number;
  startDate: string;               // ISO 8601
  endDate: string;                 // ISO 8601
  totalDays: number;
}

/**
 * Deterministic mathematical metrics computed 100% in-browser
 */
export interface DeterministicMetrics {
  volume: {
    totalMessages: number;
    personA: { count: number; percentage: number };
    personB: { count: number; percentage: number };
    averagePerDay: number;
  };
  initiation: {
    thresholdHours: number;        // Default: 3 hours
    totalSessions: number;
    personA: { count: number; percentage: number };
    personB: { count: number; percentage: number };
  };
  responseSpeed: {
    personA: {
      averageSeconds: number;
      medianSeconds: number;
      longestSilenceHours: number;
    };
    personB: {
      averageSeconds: number;
      medianSeconds: number;
      longestSilenceHours: number;
    };
  };
  temporal: {
    hourlyDistribution: number[];  // Array of 24 values (0-23 hours)
    dayOfWeekDistribution: number[];// Array of 7 values (Sunday=0 to Saturday=6)
    peakHour: number;              // 0-23
    busiestDay: string;            // E.g., "Thursday"
  };
  lexical: {
    personA: {
      avgWordCount: number;
      doubleTextCount: number;
      questionsAsked: number;
      topEmojis: Array<{ emoji: string; count: number }>;
    };
    personB: {
      avgWordCount: number;
      doubleTextCount: number;
      questionsAsked: number;
      topEmojis: Array<{ emoji: string; count: number }>;
    };
  };
}

/**
 * Dialogue excerpt window used as evidence and LLM context
 */
export interface ContextExcerpt {
  id: string;                      // E.g., "exc_01"
  triggerReason: "conflict_lexicon" | "long_delay" | "double_text" | "emotional_disclosure" | "sample";
  startDate: string;
  endDate: string;
  dialogue: Array<{
    sender: "Person A" | "Person B";
    timestamp: string;
    text: string;
  }>;
}
```

---

## 2. Gemini Structured Output Schema (`responseSchema`)

The following schema is passed directly to `@google/genai` via the `responseSchema` configuration to guarantee deterministic JSON output without Markdown formatting wrappers.

```typescript
import { Type, Schema } from "@google/genai";

export const geminiReportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fingerprint: {
      type: Type.OBJECT,
      description: "7-pillar communication assessment matrix (0-100 scores)",
      properties: {
        communication: { type: Type.INTEGER, description: "Clarity, active listening, and openness" },
        emotionalReciprocity: { type: Type.INTEGER, description: "Bilateral validation and vulnerability matching" },
        conflictHandling: { type: Type.INTEGER, description: "De-escalation vs. defensiveness/stonewalling" },
        effortBalance: { type: Type.INTEGER, description: "Initiation, planning, and continuation balance" },
        affection: { type: Type.INTEGER, description: "Affectionate phrasing, affirmations, warmth" },
        consistency: { type: Type.INTEGER, description: "Predictability vs. sporadic hot/cold texting" },
        boundaries: { type: Type.INTEGER, description: "Respect for personal space and time" },
        summary: { type: Type.STRING, description: "Objective, 2-3 sentence overview of the dynamic" }
      },
      required: [
        "communication",
        "emotionalReciprocity",
        "conflictHandling",
        "effortBalance",
        "affection",
        "consistency",
        "boundaries",
        "summary"
      ]
    },
    signals: {
      type: Type.ARRAY,
      description: "Identified behavioral signals with evidence receipts",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["GREEN", "RED", "AMBER"] },
          category: { 
            type: Type.STRING, 
            enum: ["COMMUNICATION", "CONFLICT", "RECIPROCITY", "EFFORT", "BOUNDARIES", "AFFECTION"] 
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          confidence: { 
            type: Type.STRING, 
            enum: ["HIGH", "MODERATE", "LOW", "INSUFFICIENT_EVIDENCE"] 
          },
          occurrences: { type: Type.INTEGER },
          evidenceExcerptIds: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "IDs matching excerpts in the request payload" 
          },
          recommendation: { type: Type.STRING }
        },
        required: [
          "id",
          "type",
          "category",
          "title",
          "description",
          "confidence",
          "occurrences",
          "evidenceExcerptIds",
          "recommendation"
        ]
      }
    },
    patternLoops: {
      type: Type.ARRAY,
      description: "Recurring conversational feedback loops",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          sequence: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Step-by-step loop progression (e.g. ['Concern Raised', 'Deflection', 'Truce'])"
          },
          occurrencesCount: { type: Type.INTEGER },
          typicalResolution: { type: Type.STRING }
        },
        required: ["id", "name", "sequence", "occurrencesCount", "typicalResolution"]
      }
    },
    realityChecks: {
      type: Type.ARRAY,
      description: "Empirical reality testing comparing user perception against observed data",
      items: {
        type: Type.OBJECT,
        properties: {
          userAssumption: { type: Type.STRING },
          observedData: { type: Type.STRING },
          verdict: { 
            type: Type.STRING, 
            enum: ["SUPPORTED_BY_DATA", "PARTIALLY_SUPPORTED", "DEBUNKED_BY_DATA"] 
          },
          explanation: { type: Type.STRING }
        },
        required: ["userAssumption", "observedData", "verdict", "explanation"]
      }
    },
    wrappedHighlights: {
      type: Type.OBJECT,
      description: "Data highlights tailored for the 6-slide Relationship Wrapped presentation",
      properties: {
        topGreenFlag: { type: Type.STRING },
        topMixedSignal: { type: Type.STRING },
        relationshipVibeTitle: { type: Type.STRING, description: "E.g. 'The Thoughtful Sprints'" },
        communicationTakeaway: { type: Type.STRING }
      },
      required: ["topGreenFlag", "topMixedSignal", "relationshipVibeTitle", "communicationTakeaway"]
    }
  },
  required: ["fingerprint", "signals", "patternLoops", "realityChecks", "wrappedHighlights"]
};
```

---

## 3. Server Route Endpoints

### 3.1 Analysis Endpoint: `POST /api/analyze`

Executes the primary semantic intelligence synthesis over redacted excerpts and deterministic metrics.

- **URL**: `/api/analyze`
- **Method**: `POST`
- **Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```

#### Request Body
```json
{
  "relationshipType": "romantic",
  "optionalConcern": "I feel like they have become emotionally distant recently.",
  "deterministicMetrics": {
    "volume": {
      "totalMessages": 14280,
      "personA": { "count": 8200, "percentage": 0.574 },
      "personB": { "count": 6080, "percentage": 0.426 },
      "averagePerDay": 48.2
    },
    "initiation": {
      "thresholdHours": 3,
      "totalSessions": 412,
      "personA": { "count": 256, "percentage": 0.621 },
      "personB": { "count": 156, "percentage": 0.379 }
    },
    "responseSpeed": {
      "personA": { "averageSeconds": 380, "medianSeconds": 240, "longestSilenceHours": 18 },
      "personB": { "averageSeconds": 1420, "medianSeconds": 960, "longestSilenceHours": 46 }
    },
    "temporal": {
      "peakHour": 22,
      "busiestDay": "Thursday"
    },
    "lexical": {
      "personA": { "avgWordCount": 14.2, "doubleTextCount": 84, "questionsAsked": 312 },
      "personB": { "avgWordCount": 8.6, "doubleTextCount": 18, "questionsAsked": 140 }
    }
  },
  "contextExcerpts": [
    {
      "id": "exc_01",
      "triggerReason": "conflict_lexicon",
      "startDate": "2026-08-12T19:20:00Z",
      "endDate": "2026-08-12T20:15:00Z",
      "dialogue": [
        { "sender": "Person A", "timestamp": "2026-08-12T19:20:00Z", "text": "Are you upset with me? You've barely answered all day." },
        { "sender": "Person B", "timestamp": "2026-08-12T20:10:00Z", "text": "I was working. Not everything is about you." }
      ]
    }
  ]
}
```

#### Response (HTTP 200 OK)
Returns the validated JSON object conforming to `geminiReportSchema`.

#### HTTP Error Statuses
- `400 Bad Request`: Missing required fields, invalid JSON schema, or payload > 4MB.
- `429 Too Many Requests`: IP rate limit exceeded (> 5 requests per hour).
- `500 Internal Server Error`: Gemini API timeout or unrecoverable inference error.

---

### 3.2 Chat Terminal Endpoint: `POST /api/chat`

Executes grounded natural language Q&A about the conversation history.

- **URL**: `/api/chat`
- **Method**: `POST`
- **Headers**:
  ```http
  Content-Type: application/json
  Accept: text/event-stream, application/json
  ```

#### Request Body
```json
{
  "query": "Who usually apologizes first after an argument?",
  "relevantExcerpts": [
    {
      "id": "exc_04",
      "dialogue": [
        { "sender": "Person A", "timestamp": "2026-07-14T22:00:00Z", "text": "I'm sorry for snapping earlier, work was really overwhelming." },
        { "sender": "Person B", "timestamp": "2026-07-14T22:04:00Z", "text": "Thanks, I appreciate you saying that." }
      ]
    }
  ],
  "conversationMetadata": {
    "totalDays": 240,
    "totalMessages": 14280
  }
}
```

#### Response (HTTP 200 OK)
```json
{
  "answer": "Based on the 6 conflict-and-resolution segments detected in your chat history, Person A initiated the apology in 5 instances (83%), typically within 2 hours of the disagreement. Person B acknowledged and validated the apologies promptly in 4 of those instances.",
  "confidence": "HIGH",
  "supportingExcerptIds": ["exc_04", "exc_09"]
}
```

---

## 4. Synthetic Mock Test Fixture

Engineers can test the frontend application without consuming live Gemini API quota by importing this deterministic fixture from `tests/fixtures/mock-report.json`:

```json
{
  "fingerprint": {
    "communication": 74,
    "emotionalReciprocity": 68,
    "conflictHandling": 61,
    "effortBalance": 58,
    "affection": 82,
    "consistency": 76,
    "boundaries": 85,
    "summary": "Communication is marked by high emotional warmth and consistent daily connection, balanced by healthy personal boundaries. When disagreements occur, there is a minor tendency to delay addressing tension before reaching an affectionate resolution."
  },
  "signals": [
    {
      "id": "sig_01",
      "type": "GREEN",
      "category": "AFFECTION",
      "title": "High Emotional Warmth & Affirmation",
      "description": "Consistent daily check-ins and frequent reciprocal validation during stressful periods.",
      "confidence": "HIGH",
      "occurrences": 142,
      "evidenceExcerptIds": ["exc_02", "exc_07"],
      "recommendation": "Continue nurturing proactive daily check-ins."
    },
    {
      "id": "sig_02",
      "type": "AMBER",
      "category": "EFFORT",
      "title": "Initiation Asymmetry",
      "description": "Person A initiates 62% of all conversations following 3+ hour silences.",
      "confidence": "HIGH",
      "occurrences": 256,
      "evidenceExcerptIds": ["exc_01"],
      "recommendation": "Experiment with allowing longer pauses before initiating to observe if Person B steps into the space."
    }
  ],
  "patternLoops": [
    {
      "id": "loop_01",
      "name": "Stress Venting to Delayed Affirmation",
      "sequence": [
        "Work stress disclosure",
        "Short delayed acknowledgment",
        "Follow-up evening phone call or long text",
        "Warm reconciliation"
      ],
      "occurrencesCount": 12,
      "typicalResolution": "Mutual reassurance by late evening."
    }
  ],
  "realityChecks": [
    {
      "userAssumption": "I feel like they've become emotionally distant recently.",
      "observedData": "Over the past 60 days, initiation by Person B dropped by 18%, but their average word count per message increased by 22% and affectionate emoji frequency remained unchanged.",
      "verdict": "PARTIALLY_SUPPORTED",
      "explanation": "While conversational initiative has dipped slightly, message depth and emotional indicators show sustained engagement rather than emotional detachment."
    }
  ],
  "wrappedHighlights": {
    "topGreenFlag": "Reciprocal Emotional Support During Stress",
    "topMixedSignal": "Initiation Imbalance (62% vs 38%)",
    "relationshipVibeTitle": "The Dedicated Navigators",
    "communicationTakeaway": "A strong foundation of affection paired with an opportunity to balance daily conversational initiative."
  }
}
```
