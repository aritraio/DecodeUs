#!/usr/bin/env tsx
/**
 * Synthetic WhatsApp chat fixture generator (CLI).
 *
 * Generates large, deterministic, clearly-synthetic chat exports for
 * performance benchmarking and test fixtures. NEVER uses real personal data.
 *
 * Usage:
 *   npx tsx scripts/generate-fixture.ts --type=balanced --messages=1000 --format=ios [--out=path] [--seed=42]
 *   npm run test:generate-fixture -- --type=avoidant --messages=1000
 *
 * Flags:
 *   --type=(balanced|avoidant|conflict|multiline)  default: balanced
 *   --messages=<count>   default: 500
 *   --format=(ios|android|ios-12h)  default: ios
 *   --out=<path>  default: stdout (or tests/fixtures/synthetic/generated-<type>-<n>.txt)
 *   --seed=<int>  default: 42
 */

interface CliOptions {
  type: "balanced" | "avoidant" | "conflict" | "multiline";
  messages: number;
  format: "ios" | "android" | "ios-12h";
  out?: string;
  seed: number;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { type: "balanced", messages: 500, format: "ios", seed: 42 };
  for (const arg of argv) {
    if (arg.startsWith("--type=")) {
      const v = arg.slice(7);
      if (v === "balanced" || v === "avoidant" || v === "conflict" || v === "multiline") opts.type = v;
    } else if (arg.startsWith("--messages=")) {
      const n = parseInt(arg.slice(11), 10);
      if (Number.isFinite(n) && n > 0 && n <= 100000) opts.messages = n;
    } else if (arg.startsWith("--format=")) {
      const v = arg.slice(9);
      if (v === "ios" || v === "android" || v === "ios-12h") opts.format = v;
    } else if (arg.startsWith("--out=")) {
      opts.out = arg.slice(6);
    } else if (arg.startsWith("--seed=")) {
      const n = parseInt(arg.slice(7), 10);
      if (Number.isFinite(n)) opts.seed = n;
    }
  }
  return opts;
}

/** Deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = { a: "Alex Morgan", b: "Jordan Lee" };

const BALANCED_A = [
  "Morning! Did you sleep okay?",
  "Are we still meeting at 4?",
  "That presentation went really well, thanks for the pep talk",
  "Want to grab groceries together after work?",
  "I appreciate how you handled that call earlier",
  "What should we cook tonight?",
  "Sending you the playlist we talked about",
  "Hope your day is going smoothly",
  "Let's plan something fun for the weekend",
  "Thanks for checking in, that meant a lot",
];
const BALANCED_B = [
  "Morning! Slept great, you?",
  "Yes, leaving right around 3:30",
  "So proud of you! You earned it",
  "Sure, I'll pick up veggies on my way",
  "Thanks, I was nervous but it worked out",
  "How about pasta? I can start the sauce",
  "Loved those songs, added a few more",
  "Pretty smooth so far, how about yours?",
  "Picnic on Saturday? Weather looks perfect",
  "Always. You know I'm here for you",
];

const AVOIDANT_PURSUER_A = [
  "Hey, are you there? You have barely answered all day",
  "Are you upset with me?",
  "Can we please talk about this tonight?",
  "I feel like I am always the one reaching out lately",
  "Sorry if I am texting too much, just worried",
  "Did I do something wrong?",
  "Please just let me know you are okay",
  "I miss how we used to talk every evening",
];
const AVOIDANT_PURSUER_B = [
  "Was working. Not everything is about you",
  "Busy. Talk later",
  "ok",
  "Can we do this another time? Long day",
  "I need some space tonight",
  "Fine. Everything is fine",
  "Got tied up, sorry",
];

const CONFLICT_A = [
  "You always cancel our plans at the last minute",
  "You never listen when I try to explain how I feel",
  "I am tired of apologizing first every single time",
  "It hurts when you dismiss what I am saying",
  "We need to talk about what happened last night",
  "I felt hurt when you cancelled after I waited for two hours",
  "Sorry I snapped earlier, work was overwhelming",
  "Can we agree to actually resolve this instead of dropping it?",
];
const CONFLICT_B = [
  "If you did not stress me out so much about work, I would not need space",
  "You are overreacting again, it was not a big deal",
  "I already said sorry, what more do you want?",
  "Fine, whatever, let's just drop it",
  "Thanks, I appreciate you saying that",
  "I was wrong to deflect. Let's talk properly tonight",
  "I hear you. I should have communicated earlier",
];

const EMOJIS = ["😂", "❤️", "👍", "🙏", "😊", "🎉", "🔥", "💯", "🥺", "😅"];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatLine(
  format: CliOptions["format"],
  d: Date,
  sender: string,
  text: string
): string {
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  if (format === "android") {
    return `${day}/${month}/${year}, ${pad(d.getHours())}:${pad(d.getMinutes())} - ${sender}: ${text}`;
  }
  if (format === "ios-12h") {
    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `[${month}/${day}/${year}, ${h}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}] ${sender}: ${text}`;
  }
  // ios 24h bracket
  return `[${day}/${month}/${year}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}] ${sender}: ${text}`;
}

function nextGapMinutes(rng: () => number, type: CliOptions["type"], senderIsA: boolean): number {
  const r = rng();
  if (type === "avoidant") {
    // Person B (avoidant) has long delays; Person A double-texts quickly
    if (!senderIsA) return 60 + Math.floor(r * 600);
    return r < 0.4 ? 1 + Math.floor(r * 4) : 5 + Math.floor(r * 60);
  }
  if (type === "conflict") {
    return r < 0.6 ? 1 + Math.floor(r * 20) : 60 + Math.floor(r * 300);
  }
  // balanced
  if (r < 0.7) return 1 + Math.floor(r * 25);
  if (r < 0.9) return 30 + Math.floor(r * 120);
  return 200 + Math.floor(r * 800);
}

export function generateChat(opts: CliOptions): string {
  const rng = mulberry32(opts.seed);
  const lines: string[] = [];
  // Start date: 2025-01-05 09:00 local (formatting is local-time display)
  const cursor = new Date(2025, 0, 5, 9, 0, 0);
  let senderIsA = true;
  let consecSame = 0;

  let poolA: string[] = BALANCED_A;
  let poolB: string[] = BALANCED_B;
  if (opts.type === "avoidant") {
    poolA = AVOIDANT_PURSUER_A;
    poolB = AVOIDANT_PURSUER_B;
  } else if (opts.type === "conflict") {
    poolA = CONFLICT_A;
    poolB = CONFLICT_B;
  } else if (opts.type === "multiline") {
    poolA = BALANCED_A;
    poolB = BALANCED_B;
  }

  // Encryption notice as first line (system message, like real exports)
  lines.push(
    formatLine(opts.format === "android" ? "android" : "ios", cursor, NAMES.a, "Messages and calls are end-to-end encrypted. No one outside of this chat can read them.")
  );

  for (let i = 0; i < opts.messages; i++) {
    const gap = nextGapMinutes(rng, opts.type, senderIsA);
    cursor.setMinutes(cursor.getMinutes() + gap);

    // Sender switching dynamics per type
    const r = rng();
    if (opts.type === "avoidant") {
      // A sends ~68%, with bursts; B replies sparsely
      if (senderIsA) {
        senderIsA = r < 0.55 ? true : false;
      } else {
        senderIsA = r < 0.75 ? true : false;
      }
    } else if (opts.type === "balanced" || opts.type === "multiline") {
      senderIsA = r < 0.5 ? !senderIsA : senderIsA;
      if (consecSame >= 2 && rng() < 0.8) senderIsA = !senderIsA;
    } else {
      senderIsA = r < 0.5 ? !senderIsA : senderIsA;
    }

    const sender = senderIsA ? NAMES.a : NAMES.b;
    let text = senderIsA ? pick(rng, poolA) : pick(rng, poolB);

    // Sprinkle emojis (~18% of messages)
    if (rng() < 0.18) text += ` ${pick(rng, EMOJIS)}`;
    // Sprinkle questions (~15%)
    if (rng() < 0.08 && !text.endsWith("?")) text += "?";

    // Multiline injection (~10% for multiline type, ~3% otherwise)
    const mlRate = opts.type === "multiline" ? 0.12 : 0.03;
    if (rng() < mlRate) {
      text += `\n${senderIsA ? "Adding a bit more context on the next line" : "Continuing my thought here"} with extra detail\nAnd a third line to test stitching`;
    }
    // Media omitted / deleted markers (~2%)
    if (opts.type === "multiline" && rng() < 0.04) {
      text = pick(rng, ["<Media omitted>", "image omitted", "This message was deleted"] as string[]);
    }

    lines.push(formatLine(opts.format, cursor, sender, text));
  }
  return lines.join("\n") + "\n";
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const chat = generateChat(opts);
  if (opts.out) {
    const { writeFile, mkdir } = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    await mkdir(dirname(opts.out), { recursive: true });
    await writeFile(opts.out, chat, "utf-8");
    console.log(`Wrote ${opts.messages} synthetic messages (${opts.type}/${opts.format}) to ${opts.out}`);
  } else {
    process.stdout.write(chat);
  }
}

const isMain = process.argv[1]?.endsWith("generate-fixture.ts") ?? false;
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
