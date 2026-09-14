"use client";

import * as React from "react";
import { Dropzone } from "@/components/landing/dropzone";
import { ExportGuideModal } from "@/components/landing/export-guide-modal";
import { PrivacyManifestTable } from "@/components/landing/privacy-manifest-table";
import { SwissButton } from "@/components/ui/swiss-button";

/**
 * Asymmetric 8:4 hero: massive headline + dropzone (8 cols),
 * privacy manifest sidecar (4 cols). Task 07.1.
 */
export function HeroSection(): React.JSX.Element {
  const [guideOpen, setGuideOpen] = React.useState(false);

  return (
    <section aria-label="Ingestion engine" className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <p className="font-mono text-xs font-black uppercase tracking-widest text-swiss-accent">
          01. INGESTION ENGINE
        </p>
        <h1 className="mt-4 text-6xl font-black uppercase leading-[0.95] tracking-tighter text-black md:text-8xl">
          Understand what your relationship actually looks like.
        </h1>
        <p className="mt-4 max-w-xl text-base text-black md:text-lg">
          Analyze patterns, not people. Zero raw chat storage.
        </p>
        <div className="mt-8">
          <Dropzone />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <SwissButton variant="secondary" size="sm" onClick={() => setGuideOpen(true)}>
            [How do I export my chat?]
          </SwissButton>
        </div>
        <ExportGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      </div>
      <aside className="lg:col-span-4" aria-label="Privacy manifest">
        <div className="lg:sticky lg:top-20">
          <PrivacyManifestTable />
          <div className="swiss-diagonal mt-4 rounded-none border-2 border-black bg-swiss-muted p-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black">
              Local-first guarantee
            </p>
            <p className="mt-2 text-sm text-black">
              Your .txt never leaves this browser unredacted. Parsing, stats, and PII
              scrubbing run on-device before any AI call.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
