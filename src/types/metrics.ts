/**
 * Deterministic mathematical metrics computed 100% in-browser.
 * Matches api-spec.md §1 (DeterministicMetrics).
 */

export interface VolumeMetrics {
  totalMessages: number;
  personA: { count: number; percentage: number };
  personB: { count: number; percentage: number };
  averagePerDay: number;
}

export interface InitiationMetrics {
  /** Default: 3 hours */
  thresholdHours: number;
  totalSessions: number;
  personA: { count: number; percentage: number };
  personB: { count: number; percentage: number };
}

export interface PersonSpeedStats {
  averageSeconds: number;
  medianSeconds: number;
  longestSilenceHours: number;
}

export interface ResponseSpeedMetrics {
  personA: PersonSpeedStats;
  personB: PersonSpeedStats;
  /** Latency buckets: <1m, 1-5m, 5-30m, 30m-2h, 2h+ */
  distribution?: {
    under1m: number;
    m1to5: number;
    m5to30: number;
    m30to2h: number;
    over2h: number;
  };
}

export interface TemporalMetrics {
  /** Array of 24 values (0-23 hours, local time) */
  hourlyDistribution: number[];
  /** Array of 7 values (Sunday=0 to Saturday=6) */
  dayOfWeekDistribution: number[];
  /** 0-23 */
  peakHour: number;
  /** E.g. "Thursday" */
  busiestDay: string;
}

export interface PersonLexicalStats {
  avgWordCount: number;
  doubleTextCount: number;
  questionsAsked: number;
  topEmojis: Array<{ emoji: string; count: number }>;
  topPhrases?: Array<{ phrase: string; count: number }>;
}

export interface LexicalMetrics {
  personA: PersonLexicalStats;
  personB: PersonLexicalStats;
}

export interface DeterministicMetrics {
  volume: VolumeMetrics;
  initiation: InitiationMetrics;
  responseSpeed: ResponseSpeedMetrics;
  temporal: TemporalMetrics;
  lexical: LexicalMetrics;
}
