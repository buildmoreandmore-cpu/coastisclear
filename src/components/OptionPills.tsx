"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptionPillsProps {
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}

export default function OptionPills({ options, onSelect }: OptionPillsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {options.map((option, i) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          disabled={selected !== null}
          className={cn(
            "px-5 py-2.5 rounded-full border font-mono text-sm transition-all duration-200 ease-out",
            "animate-fade-in-up",
            selected === option.value
              ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]"
              : selected !== null
                ? "border-[var(--border)] text-[var(--text-dim)] opacity-40"
                : "border-[var(--border)] text-[var(--text-mid)] hover:border-[var(--border-active)] hover:text-[var(--accent)] active:scale-95"
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
