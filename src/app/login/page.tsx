"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-bold text-2xl text-[var(--text)] mb-2 text-center">
          Sign in
        </h1>
        <p className="font-mono text-sm text-[var(--text-mid)] mb-10 text-center">
          Access your clearance pipeline
        </p>

        {submitted ? (
          <div className="text-center space-y-3">
            <p className="font-mono text-sm text-[var(--text)]">
              Check your inbox.
            </p>
            <p className="font-mono text-xs text-[var(--text-dim)]">
              We sent a login link to {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] py-3"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:opacity-80 transition-opacity"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
