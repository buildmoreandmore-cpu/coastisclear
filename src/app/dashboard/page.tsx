"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthClient } from "@/lib/supabase";
import { usePipeline } from "@/hooks/usePipeline";
import PipelineCard from "@/components/PipelineCard";
import LetterModal from "@/components/LetterModal";
import type { PipelineItem } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { items, loaded, advanceStep, undoStep, removeItem, updateLetters } = usePipeline();

  // Letter modal state
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [letterLoading, setLetterLoading] = useState(false);
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  const [masterLetter, setMasterLetter] = useState<string | undefined>();
  const [publishingLetter, setPublishingLetter] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    const supabase = getAuthClient();
    if (!supabase) { router.push("/login"); return; }
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (!data.session) router.push("/login");
      else setAuthChecked(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateLettersForItem = useCallback(async (item: PipelineItem) => {
    setLetterLoading(true);
    setMasterLetter(undefined);
    setPublishingLetter(undefined);

    const base = {
      newSongTitle: item.newSongTitle,
      sampledSongTitle: item.sampledSongTitle,
      originalArtist: item.originalArtist,
      sampleUseDescription: item.sampleUseDescription,
      originalTimingStart: item.originalTimingStart,
      originalTimingEnd: item.originalTimingEnd,
      newTimingStart: item.newTimingStart,
      newTimingEnd: item.newTimingEnd,
      intendedUse: item.intendedUse,
      releaseContext: item.releaseContext,
      distributorName: item.distributorName,
    };

    try {
      const promises = [];

      if (item.master.holder && item.master.holder !== "Unknown") {
        promises.push(
          fetch("/api/letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...base,
              rightsType: "master",
              holderName: item.master.holder,
              contactName: item.master.contactName,
              department: "Sample Licensing",
            }),
          })
            .then((r) => r.json())
            .then((d) => setMasterLetter(d.letter))
        );
      }

      if (item.publishing.holder && item.publishing.holder !== "Unknown") {
        promises.push(
          fetch("/api/letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...base,
              rightsType: "publishing",
              holderName: item.publishing.holder,
              contactName: item.publishing.contactName,
              department: "Sample Licensing",
              publisher: item.publishing.holder,
              administrator: item.publishing.administrator,
            }),
          })
            .then((r) => r.json())
            .then((d) => setPublishingLetter(d.letter))
        );
      }

      await Promise.all(promises);
    } catch {
      // Silently fail
    } finally {
      setLetterLoading(false);
    }
  }, []);

  const handleViewLetter = useCallback((item: PipelineItem) => {
    setActivePipelineId(item.id);
    setLetterModalOpen(true);

    if (item.masterLetter || item.publishingLetter) {
      // Show saved letters
      setMasterLetter(item.masterLetter);
      setPublishingLetter(item.publishingLetter);
      setLetterLoading(false);
    } else {
      // Generate new letters
      generateLettersForItem(item);
    }
  }, [generateLettersForItem]);

  const handleRegenerateLetter = useCallback((item: PipelineItem) => {
    setActivePipelineId(item.id);
    setLetterModalOpen(true);
    generateLettersForItem(item);
  }, [generateLettersForItem]);

  const handleSaveLetters = useCallback((master: string, publishing: string) => {
    if (activePipelineId) {
      updateLetters(activePipelineId, master, publishing);
    }
  }, [activePipelineId, updateLetters]);

  if (!authChecked || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-[var(--text-dim)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link
            href="/"
            className="font-display font-extrabold text-xl text-[var(--text)] tracking-tight hover:opacity-80 transition-opacity"
          >
            Clear the Wax
          </Link>
          <p className="font-mono text-xs text-[var(--text-dim)] mt-1">
            Pipeline — {items.length} clearance{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/search"
          className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
        >
          New Search
        </Link>
      </div>

      {/* Pipeline items */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display font-bold text-lg text-[var(--text-mid)] mb-2">
            No clearances yet
          </p>
          <p className="font-mono text-sm text-[var(--text-dim)] mb-6">
            Start your first search to add a sample to your pipeline.
          </p>
          <Link
            href="/search"
            className="inline-block px-6 py-3 border border-[var(--border-active)] text-[var(--text)] font-mono text-sm rounded-lg hover:bg-[var(--accent-soft)] transition-colors"
          >
            Start a Search
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <PipelineCard
              key={item.id}
              item={item}
              onAdvanceStep={advanceStep}
              onUndoStep={undoStep}
              onDelete={removeItem}
              onViewLetter={handleViewLetter}
              onRegenerateLetter={handleRegenerateLetter}
            />
          ))}
        </div>
      )}

      {/* Letter Modal */}
      <LetterModal
        isOpen={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        masterLetter={masterLetter}
        publishingLetter={publishingLetter}
        isLoading={letterLoading}
        onSave={handleSaveLetters}
      />
    </div>
  );
}
