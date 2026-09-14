/**
 * Lexical effort, double-text bursts, questions, emoji + phrase frequency.
 * Per task 03.4.
 */
import type { CanonicalMessage } from "@/types/chat";
import type { LexicalMetrics } from "@/types/metrics";

const STOPWORDS = new Set(
  "the,a,an,and,or,but,if,then,else,for,to,of,in,on,at,by,with,from,as,is,are,was,were,be,been,i,you,he,she,it,we,they,me,him,her,us,them,my,your,his,our,their,this,that,these,those,not,no,yes,so,just,like,get,got,go,going,do,does,did,have,has,had,will,would,can,could,should,there,here,what,when,where,who,why,how,all,any,more,very,too,also,well,ok,okay,yeah,yep,nope,hmm,oh,ah,hey,hi,hello,thanks,thank,please,sorry,really,still,even,ever,never,always,maybe,well".split(
    ","
  )
);

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function calculateLexical(messages: CanonicalMessage[]): LexicalMetrics {
  const forPerson = (id: "person_a" | "person_b") => {
    const mine = messages.filter((m) => m.senderId === id && m.messageType === "text");
    const totalWords = mine.reduce((a, m) => a + m.wordCount, 0);
    const questions = mine.filter((m) => m.hasQuestion).length;

    const emojiCounts = new Map<string, number>();
    for (const m of mine) {
      for (const e of m.emojis) emojiCounts.set(e, (emojiCounts.get(e) ?? 0) + 1);
    }
    const topEmojis = [...emojiCounts.entries()]
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Catchphrase mining: bigrams/trigrams of non-stopwords
    const phraseCounts = new Map<string, number>();
    for (const m of mine) {
      const tokens = m.text
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/[^a-z'\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2 && !STOPWORDS.has(t));
      for (let n = 2; n <= 3; n++) {
        for (let i = 0; i + n <= tokens.length; i++) {
          const phrase = tokens.slice(i, i + n).join(" ");
          phraseCounts.set(phrase, (phraseCounts.get(phrase) ?? 0) + 1);
        }
      }
    }
    const topPhrases = [...phraseCounts.entries()]
      .filter(([, c]) => c >= 2)
      .map(([phrase, count]) => ({ phrase, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      avgWordCount: mine.length > 0 ? round1(totalWords / mine.length) : 0,
      doubleTextCount: 0, // filled below
      questionsAsked: questions,
      topEmojis,
      topPhrases,
    };
  };

  const a = forPerson("person_a");
  const b = forPerson("person_b");

  // Double-text burst: ≥2 consecutive messages from same sender (any type except system)
  const sorted = [...messages]
    .filter((m) => m.senderId !== "system")
    .sort((x, y) => x.timestamp.localeCompare(y.timestamp));
  let run = 1;
  const bursts = { person_a: 0, person_b: 0 };
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].senderId === sorted[i - 1].senderId) {
      run++;
    } else {
      if (run >= 2) {
        const id = sorted[i - 1].senderId as "person_a" | "person_b";
        bursts[id]++;
      }
      run = 1;
    }
  }
  if (run >= 2 && sorted.length > 0) {
    const id = sorted[sorted.length - 1].senderId as "person_a" | "person_b";
    bursts[id]++;
  }
  a.doubleTextCount = bursts.person_a;
  b.doubleTextCount = bursts.person_b;

  return { personA: a, personB: b };
}
