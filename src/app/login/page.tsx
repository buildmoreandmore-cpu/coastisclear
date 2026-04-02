"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthClient } from "@/lib/supabase";

type Mode = "signin" | "signup" | "forgot" | "reset-sent";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    const supabase = getAuthClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/search");
    });
  }, [router]);

  const ADMIN_EMAILS = [
    "martinjdfrancis@gmail.com",
    "morian@aaemgmt.com",
  ];

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
      setShowConfirmPopup(true);
      setTimeout(() => {
        setMode("signin");
        setPassword("");
      }, 500);
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
      const supabase = getAuthClient();
      const { data: userData } = await supabase!.auth.getUser();
      const userEmail = userData.user?.email;
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        router.push("/admin");
      } else {
        router.push("/search");
      }
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

      {/* Email confirmation popup */}
      {showConfirmPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-[var(--surface)] border border-[var(--border-active)] rounded-xl px-5 py-4 shadow-lg max-w-sm">
            <div className="flex gap-3">
              <span className="text-lg shrink-0 mt-0.5">&#9993;</span>
              <div>
                <p className="font-display font-bold text-sm text-[var(--text)]">
                  Check your email to confirm
                </p>
                <p className="font-mono text-xs text-[var(--text-mid)] mt-1 leading-relaxed">
                  You&apos;ve successfully signed up. Please check your email to
                  confirm your account before signing in. The confirmation link
                  expires in 10 minutes.
                </p>
                <button
                  onClick={() => { setShowConfirmPopup(false); setMode("signin"); }}
                  className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text)] mt-2 underline transition-colors"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
