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
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    router.push("/");
  };

  const linkClass = "font-mono text-sm text-[var(--text-mid)] hover:text-[var(--text)] transition-colors";

  const links = (
    <>
      <Link href="/about" className={linkClass} onClick={() => setMenuOpen(false)}>about</Link>
      {loggedIn ? (
        <>
          <Link href="/search" className={linkClass} onClick={() => setMenuOpen(false)}>search</Link>
          <Link href="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>pipeline</Link>
          {isAdmin && (
            <Link href="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>admin</Link>
          )}
          <button onClick={handleSignOut} className={linkClass}>sign out</button>
        </>
      ) : (
        <Link href="/login" className={linkClass} onClick={() => setMenuOpen(false)}>login</Link>
      )}
    </>
  );

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-6">
        {links}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden flex flex-col gap-1 p-2"
        aria-label="Menu"
      >
        <span className={`block w-5 h-0.5 bg-[var(--text)] transition-transform ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
        <span className={`block w-5 h-0.5 bg-[var(--text)] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-[var(--text)] transition-transform ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden absolute top-14 right-4 bg-[var(--surface)] border border-[var(--border-active)] rounded-lg px-5 py-4 flex flex-col gap-3 shadow-lg z-50">
          {links}
        </div>
      )}
    </>
  );
}
