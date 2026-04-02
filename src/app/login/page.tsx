"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthClient } from "@/lib/supabase";

type Mode = "signin" | "signup" | "confirm" | "forgot" | "reset-sent";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = getAuthClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/search");
    });
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const supabase = getAuthClient();
    if (!supabase) {
      setError("Service unavailable");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setMode("confirm");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;

    const supabase = getAuthClient();
    if (!supabase) {
      setError("Service unavailable");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      router.push("/search");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;

    const supabase = getAuthClient();
    if (!supabase) return;

    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim()
    );
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setMode("reset-sent");
    }
  };

  if (mode === "confirm") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-3">
          <p className="font-display font-bold text-xl text-[var(--text)]">
            Check your email
          </p>
          <p className="font-mono text-sm text-[var(--text-mid)]">
            We sent a confirmation link to {email}
          </p>
          <p className="font-mono text-xs text-[var(--text-dim)]">
            Click the link to activate your account, then come back and sign in.
          </p>
          <button
            onClick={() => setMode("signin")}
            className="mt-6 font-mono text-xs text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (mode === "reset-sent") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-3">
          <p className="font-display font-bold text-xl text-[var(--text)]">
            Check your email
          </p>
          <p className="font-mono text-sm text-[var(--text-mid)]">
            We sent a password reset link to {email}
          </p>
          <button
            onClick={() => setMode("signin")}
            className="mt-6 font-mono text-xs text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-bold text-2xl text-[var(--text)] mb-2 text-center">
            Reset password
          </h1>
          <p className="font-mono text-sm text-[var(--text-mid)] mb-10 text-center">
            We&apos;ll send you a reset link
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] py-3"
            />
            {error && (
              <p className="font-mono text-xs text-[var(--danger)]">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <button
            onClick={() => { setMode("signin"); setError(""); }}
            className="mt-6 w-full text-center font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-bold text-2xl text-[var(--text)] mb-2 text-center">
          {mode === "signup" ? "Create account" : "Sign in"}
        </h1>
        <p className="font-mono text-sm text-[var(--text-mid)] mb-10 text-center">
          {mode === "signup"
            ? "Sign up to start clearing samples"
            : "Access your clearance pipeline"}
        </p>

        <form
          onSubmit={mode === "signup" ? handleSignUp : handleSignIn}
          className="space-y-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] py-3"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] py-3"
          />
          {error && (
            <p className="font-mono text-xs text-[var(--danger)]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading
              ? "Loading..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError("");
            }}
            className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "Don\u2019t have an account? Sign up"}
          </button>
          {mode === "signin" && (
            <button
              onClick={() => { setMode("forgot"); setError(""); }}
              className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text-mid)] transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
