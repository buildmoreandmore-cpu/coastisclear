"use client";

import { useState } from "react";
import type { PipelineItem } from "@/types";
import { getCombinedStatus } from "@/types";
import StepTracker from "./StepTracker";
import QuoteTimer from "./QuoteTimer";
import ActivityLog from "./ActivityLog";

interface PipelineCardProps {
  item: PipelineItem;
  onAdvanceStep: (
    itemId: string,
    rightsType: "master" | "publishing",
    stepNumber: number
  ) => void;
  onUndoStep: (
    itemId: string,
    rightsType: "master" | "publishing",
    stepNumber: number
  ) => void;
  onDelete: (id: string) => void;
  onViewLetter: (item: PipelineItem) => void;
  onRegenerateLetter: (item: PipelineItem) => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  fully_cleared: { label: "FULLY CLEARED", color: "var(--success)" },
  master_cleared: { label: "MASTER CLEARED", color: "var(--info)" },
  publishing_cleared: { label: "PUB CLEARED", color: "var(--info)" },
  in_progress: { label: "IN PROGRESS", color: "var(--warning)" },
  blocked: { label: "BLOCKED", color: "var(--danger)" },
  not_started: { label: "NOT STARTED", color: "var(--text-dim)" },
};

export default function PipelineCard({ item, onAdvanceStep, onUndoStep, onDelete, onViewLetter, onRegenerateLetter }: PipelineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const combined = getCombinedStatus(item);
  const statusInfo = STATUS_LABELS[combined] || STATUS_LABELS.not_started;

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-[var(--accent-soft)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-[var(--text)] truncate">
            {item.newSongTitle || "Untitled"}
          </p>
          <p className="font-mono text-xs text-[var(--text-mid)] mt-0.5">
            Sampling: &ldquo;{item.sampledSongTitle}&rdquo; by {item.originalArtist}
          </p>
        </div>

        {/* Status badge */}
        <span
          className="flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full border shrink-0"
          style={{ color: statusInfo.color, borderColor: `${statusInfo.color}33` }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusInfo.color }}
          />
          {statusInfo.label}
        </span>

        {/* Expand arrow */}
        <span
          className={`text-[var(--text-dim)] transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          &#9662;
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-[var(--border)] pt-5 space-y-6">
          {/* Quote timer */}
          {item.quoteExpiration && (
            <QuoteTimer expiration={item.quoteExpiration} />
          )}

          {/* Master replayed state */}
          {item.master.status === "master_replayed" ? (
            <div className="px-4 py-3 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
              <p className="font-mono text-xs text-[var(--success)]">
                &#10003; Master Replayed — No master clearance required
              </p>
            </div>
          ) : (
            <StepTracker
              steps={item.master.steps}
              rightsType="master"
              onAdvance={(step) => onAdvanceStep(item.id, "master", step)}
              onUndo={(step) => onUndoStep(item.id, "master", step)}
            />
          )}

          <div className="border-t border-[var(--border)]" />

          <StepTracker
            steps={item.publishing.steps}
            rightsType="publishing"
            onAdvance={(step) => onAdvanceStep(item.id, "publishing", step)}
            onUndo={(step) => onUndoStep(item.id, "publishing", step)}
          />

          <div className="border-t border-[var(--border)]" />

          <ActivityLog entries={item.activityLog} />

          {/* Letter actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onViewLetter(item)}
              className="flex-1 px-4 py-2.5 border border-[var(--border-active)] text-[var(--text)] font-mono text-xs rounded-lg hover:bg-[var(--accent-soft)] transition-all"
            >
              {item.letterDrafted ? "View / Edit Letter" : "Draft Letter"}
            </button>
            {item.letterDrafted && (
              <button
                onClick={() => onRegenerateLetter(item)}
                className="px-4 py-2.5 border border-[var(--border)] text-[var(--text-dim)] font-mono text-xs rounded-lg hover:border-[var(--border-active)] hover:text-[var(--text)] transition-all"
              >
                Regenerate
              </button>
            )}
          </div>

          {/* Delete */}
          <div className="pt-2">
            <button
              onClick={() => onDelete(item.id)}
              className="font-mono text-xs text-[var(--danger)] hover:text-[var(--danger)]/80 transition-colors"
            >
              Remove from pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
