"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthClient } from "@/lib/supabase";

const ADMIN_EMAILS = [
  "martinjdfrancis@gmail.com",
  "morian@aaemgmt.com",
];

type Tab = "songs" | "rights-holders" | "search-requests" | "import";

interface Song {
  id: string;
  song_title: string;
  artist: string;
  master_owner?: string;
  publisher?: { name: string } | null;
  label?: { name: string } | null;
  writer?: string;
  isrc?: string;
  created_at: string;
}

interface RightsHolder {
  id: string;
  name: string;
  type: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  notes?: string;
}

interface SearchRequest {
  id: string;
  song_title: string;
  artist: string;
  found_in_db: boolean;
  source: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("songs");
  const [songs, setSongs] = useState<Song[]>([]);
  const [holders, setHolders] = useState<RightsHolder[]>([]);
  const [requests, setRequests] = useState<SearchRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Admin gate — check if current user is an admin
  useEffect(() => {
    const supabase = getAuthClient();
    if (!supabase) {
      router.push("/login");
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email;
      if (email && ADMIN_EMAILS.includes(email)) {
        setAuthorized(true);
      } else {
        router.push("/search");
      }
      setChecking(false);
    });
  }, [router]);

  // Song form
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songMaster, setSongMaster] = useState("");
  const [songWriter, setSongWriter] = useState("");
  const [songIsrc, setSongIsrc] = useState("");

  // Rights holder form
  const [holderName, setHolderName] = useState("");
  const [holderType, setHolderType] = useState("publisher");
  const [holderEmail, setHolderEmail] = useState("");
  const [holderPhone, setHolderPhone] = useState("");
  const [holderWebsite, setHolderWebsite] = useState("");

  // CSV upload
  const [uploading, setUploading] = useState(false);

  const fetchSongs = useCallback(async () => {
    const res = await fetch("/api/admin/songs");
    setSongs(await res.json());
  }, []);

  const fetchHolders = useCallback(async () => {
    const res = await fetch("/api/admin/rights-holders");
    setHolders(await res.json());
  }, []);

  const fetchRequests = useCallback(async () => {
    const res = await fetch("/api/admin/search-requests");
    setRequests(await res.json());
  }, []);

  useEffect(() => {
    fetchSongs();
    fetchHolders();
    fetchRequests();
  }, [fetchSongs, fetchHolders, fetchRequests]);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle || !songArtist) return;
    setLoading(true);
    const res = await fetch("/api/admin/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_title: songTitle,
        artist: songArtist,
        master_owner: songMaster || null,
        writer: songWriter || null,
        isrc: songIsrc || null,
      }),
    });
    if (res.ok) {
      flash("Song added");
      setSongTitle("");
      setSongArtist("");
      setSongMaster("");
      setSongWriter("");
      setSongIsrc("");
      fetchSongs();
    } else {
      const data = await res.json();
      flash(data.error || "Failed to add song");
    }
    setLoading(false);
  };

  const deleteSong = async (id: string) => {
    const res = await fetch("/api/admin/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      flash("Song deleted");
      fetchSongs();
    }
  };

  const addHolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName) return;
    setLoading(true);
    const res = await fetch("/api/admin/rights-holders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: holderName,
        type: holderType,
        contact_email: holderEmail || null,
        contact_phone: holderPhone || null,
        website: holderWebsite || null,
      }),
    });
    if (res.ok) {
      flash("Rights holder added");
      setHolderName("");
      setHolderEmail("");
      setHolderPhone("");
      setHolderWebsite("");
      fetchHolders();
    } else {
      const data = await res.json();
      flash(data.error || "Failed to add rights holder");
    }
    setLoading(false);
  };

  const handleCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      flash(`Imported ${data.count} ${data.type === "songs" ? "songs" : "rights holders"}`);
      fetchSongs();
      fetchHolders();
    } else {
      flash(data.error || "Import failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "songs", label: "Songs" },
    { key: "rights-holders", label: "Rights Holders" },
    { key: "search-requests", label: "Search Requests" },
    { key: "import", label: "CSV Import" },
  ];

  const inputClass =
    "w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] py-2";
  const btnClass =
    "px-4 py-2 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:opacity-80 transition-opacity disabled:opacity-40";

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-[var(--text-dim)]">
          {checking ? "Checking access..." : "Redirecting..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-10 max-w-5xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-[var(--text)] mb-6">
        Admin Dashboard
      </h1>

      {/* Flash message */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-[var(--surface)] border border-[var(--border-active)] rounded-lg font-mono text-sm text-[var(--text)]">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 font-mono text-sm rounded-lg transition-colors whitespace-nowrap ${
              tab === t.key
                ? "bg-[var(--accent)] text-[var(--bg)]"
                : "text-[var(--text-mid)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Songs Tab */}
      {tab === "songs" && (
        <div className="space-y-8">
          <form onSubmit={addSong} className="space-y-3 max-w-md">
            <p className="font-display font-bold text-lg text-[var(--text)]">
              Add Song
            </p>
            <input
              className={inputClass}
              placeholder="Song title *"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Artist *"
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Master owner"
              value={songMaster}
              onChange={(e) => setSongMaster(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Writer(s)"
              value={songWriter}
              onChange={(e) => setSongWriter(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="ISRC"
              value={songIsrc}
              onChange={(e) => setSongIsrc(e.target.value)}
            />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Adding..." : "Add Song"}
            </button>
          </form>

          <div>
            <p className="font-display font-bold text-lg text-[var(--text)] mb-3">
              Songs in Database ({songs.length})
            </p>
            {songs.length === 0 ? (
              <p className="font-mono text-sm text-[var(--text-dim)]">
                No songs yet
              </p>
            ) : (
              <div className="space-y-2">
                {songs.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--surface)] rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-[var(--text)] truncate">
                        {s.song_title} — {s.artist}
                      </p>
                      <p className="font-mono text-xs text-[var(--text-dim)]">
                        {[
                          s.master_owner && `Master: ${s.master_owner}`,
                          s.publisher?.name && `Pub: ${s.publisher.name}`,
                          s.label?.name && `Label: ${s.label.name}`,
                          s.writer && `Writer: ${s.writer}`,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "No ownership info"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteSong(s.id)}
                      className="shrink-0 font-mono text-xs text-[var(--danger)] hover:opacity-70"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rights Holders Tab */}
      {tab === "rights-holders" && (
        <div className="space-y-8">
          <form onSubmit={addHolder} className="space-y-3 max-w-md">
            <p className="font-display font-bold text-lg text-[var(--text)]">
              Add Rights Holder
            </p>
            <input
              className={inputClass}
              placeholder="Name / Company *"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
            />
            <select
              value={holderType}
              onChange={(e) => setHolderType(e.target.value)}
              className={`${inputClass} bg-[var(--bg)]`}
            >
              <option value="publisher">Publisher</option>
              <option value="label">Label</option>
              <option value="distributor">Distributor</option>
              <option value="artist">Artist / Manager</option>
              <option value="library">Production Library</option>
            </select>
            <input
              className={inputClass}
              placeholder="Contact email"
              value={holderEmail}
              onChange={(e) => setHolderEmail(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Contact phone"
              value={holderPhone}
              onChange={(e) => setHolderPhone(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Website"
              value={holderWebsite}
              onChange={(e) => setHolderWebsite(e.target.value)}
            />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Adding..." : "Add Rights Holder"}
            </button>
          </form>

          <div>
            <p className="font-display font-bold text-lg text-[var(--text)] mb-3">
              Rights Holders ({holders.length})
            </p>
            {holders.length === 0 ? (
              <p className="font-mono text-sm text-[var(--text-dim)]">
                No rights holders yet
              </p>
            ) : (
              <div className="space-y-2">
                {holders.map((h) => (
                  <div
                    key={h.id}
                    className="px-4 py-3 bg-[var(--surface)] rounded-lg"
                  >
                    <p className="font-mono text-sm text-[var(--text)]">
                      {h.name}
                      <span className="ml-2 text-xs text-[var(--text-dim)] bg-[var(--surface2)] px-2 py-0.5 rounded">
                        {h.type}
                      </span>
                    </p>
                    {(h.contact_email || h.contact_phone || h.website) && (
                      <p className="font-mono text-xs text-[var(--text-dim)] mt-1">
                        {[h.contact_email, h.contact_phone, h.website]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Requests Tab */}
      {tab === "search-requests" && (
        <div>
          <p className="font-display font-bold text-lg text-[var(--text)] mb-1">
            User Search Requests
          </p>
          <p className="font-mono text-xs text-[var(--text-dim)] mb-4">
            Songs users searched for — shows what to add to the database
          </p>
          {requests.length === 0 ? (
            <p className="font-mono text-sm text-[var(--text-dim)]">
              No search requests yet
            </p>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--surface)] rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-[var(--text)] truncate">
                      {r.song_title} — {r.artist}
                    </p>
                    <p className="font-mono text-xs text-[var(--text-dim)]">
                      {new Date(r.created_at).toLocaleDateString()} ·{" "}
                      {r.found_in_db ? "Found in DB" : "Not in DB"} · Source:{" "}
                      {r.source}
                    </p>
                  </div>
                  {!r.found_in_db && (
                    <button
                      onClick={() => {
                        setSongTitle(r.song_title);
                        setSongArtist(r.artist);
                        setTab("songs");
                      }}
                      className="shrink-0 font-mono text-xs text-[var(--info)] hover:opacity-70"
                    >
                      + Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CSV Import Tab */}
      {tab === "import" && (
        <div className="space-y-6 max-w-lg">
          <div>
            <p className="font-display font-bold text-lg text-[var(--text)] mb-2">
              Import CSV
            </p>
            <p className="font-mono text-xs text-[var(--text-dim)] leading-relaxed mb-4">
              Upload a CSV file to bulk import songs or rights holders. The
              importer auto-detects the type from headers.
            </p>

            <label
              className={`${btnClass} inline-block cursor-pointer ${
                uploading ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              {uploading ? "Importing..." : "Choose CSV File"}
              <input
                type="file"
                accept=".csv"
                onChange={handleCSV}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-mono text-sm font-medium text-[var(--text)] mb-1">
                Song CSV format
              </p>
              <pre className="font-mono text-xs text-[var(--text-dim)] bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
{`song_title,artist,master_owner,publisher,writer,isrc
"It Was a Good Day","Ice Cube","Priority Records","WB Music","O'Shea Jackson",""`}
              </pre>
            </div>
            <div>
              <p className="font-mono text-sm font-medium text-[var(--text)] mb-1">
                Rights Holder CSV format
              </p>
              <pre className="font-mono text-xs text-[var(--text-dim)] bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
{`name,type,contact_email,contact_phone,website
"Warner Chappell","publisher","licensing@warnerchappell.com","","warnerchappell.com"`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
