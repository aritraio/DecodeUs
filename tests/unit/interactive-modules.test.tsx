import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { AnalysisProvider, useAnalysis } from "@/lib/store/analysis-context";
import { AskYourChatTerminal } from "@/components/chat/ask-your-chat-terminal";
import { ShareCardTemplate } from "@/components/sharing/share-card-template";
import { CrisisSupportModal } from "@/components/safety/crisis-support-modal";
import { scanForCrisis } from "@/lib/safety/crisis-detector";
import { runFullPipeline } from "@/lib/parser/pipeline";
import { loadMockReport } from "@/lib/server/mock-report";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CanonicalMessage } from "@/types/chat";

function Seeded({ children }: { children: React.ReactNode }) {
  return (
    <AnalysisProvider>
      <Seeder>{children}</Seeder>
    </AnalysisProvider>
  );
}

function Seeder({ children }: { children: React.ReactNode }) {
  const { setStats, setReady } = useAnalysis();
  const done = React.useRef(false);
  if (!done.current) {
    done.current = true;
    const raw = readFileSync(
      join(process.cwd(), "tests/fixtures/synthetic/synthetic-balanced-couple.txt"),
      "utf-8"
    );
    setStats(runFullPipeline(raw));
    setReady(loadMockReport());
  }
  return <>{children}</>;
}

describe("ask-your-chat terminal (task 10.2)", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders preset pills and submits queries to /api/chat", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        answer: "Person A apologized first in most cases.",
        confidence: "HIGH",
        supportingExcerptIds: ["exc_01"],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Seeded>
        <AskYourChatTerminal />
      </Seeded>
    );
    for (const pill of [
      /who apologizes first/i,
      /when did we talk the most/i,
      /what topics cause silence/i,
      /are our reply times balanced/i,
      /how has texting changed over time/i,
    ]) {
      expect(screen.getByText(pill)).toBeInTheDocument();
    }

    fireEvent.click(screen.getByText(/who apologizes first/i));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(screen.getByText(/Person A apologized first/)).toBeInTheDocument();
      expect(screen.getByText(/Confidence: HIGH/)).toBeInTheDocument();
    });
  });

  it("shows amber alert on insufficient evidence", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          answer: "Insufficient evidence in the chat history to determine this pattern.",
          confidence: "INSUFFICIENT_EVIDENCE",
          supportingExcerptIds: [],
        }),
      }))
    );
    render(
      <Seeded>
        <AskYourChatTerminal />
      </Seeded>
    );
    fireEvent.change(screen.getByLabelText(/Ask a question/), {
      target: { value: "Do we resolve anything?" },
    });
    fireEvent.click(screen.getByText("Ask"));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/insufficient evidence/i);
    });
  });
});

describe("share card generator (task 10.3)", () => {
  it("template contains zero PII — stats and archetype only", () => {
    const { container } = render(
      <Seeded>
        <ShareCardTemplate aspect="story" />
      </Seeded>
    );
    const html = container.innerHTML;
    expect(html).not.toContain("Alex Morgan");
    expect(html).not.toContain("Jordan Lee");
    expect(html).not.toMatch(/@\w+\.\w+/);
    expect(html).toMatch(/DECODEUS \/\/ WRAPPED/);
    expect(html).toMatch(/initiation split/i);
  });
});

describe("crisis off-ramp (task 10.4)", () => {
  const crisisMsg = (id: string, text: string): CanonicalMessage => ({
    id,
    timestamp: "2025-01-05T09:00:00.000Z",
    senderId: "person_a",
    originalSenderName: "Alex Morgan",
    text,
    messageType: "text",
    charCount: text.length,
    wordCount: text.split(/\s+/).length,
    hasQuestion: false,
    emojis: [],
  });

  it("flags self-harm and threat indicators", () => {
    expect(scanForCrisis([crisisMsg("msg_00001", "I don't want to live anymore")]).flagged).toBe(true);
    expect(scanForCrisis([crisisMsg("msg_00001", "I will hurt you if you leave")]).flagged).toBe(true);
    expect(scanForCrisis([crisisMsg("msg_00001", "What should we cook tonight?")]).flagged).toBe(false);
  });

  it("modal shows helplines and clears data on demand", () => {
    render(
      <Seeded>
        <CrisisSupportModal />
      </Seeded>
    );
    expect(screen.getByTestId("crisis-modal")).toBeInTheDocument();
    expect(screen.getByText(/1-800-799-SAFE/)).toBeInTheDocument();
    expect(screen.getByText(/Text “HOME” to 741741/)).toBeInTheDocument();
    expect(screen.getByText(/findahelpline.com/)).toBeInTheDocument();
    expect(screen.getByText(/\[Clear all chat data now\]/)).toBeInTheDocument();
  });
});
