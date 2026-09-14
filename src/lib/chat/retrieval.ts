/**
 * Vectorless client-side retrieval for "Ask Your Chat" (task 10.1).
 * Tokenizes the question into keywords, scans canonical messages for
 * matching clusters, and packages top segments as ContextExcerpts.
 */
import type { CanonicalMessage, ContextExcerpt } from "@/types/chat";

const STOPWORDS = new Set(
  "the,a,an,and,or,but,if,then,else,for,to,of,in,on,at,by,with,from,as,is,are,was,were,be,been,i,you,he,she,it,we,they,me,him,her,us,them,my,your,his,our,their,this,that,these,those,do,does,did,what,when,where,who,why,how,about,most,over,time,our,your,have,has,had,will,would,can,could,should,there,here,than,then,very,just,like,chat,talk".split(
    ","
  )
);

/** Synonym expansion for common relationship queries. */
const SYNONYMS: Record<string, string[]> = {
  apolog: ["sorry", "apolog", "forgive", "fault", "regret"],
  sorry: ["sorry", "apolog", "forgive", "fault", "regret"],
  argu: ["argu", "fight", "disagree", "conflict", "upset"],
  fight: ["argu", "fight", "disagree", "conflict", "upset"],
  silenc: ["silence", "quiet", "space", "away", "days"],
  silence: ["silence", "quiet", "space", "away", "days"],
  less: ["less", "change", "less", "often", "rarely"],
  change: ["change", "shift", "different", "less", "more"],
  reply: ["reply", "respond", "answer", "time", "late"],
  time: ["time", "late", "reply", "respond", "hours"],
  topic: ["topic", "about", "argue", "fight", "discuss"],
  balanc: ["initiat", "start", "often", "always", "never"],
  who: [],
  when: [],
};

export function tokenizeQuery(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
  const expanded = new Set<string>();
  for (const t of tokens) {
    expanded.add(t);
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (t.includes(key) || key.includes(t)) {
        syns.forEach((s) => expanded.add(s));
      }
    }
  }
  return [...expanded];
}

export interface ScoredSegment {
  excerpt: ContextExcerpt;
  score: number;
}

/**
 * Retrieve up to `topK` dialogue segments relevant to the query.
 * Windows are ±5 messages around the best-matching line; sender labels
 * are pseudonymized and text is passed through as-is (already redacted
 * excerpts are preferred — callers should use excerpt payloads).
 */
export function retrieveRelevantExcerpts(
  messages: CanonicalMessage[],
  query: string,
  topK = 5
): ContextExcerpt[] {
  const keywords = tokenizeQuery(query);
  if (keywords.length === 0 || messages.length === 0) return [];

  const human = messages.filter((m) => m.senderId !== "system");
  const scored: Array<{ index: number; score: number }> = human.map((m, i) => {
    const lower = m.text.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += kw.length >= 6 ? 2 : 1;
    }
    return { index: i, score };
  });

  const hits = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK * 2);

  // Deduplicate overlapping ±5 windows
  const claimed = new Set<number>();
  const results: ContextExcerpt[] = [];
  let counter = 1;
  for (const hit of hits) {
    if (results.length >= topK) break;
    const start = Math.max(0, hit.index - 5);
    const end = Math.min(human.length - 1, hit.index + 5);
    const range: number[] = [];
    for (let i = start; i <= end; i++) range.push(i);
    const overlap = range.filter((i) => claimed.has(i)).length;
    if (range.length > 0 && overlap / range.length > 0.5) continue;
    range.forEach((i) => claimed.add(i));
    const windowMsgs = range.map((i) => human[i]);
    results.push({
      id: `qexc_${String(counter).padStart(2, "0")}`,
      triggerReason: "sample",
      startDate: windowMsgs[0].timestamp,
      endDate: windowMsgs[windowMsgs.length - 1].timestamp,
      dialogue: windowMsgs.map((m) => ({
        sender: (m.senderId === "person_a" ? "Person A" : "Person B") as "Person A" | "Person B",
        timestamp: m.timestamp,
        text: m.text,
      })),
    });
    counter++;
  }
  return results;
}
