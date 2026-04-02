"use client";

import type { PipelineStep } from "@/types";

interface StepTrackerProps {
  steps: PipelineStep[];
  rightsType: "master" | "publishing";
  onAdvance: (stepNumber: number) => void;
  onUndo: (stepNumber: number) => void;
}

export default function StepTracker({ steps, rightsType, onAdvance, onUndo }: StepTrackerProps) {
  const currentStep = steps.findIndex((s) => !s.completed);
  const label = rightsType === "master" ? "Master" : "Publishing";
  const completedCount = steps.filter((s) => s.completed).length;
  // The last completed step is the one that can be undone
  const lastCompletedIndex = currentStep === -1 ? steps.length - 1 : currentStep - 1;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-dim)]">
          {label}
        </p>
        <span className="font-mono text-xs text-[var(--text-dim)]">
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[var(--surface2)] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>

      {steps.map((step, i) => {
        const isCompleted = step.completed;
        const isCurrent = i === currentStep;
        const isUndoable = isCompleted && i === lastCompletedIndex;
        const isClickable = isCurrent || isUndoable;
        const isOverdue =
          isCurrent &&
          steps[i - 1]?.completedAt &&
          Date.now() - new Date(steps[i - 1].completedAt!).getTime() >
            7 * 24 * 60 * 60 * 1000;

        return (
          <button
            key={step.stepNumber}
            onClick={() => {
              if (isCurrent) onAdvance(step.stepNumber);
              else if (isUndoable) onUndo(step.stepNumber);
            }}
            disabled={!isClickable}
            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all text-left group ${
              isCurrent
                ? "bg-[var(--accent-soft)] border border-[var(--accent)]/30 cursor-pointer hover:bg-[var(--accent-soft)]/80"
                : isUndoable
                  ? "bg-transparent cursor-pointer hover:bg-[var(--danger)]/5"
                  : isCompleted
                    ? "bg-transparent cursor-default"
                    : "bg-transparent cursor-default opacity-50"
            }`}
          >
            {/* Step indicator */}
            <div className={`w-6 h-6 flex items-center justify-center shrink-0 rounded-full border transition-colors ${isUndoable ? "group-hover:border-[var(--danger)] group-hover:bg-[var(--danger)]" : ""}`}
              style={{
                borderColor: isCompleted
                  ? "var(--success)"
                  : isCurrent
                    ? "var(--accent)"
                    : "var(--border)",
                backgroundColor: isCompleted
                  ? "var(--success)"
                  : "transparent",
              }}
            >
              {isCompleted ? (
                <>
                  <span className={`text-white text-xs font-bold ${isUndoable ? "group-hover:hidden" : ""}`}>&#10003;</span>
                  {isUndoable && (
                    <span className="text-white text-xs font-bold hidden group-hover:inline">&#8634;</span>
                  )}
                </>
              ) : (
                <span
                  className="font-mono text-xs"
                  style={{
                    color: isCurrent ? "var(--accent)" : "var(--text-dim)",
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>

            {/* Step name */}
            <span
              className={`font-mono text-xs flex-1 ${
                isCompleted
                  ? `text-[var(--text-mid)] line-through ${isUndoable ? "group-hover:no-underline group-hover:text-[var(--text)]" : ""}`
                  : isCurrent
                    ? "text-[var(--text)] font-semibold"
                    : "text-[var(--text-dim)]"
              }`}
            >
              {step.stepName}
            </span>

            {/* Timestamp or action */}
            {isCompleted && step.completedAt && (
              <span className={`font-mono text-xs text-[var(--text-dim)] ${isUndoable ? "group-hover:hidden" : ""}`}>
                {new Date(step.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {isUndoable && (
              <span className="font-mono text-xs text-[var(--danger)] hidden group-hover:inline">
                Undo
              </span>
            )}

            {isCurrent && (
              <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                Mark Done
              </span>
            )}

            {isOverdue && (
              <span className="text-[var(--warning)] text-xs ml-1">&#9888;</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
