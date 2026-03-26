"use client";

import type { ActivityLogEntry } from "@/types";

interface ActivityLogProps {
  entries: ActivityLogEntry[];
}

export default function ActivityLog({ entries }: ActivityLogProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );

  return (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-dim)] mb-3">
        Activity
      </p>
      {sorted.slice(0, 10).map((entry, i) => (
        <div key={i} className="flex items-baseline gap-3 font-mono text-xs">
          <span className="text-[var(--text-dim)] w-16 shrink-0">
            {new Date(entry.performedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-[var(--text-mid)] flex-1">{entry.action}</span>
          <span className="text-[var(--text-dim)]">{entry.performedBy}</span>
        </div>
      ))}
    </div>
  );
}
