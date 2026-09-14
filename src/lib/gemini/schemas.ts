/**
 * Gemini structured responseSchema — strict JSON enforcement.
 * Mirrors api-spec.md §2 exactly. Per task 05.2.
 */
import { Type, type Schema } from "@google/genai";

const confidenceEnum = ["HIGH", "MODERATE", "LOW", "INSUFFICIENT_EVIDENCE"];

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
        summary: { type: Type.STRING, description: "Objective, 2-3 sentence overview of the dynamic" },
      },
      required: [
        "communication",
        "emotionalReciprocity",
        "conflictHandling",
        "effortBalance",
        "affection",
        "consistency",
        "boundaries",
        "summary",
      ],
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
            enum: ["COMMUNICATION", "CONFLICT", "RECIPROCITY", "EFFORT", "BOUNDARIES", "AFFECTION"],
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          confidence: { type: Type.STRING, enum: confidenceEnum },
          occurrences: { type: Type.INTEGER },
          evidenceExcerptIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "IDs matching excerpts in the request payload",
          },
          recommendation: { type: Type.STRING },
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
          "recommendation",
        ],
      },
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
            description: "Step-by-step loop progression",
          },
          occurrencesCount: { type: Type.INTEGER },
          typicalResolution: { type: Type.STRING },
        },
        required: ["id", "name", "sequence", "occurrencesCount", "typicalResolution"],
      },
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
            enum: ["SUPPORTED_BY_DATA", "PARTIALLY_SUPPORTED", "DEBUNKED_BY_DATA"],
          },
          explanation: { type: Type.STRING },
        },
        required: ["userAssumption", "observedData", "verdict", "explanation"],
      },
    },
    wrappedHighlights: {
      type: Type.OBJECT,
      description: "Data highlights for the 6-slide Relationship Wrapped presentation",
      properties: {
        topGreenFlag: { type: Type.STRING },
        topMixedSignal: { type: Type.STRING },
        relationshipVibeTitle: { type: Type.STRING, description: "E.g. 'The Thoughtful Sprints'" },
        communicationTakeaway: { type: Type.STRING },
      },
      required: ["topGreenFlag", "topMixedSignal", "relationshipVibeTitle", "communicationTakeaway"],
    },
  },
  required: ["fingerprint", "signals", "patternLoops", "realityChecks", "wrappedHighlights"],
};
