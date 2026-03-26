"use client";

import { useState, useEffect } from "react";

interface ScanningStateProps {
  phases: string[];
  onComplete: () => void;
}

export default function ScanningState({ phases, onComplete }: ScanningStateProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (currentPhase < phases.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPhase((p) => p + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, phases.length, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {/* Pulsing rings */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-[var(--text)]/20 animate-pulse-expand"
            style={{ animationDelay: `${i * 600}ms` }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[var(--text)] animate-pulse-ring" />
        </div>
      </div>

      {/* Phase text */}
      <div className="text-center">
        <p className="font-mono text-sm text-[var(--text-mid)] animate-fade-in-up" key={currentPhase}>
          {phases[currentPhase]}
        </p>
        <div className="flex gap-1.5 justify-center mt-4">
          {phases.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                i <= currentPhase ? "bg-[var(--text)]" : "bg-[var(--text-dim)]"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
