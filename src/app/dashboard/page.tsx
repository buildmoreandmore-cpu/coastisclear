"use client";

import Link from "next/link";
import { usePipeline } from "@/hooks/usePipeline";
import PipelineCard from "@/components/PipelineCard";

export default function DashboardPage() {
  const { items, loaded, advanceStep, removeItem } = usePipeline();

  if (!loaded) {
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
            className="font-display font-extrabold text-xl text-white tracking-tight hover:opacity-80 transition-opacity"
          >
            Clear Wax
          </Link>
          <p className="font-mono text-xs text-[var(--text-dim)] mt-1">
            Pipeline — {items.length} clearance{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/search"
          className="px-4 py-2 bg-white text-[var(--bg)] font-mono text-sm rounded-lg hover:bg-white/90 transition-colors"
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
            className="inline-block px-6 py-3 border border-[var(--border-active)] text-white font-mono text-sm rounded-lg hover:bg-[var(--accent-soft)] transition-colors"
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
              onDelete={removeItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
