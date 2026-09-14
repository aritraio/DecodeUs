/**
 * Zod validation schemas for /api/analyze + /api/chat request bodies
 * and the canonical IntelligenceReport response.
 */
import { z } from "zod";

const dialogueLineSchema = z.object({
  sender: z.enum(["Person A", "Person B"]),
  timestamp: z.string(),
  text: z.string(),
});

const contextExcerptSchema = z.object({
  id: z.string(),
  triggerReason: z.enum([
    "conflict_lexicon",
    "long_delay",
    "double_text",
    "emotional_disclosure",
    "sample",
  ]),
  startDate: z.string(),
  endDate: z.string(),
  dialogue: z.array(dialogueLineSchema).min(1),
});

const metricsSchema = z.object({
  volume: z.object({
    totalMessages: z.number(),
    personA: z.object({ count: z.number(), percentage: z.number() }),
    personB: z.object({ count: z.number(), percentage: z.number() }),
    averagePerDay: z.number(),
  }),
  initiation: z.object({
    thresholdHours: z.number(),
    totalSessions: z.number(),
    personA: z.object({ count: z.number(), percentage: z.number() }),
    personB: z.object({ count: z.number(), percentage: z.number() }),
  }),
  responseSpeed: z.object({
    personA: z.object({
      averageSeconds: z.number(),
      medianSeconds: z.number(),
      longestSilenceHours: z.number(),
    }),
    personB: z.object({
      averageSeconds: z.number(),
      medianSeconds: z.number(),
      longestSilenceHours: z.number(),
    }),
  }),
  temporal: z.object({
    hourlyDistribution: z.array(z.number()).length(24),
    dayOfWeekDistribution: z.array(z.number()).length(7),
    peakHour: z.number().min(0).max(23),
    busiestDay: z.string(),
  }),
  lexical: z.object({
    personA: z.object({
      avgWordCount: z.number(),
      doubleTextCount: z.number(),
      questionsAsked: z.number(),
      topEmojis: z.array(z.object({ emoji: z.string(), count: z.number() })),
    }),
    personB: z.object({
      avgWordCount: z.number(),
      doubleTextCount: z.number(),
      questionsAsked: z.number(),
      topEmojis: z.array(z.object({ emoji: z.string(), count: z.number() })),
    }),
  }),
});

export const analyzeRequestSchema = z.object({
  relationshipType: z.string().min(1).max(64),
  optionalConcern: z.string().max(2000).optional(),
  deterministicMetrics: metricsSchema,
  contextExcerpts: z.array(contextExcerptSchema).max(25),
});

export const chatRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  relevantExcerpts: z.array(contextExcerptSchema).max(10),
  conversationMetadata: z.object({
    totalDays: z.number().optional(),
    totalMessages: z.number().optional(),
  }).passthrough(),
});

const fingerprintSchema = z.object({
  communication: z.number().min(0).max(100),
  emotionalReciprocity: z.number().min(0).max(100),
  conflictHandling: z.number().min(0).max(100),
  effortBalance: z.number().min(0).max(100),
  affection: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100),
  boundaries: z.number().min(0).max(100),
  summary: z.string(),
});

const signalSchema = z.object({
  id: z.string(),
  type: z.enum(["GREEN", "RED", "AMBER"]),
  category: z.enum(["COMMUNICATION", "CONFLICT", "RECIPROCITY", "EFFORT", "BOUNDARIES", "AFFECTION"]),
  title: z.string(),
  description: z.string(),
  confidence: z.enum(["HIGH", "MODERATE", "LOW", "INSUFFICIENT_EVIDENCE"]),
  occurrences: z.number(),
  evidenceExcerptIds: z.array(z.string()),
  recommendation: z.string(),
});

export const intelligenceReportSchema = z.object({
  fingerprint: fingerprintSchema,
  signals: z.array(signalSchema),
  patternLoops: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sequence: z.array(z.string()),
      occurrencesCount: z.number(),
      typicalResolution: z.string(),
    })
  ),
  realityChecks: z.array(
    z.object({
      userAssumption: z.string(),
      observedData: z.string(),
      verdict: z.enum(["SUPPORTED_BY_DATA", "PARTIALLY_SUPPORTED", "DEBUNKED_BY_DATA"]),
      explanation: z.string(),
    })
  ),
  wrappedHighlights: z.object({
    topGreenFlag: z.string(),
    topMixedSignal: z.string(),
    relationshipVibeTitle: z.string(),
    communicationTakeaway: z.string(),
  }),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
