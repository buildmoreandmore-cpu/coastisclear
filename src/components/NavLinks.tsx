"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthClient } from "@/lib/supabase";

const ADMIN_EMAILS = [
  "martinjdfrancis@gmail.com",
  "morian@aaemgmt.com",
];

export default function NavLinks() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = getAuthClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      if (data.session?.user?.email && ADMIN_EMAILS.includes(data.session.user.email)) {
        setIsAdmin(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
        setIsAdmin(!!session?.user?.email && ADMIN_EMAILS.includes(session.user.email));
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = getAuthClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex items-center gap-6">
      <Link
        href="/about"
        className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
      >
        about
      </Link>
      {loggedIn ? (
        <>
          <Link
            href="/search"
            className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
          >
            search
          </Link>
          <Link
            href="/dashboard"
            className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
          >
            pipeline
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
            >
              admin
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
          >
            sign out
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors"
        >
          login
        </Link>
      )}
    </div>
  );
}
