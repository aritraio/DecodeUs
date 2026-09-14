"use client";

import * as React from "react";
import { useAnalysis } from "@/lib/store/analysis-context";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { FingerprintTab } from "@/components/dashboard/tabs/fingerprint-tab";
import { SignalsTab } from "@/components/dashboard/tabs/signals-tab";
import { PatternReplayTab } from "@/components/dashboard/tabs/pattern-replay-tab";
import { RealityCheckTab } from "@/components/dashboard/tabs/reality-check-tab";
import { EvidenceDrawer } from "@/components/dashboard/drawers/evidence-drawer";
import { AskYourChatTerminal } from "@/components/chat/ask-your-chat-terminal";
import { ShareCardGenerator } from "@/components/sharing/share-card-generator";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * Master diagnostic workstation (task 09.1): sticky tab bar,
 * section counters, advisory strip, evidence drawer host.
 */
export function DashboardLayout(): React.JSX.Element {
  const { report, advisory, warning, activeTab } = useAnalysis();
  const [drawerIds, setDrawerIds] = React.useState<string[]>([]);

  if (!report) return <div data-testid="dashboard-layout" />;

  return (
    <div data-testid="dashboard-layout" className="mt-8">
      <SectionHeader
        index="02. DIAGNOSTIC WORKSTATION"
        title="Deep Diagnostic Dashboard"
        meta="5 TABS"
      />
      {warning && (
        <p role="status" className="mt-4 border-4 border-swiss-amber bg-white p-3 text-sm font-bold">
          ⚠ {warning}
        </p>
      )}
      {advisory && (
        <p role="status" className="mt-4 border-4 border-swiss-amber bg-white p-3 text-sm font-bold">
          {advisory}
        </p>
      )}
      <div className="mt-4">
        <DashboardNav />
      </div>
      <div className="mt-6">
        {activeTab === "fingerprint" && <FingerprintTab />}
        {activeTab === "signals" && <SignalsTab onExamine={setDrawerIds} />}
        {activeTab === "patterns" && <PatternReplayTab />}
        {activeTab === "reality" && <RealityCheckTab />}
        {activeTab === "ask" && <AskYourChatTerminal />}
      </div>
      <ShareCardGenerator />
      {drawerIds.length > 0 && (
        <EvidenceDrawer excerptIds={drawerIds} onClose={() => setDrawerIds([])} />
      )}
    </div>
  );
}
