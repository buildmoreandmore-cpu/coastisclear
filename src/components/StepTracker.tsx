"use client";

import type { PipelineStep } from "@/types";

interface StepTrackerProps {
  steps: PipelineStep[];
  rightsType: "master" | "publishing";
  onAdvance: (stepNumber: number) => void;
}

export default function StepTracker({ steps, rightsType, onAdvance }: StepTrackerProps) {
  const currentStep = steps.findIndex((s) => !s.completed);
  const label = rightsType === "master" ? "Master" : "Publishing";

  return (
    <div className="space-y-1">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-dim)] mb-3">
        {label}
      </p>
      {steps.map((step, i) => {
        const isCompleted = step.completed;
        const isCurrent = i === currentStep;
        const isOverdue =
          isCurrent &&
          steps[i - 1]?.completedAt &&
          Date.now() - new Date(steps[i - 1].completedAt!).getTime() >
            7 * 24 * 60 * 60 * 1000;

        return (
          <div
            key={step.stepNumber}
            className="flex items-center gap-3 py-1.5 group"
          >
            {/* Step indicator */}
            <div className="w-5 flex justify-center shrink-0">
              {isCompleted ? (
                <span className="text-[var(--success)] text-xs">&#10003;</span>
              ) : isCurrent ? (
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[var(--text-dim)]" />
              )}
            </div>

            {/* Step name */}
            <span
              className={`font-mono text-xs flex-1 ${
                isCompleted
                  ? "text-[var(--text-mid)]"
                  : isCurrent
                    ? "text-[var(--text)]"
                    : "text-[var(--text-dim)]"
              }`}
            >
              {step.stepName}
            </span>

            {/* Timestamp or action */}
            {isCompleted && step.completedAt && (
              <span className="font-mono text-xs text-[var(--text-dim)]">
                {new Date(step.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {isCurrent && (
              <button
                onClick={() => onAdvance(step.stepNumber)}
                className="opacity-0 group-hover:opacity-100 font-mono text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-all"
              >
                Complete
              </button>
            )}

            {isOverdue && (
              <span className="text-[var(--warning)] text-xs">&#9888;</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
