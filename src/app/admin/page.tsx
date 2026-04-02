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
  master_contact?: string;
  master_email?: string;
  publisher_name?: string;
  publisher_admin?: string;
  publisher_contact?: string;
  publisher?: { name: string } | null;
  label?: { name: string } | null;
  writer?: string;
  isrc?: string;
  notes?: string;
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

  // Edit states
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [editSong, setEditSong] = useState({ song_title: "", artist: "", master_owner: "", master_contact: "", master_email: "", publisher_name: "", publisher_admin: "", writer: "", isrc: "", notes: "" });
  const [emailModal, setEmailModal] = useState<{ to: string; subject: string; body: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [editingHolderId, setEditingHolderId] = useState<string | null>(null);
  const [editHolder, setEditHolder] = useState({ name: "", type: "", contact_email: "", contact_phone: "", website: "" });
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editRequest, setEditRequest] = useState({ song_title: "", artist: "", source: "" });

  useEffect(() => {
    const supabase = getAuthClient();
    if (!supabase) { router.push("/login"); return; }
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email;
      if (email && ADMIN_EMAILS.includes(email)) setAuthorized(true);
      else router.push("/search");
      setChecking(false);
    });
  }, [router]);

  // Song form
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songMaster, setSongMaster] = useState("");
  const [songMasterContact, setSongMasterContact] = useState("");
  const [songMasterEmail, setSongMasterEmail] = useState("");
  const [songPublisher, setSongPublisher] = useState("");
  const [songPublisherAdmin, setSongPublisherAdmin] = useState("");
  const [songWriter, setSongWriter] = useState("");
  const [songIsrc, setSongIsrc] = useState("");

  // Rights holder form
  const [holderName, setHolderName] = useState("");
  const [holderType, setHolderType] = useState("publisher");
  const [holderEmail, setHolderEmail] = useState("");
  const [holderPhone, setHolderPhone] = useState("");
  const [holderWebsite, setHolderWebsite] = useState("");

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
    fetchSongs(); fetchHolders(); fetchRequests();
  }, [fetchSongs, fetchHolders, fetchRequests]);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // Song CRUD
  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle || !songArtist) return;
    setLoading(true);
    const res = await fetch("/api/admin/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_title: songTitle, artist: songArtist,
        master_owner: songMaster || null, master_contact: songMasterContact || null,
        master_email: songMasterEmail || null, publisher_name: songPublisher || null,
        publisher_admin: songPublisherAdmin || null, writer: songWriter || null, isrc: songIsrc || null,
      }),
    });
    if (res.ok) {
      flash("Song added");
      setSongTitle(""); setSongArtist(""); setSongMaster(""); setSongMasterContact("");
      setSongMasterEmail(""); setSongPublisher(""); setSongPublisherAdmin("");
      setSongWriter(""); setSongIsrc("");
      fetchSongs();
    } else { const d = await res.json(); flash(d.error || "Failed"); }
    setLoading(false);
  };

  const startEditSong = (s: Song) => {
    setEditingSongId(s.id);
    setEditSong({
      song_title: s.song_title, artist: s.artist,
      master_owner: s.master_owner || "", master_contact: s.master_contact || "",
      master_email: s.master_email || "", publisher_name: s.publisher_name || "",
      publisher_admin: s.publisher_admin || "", writer: s.writer || "",
      isrc: s.isrc || "", notes: s.notes || "",
    });
  };

  const saveEditSong = async () => {
    if (!editingSongId) return;
    const res = await fetch("/api/admin/songs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingSongId, ...editSong }),
    });
    if (res.ok) { flash("Song updated"); setEditingSongId(null); fetchSongs(); }
    else { const d = await res.json(); flash(d.error || "Failed"); }
  };

  const deleteSong = async (id: string) => {
    if (!confirm("Delete this song?")) return;
    const res = await fetch("/api/admin/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { flash("Song deleted"); fetchSongs(); }
  };

  // Rights holder CRUD
  const addHolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName) return;
    setLoading(true);
    const res = await fetch("/api/admin/rights-holders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: holderName, type: holderType,
        contact_email: holderEmail || null, contact_phone: holderPhone || null, website: holderWebsite || null,
      }),
    });
    if (res.ok) {
      flash("Rights holder added");
      setHolderName(""); setHolderEmail(""); setHolderPhone(""); setHolderWebsite("");
      fetchHolders();
    } else { const d = await res.json(); flash(d.error || "Failed"); }
    setLoading(false);
  };

  const startEditHolder = (h: RightsHolder) => {
    setEditingHolderId(h.id);
    setEditHolder({
      name: h.name, type: h.type,
      contact_email: h.contact_email || "", contact_phone: h.contact_phone || "", website: h.website || "",
    });
  };

  const saveEditHolder = async () => {
    if (!editingHolderId) return;
    const res = await fetch("/api/admin/rights-holders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingHolderId, ...editHolder }),
    });
    if (res.ok) { flash("Rights holder updated"); setEditingHolderId(null); fetchHolders(); }
    else { const d = await res.json(); flash(d.error || "Failed"); }
  };

  const deleteHolder = async (id: string) => {
    if (!confirm("Delete this rights holder?")) return;
    const res = await fetch("/api/admin/rights-holders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) { flash("Rights holder deleted"); fetchHolders(); }
  };

  const sendEmail = async () => {
    if (!emailModal) return;
    setSendingEmail(true);
    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailModal),
    });
    if (res.ok) { flash("Email sent"); setEmailModal(null); }
    else { const d = await res.json(); flash(d.error || "Failed to send"); }
    setSendingEmail(false);
  };

  const handleCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/import", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) {
      flash(`Imported ${data.count} ${data.type === "songs" ? "songs" : "rights holders"}`);
      fetchSongs(); fetchHolders();
    } else { flash(data.error || "Import failed"); }
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
  const editInputClass =
    "w-full bg-[var(--bg)] border-b border-[var(--border-active)] outline-none font-mono text-xs text-[var(--text)] placeholder:text-[var(--text-dim)] py-1";
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

      {message && (
        <div className="mb-4 px-4 py-2 bg-[var(--surface)] border border-[var(--border-active)] rounded-lg font-mono text-sm text-[var(--text)]">
          {message}
        </div>
      )}

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
            <p className="font-display font-bold text-lg text-[var(--text)]">Add Song</p>
            <input className={inputClass} placeholder="Song title *" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
            <input className={inputClass} placeholder="Artist *" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} />
            <input className={inputClass} placeholder="Master owner (label)" value={songMaster} onChange={(e) => setSongMaster(e.target.value)} />
            <input className={inputClass} placeholder="Master contact dept" value={songMasterContact} onChange={(e) => setSongMasterContact(e.target.value)} />
            <input className={inputClass} placeholder="Master phone/email" value={songMasterEmail} onChange={(e) => setSongMasterEmail(e.target.value)} />
            <input className={inputClass} placeholder="Publisher name" value={songPublisher} onChange={(e) => setSongPublisher(e.target.value)} />
            <input className={inputClass} placeholder="Publisher admin" value={songPublisherAdmin} onChange={(e) => setSongPublisherAdmin(e.target.value)} />
            <input className={inputClass} placeholder="Writer(s)" value={songWriter} onChange={(e) => setSongWriter(e.target.value)} />
            <input className={inputClass} placeholder="ISRC" value={songIsrc} onChange={(e) => setSongIsrc(e.target.value)} />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Adding..." : "Add Song"}
            </button>
          </form>

          <div>
            <p className="font-display font-bold text-lg text-[var(--text)] mb-3">
              Songs in Database ({songs.length})
            </p>
            {songs.length === 0 ? (
              <p className="font-mono text-sm text-[var(--text-dim)]">No songs yet</p>
            ) : (
              <div className="space-y-2">
                {songs.map((s) => (
                  <div key={s.id} className="px-4 py-3 bg-[var(--surface)] rounded-lg">
                    {editingSongId === s.id ? (
                      <div className="space-y-2">
                        <input className={editInputClass} placeholder="Song title" value={editSong.song_title} onChange={(e) => setEditSong({ ...editSong, song_title: e.target.value })} />
                        <input className={editInputClass} placeholder="Artist" value={editSong.artist} onChange={(e) => setEditSong({ ...editSong, artist: e.target.value })} />
                        <input className={editInputClass} placeholder="Master owner" value={editSong.master_owner} onChange={(e) => setEditSong({ ...editSong, master_owner: e.target.value })} />
                        <input className={editInputClass} placeholder="Master contact dept" value={editSong.master_contact} onChange={(e) => setEditSong({ ...editSong, master_contact: e.target.value })} />
                        <input className={editInputClass} placeholder="Master phone/email" value={editSong.master_email} onChange={(e) => setEditSong({ ...editSong, master_email: e.target.value })} />
                        <input className={editInputClass} placeholder="Publisher name" value={editSong.publisher_name} onChange={(e) => setEditSong({ ...editSong, publisher_name: e.target.value })} />
                        <input className={editInputClass} placeholder="Publisher admin" value={editSong.publisher_admin} onChange={(e) => setEditSong({ ...editSong, publisher_admin: e.target.value })} />
                        <input className={editInputClass} placeholder="Writer(s)" value={editSong.writer} onChange={(e) => setEditSong({ ...editSong, writer: e.target.value })} />
                        <input className={editInputClass} placeholder="ISRC" value={editSong.isrc} onChange={(e) => setEditSong({ ...editSong, isrc: e.target.value })} />
                        <textarea className={`${editInputClass} resize-none`} rows={2} placeholder="Notes" value={editSong.notes} onChange={(e) => setEditSong({ ...editSong, notes: e.target.value })} />
                        <div className="flex gap-3 pt-1">
                          <button onClick={saveEditSong} className="font-mono text-xs text-[var(--success)] hover:opacity-70">Save</button>
                          <button onClick={() => setEditingSongId(null)} className="font-mono text-xs text-[var(--text-dim)] hover:opacity-70">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="min-w-0">
                          <p className="font-mono text-sm text-[var(--text)]">
                            {s.song_title} — {s.artist}
                          </p>
                          <p className="font-mono text-xs text-[var(--text-dim)] mt-0.5">
                            {[
                              s.master_owner && `Master: ${s.master_owner}`,
                              s.publisher_name && `Pub: ${s.publisher_name}`,
                              s.writer && `Writer: ${s.writer}`,
                            ].filter(Boolean).join(" · ") || "No ownership info"}
                          </p>
                          {(s.master_email || s.master_contact) && (
                            <p className="font-mono text-xs text-[var(--info)] mt-0.5">
                              {[s.master_contact, s.master_email].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          {s.notes && (
                            <p className="font-mono text-xs text-[var(--text-dim)] mt-0.5 italic">{s.notes.slice(0, 120)}{s.notes.length > 120 ? "..." : ""}</p>
                          )}
                        </div>
                        <div className="flex gap-3 shrink-0">
                          {s.master_email && s.master_email.includes("@") && (
                            <button onClick={() => {
                              const email = s.master_email!.split("|").find(p => p.includes("@"))?.trim() || s.master_email!;
                              setEmailModal({ to: email, subject: `Sample Clearance Inquiry — "${s.song_title}" by ${s.artist}`, body: "" });
                            }} className="font-mono text-xs text-[var(--success)] hover:opacity-70">Email</button>
                          )}
                          <button onClick={() => startEditSong(s)} className="font-mono text-xs text-[var(--info)] hover:opacity-70">Edit</button>
                          <button onClick={() => deleteSong(s.id)} className="font-mono text-xs text-[var(--danger)] hover:opacity-70">Delete</button>
                        </div>
                      </div>
                    )}
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
            <p className="font-display font-bold text-lg text-[var(--text)]">Add Rights Holder</p>
            <input className={inputClass} placeholder="Name / Company *" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
            <select value={holderType} onChange={(e) => setHolderType(e.target.value)} className={`${inputClass} bg-[var(--bg)]`}>
              <option value="publisher">Publisher</option>
              <option value="label">Label</option>
              <option value="both">Both (Label + Publisher)</option>
              <option value="distributor">Distributor</option>
              <option value="artist">Artist / Manager</option>
              <option value="library">Production Library</option>
            </select>
            <input className={inputClass} placeholder="Contact email" value={holderEmail} onChange={(e) => setHolderEmail(e.target.value)} />
            <input className={inputClass} placeholder="Contact phone" value={holderPhone} onChange={(e) => setHolderPhone(e.target.value)} />
            <input className={inputClass} placeholder="Website" value={holderWebsite} onChange={(e) => setHolderWebsite(e.target.value)} />
            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "Adding..." : "Add Rights Holder"}
            </button>
          </form>

          <div>
            <p className="font-display font-bold text-lg text-[var(--text)] mb-3">
              Rights Holders ({holders.length})
            </p>
            {holders.length === 0 ? (
              <p className="font-mono text-sm text-[var(--text-dim)]">No rights holders yet</p>
            ) : (
              <div className="space-y-2">
                {holders.map((h) => (
                  <div key={h.id} className="px-4 py-3 bg-[var(--surface)] rounded-lg">
                    {editingHolderId === h.id ? (
                      <div className="space-y-2">
                        <input className={editInputClass} placeholder="Name" value={editHolder.name} onChange={(e) => setEditHolder({ ...editHolder, name: e.target.value })} />
                        <select value={editHolder.type} onChange={(e) => setEditHolder({ ...editHolder, type: e.target.value })} className={`${editInputClass} bg-[var(--bg)]`}>
                          <option value="publisher">Publisher</option>
                          <option value="label">Label</option>
                          <option value="both">Both</option>
                          <option value="distributor">Distributor</option>
                          <option value="artist">Artist / Manager</option>
                          <option value="library">Production Library</option>
                        </select>
                        <input className={editInputClass} placeholder="Contact email" value={editHolder.contact_email} onChange={(e) => setEditHolder({ ...editHolder, contact_email: e.target.value })} />
                        <input className={editInputClass} placeholder="Contact phone" value={editHolder.contact_phone} onChange={(e) => setEditHolder({ ...editHolder, contact_phone: e.target.value })} />
                        <input className={editInputClass} placeholder="Website" value={editHolder.website} onChange={(e) => setEditHolder({ ...editHolder, website: e.target.value })} />
                        <div className="flex gap-3 pt-1">
                          <button onClick={saveEditHolder} className="font-mono text-xs text-[var(--success)] hover:opacity-70">Save</button>
                          <button onClick={() => setEditingHolderId(null)} className="font-mono text-xs text-[var(--text-dim)] hover:opacity-70">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-mono text-sm text-[var(--text)]">
                            {h.name}
                            <span className="ml-2 text-xs text-[var(--text-dim)] bg-[var(--surface2)] px-2 py-0.5 rounded">{h.type}</span>
                          </p>
                          {(h.contact_email || h.contact_phone || h.website) && (
                            <p className="font-mono text-xs text-[var(--text-dim)] mt-1">
                              {[h.contact_email, h.contact_phone, h.website].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3 shrink-0">
                          {h.contact_email && (
                            <button onClick={() => setEmailModal({ to: h.contact_email!, subject: `Sample Clearance Inquiry — ${h.name}`, body: "" })} className="font-mono text-xs text-[var(--success)] hover:opacity-70">Email</button>
                          )}
                          <button onClick={() => startEditHolder(h)} className="font-mono text-xs text-[var(--info)] hover:opacity-70">Edit</button>
                          <button onClick={() => deleteHolder(h.id)} className="font-mono text-xs text-[var(--danger)] hover:opacity-70">Delete</button>
                        </div>
                      </div>
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
          <p className="font-display font-bold text-lg text-[var(--text)] mb-1">User Search Requests</p>
          <p className="font-mono text-xs text-[var(--text-dim)] mb-4">Songs users searched for — shows what to add to the database</p>
          {requests.length === 0 ? (
            <p className="font-mono text-sm text-[var(--text-dim)]">No search requests yet</p>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div key={r.id} className="bg-[var(--surface)] rounded-lg overflow-hidden">
                  {editingRequestId === r.id ? (
                    <div className="px-4 py-3 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-mono text-xs text-[var(--text-dim)] block mb-1">Song Title</label>
                          <input value={editRequest.song_title} onChange={(e) => setEditRequest({ ...editRequest, song_title: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-sm text-[var(--text)]" />
                        </div>
                        <div>
                          <label className="font-mono text-xs text-[var(--text-dim)] block mb-1">Artist</label>
                          <input value={editRequest.artist} onChange={(e) => setEditRequest({ ...editRequest, artist: e.target.value })} className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-sm text-[var(--text)]" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await fetch("/api/admin/search-requests", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: r.id, ...editRequest }),
                            });
                            setEditingRequestId(null);
                            fetchRequests();
                          }}
                          className="px-3 py-1.5 bg-[var(--accent)] text-[var(--bg)] font-mono text-xs rounded hover:opacity-80"
                        >
                          Save
                        </button>
                        <button onClick={() => setEditingRequestId(null)} className="px-3 py-1.5 border border-[var(--border)] text-[var(--text-dim)] font-mono text-xs rounded hover:opacity-80">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-mono text-sm text-[var(--text)] truncate">{r.song_title} — {r.artist}</p>
                        <p className="font-mono text-xs text-[var(--text-dim)]">
                          {new Date(r.created_at).toLocaleDateString()} · {r.found_in_db ? "Found in DB" : "Not in DB"} · Source: {r.source}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {!r.found_in_db && (
                          <button
                            onClick={() => { setSongTitle(r.song_title); setSongArtist(r.artist); setTab("songs"); }}
                            className="font-mono text-xs text-[var(--info)] hover:opacity-70"
                          >
                            + Add
                          </button>
                        )}
                        <button
                          onClick={() => { setEditingRequestId(r.id); setEditRequest({ song_title: r.song_title, artist: r.artist, source: r.source }); }}
                          className="font-mono text-xs text-[var(--text-dim)] hover:text-[var(--text)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Delete search request "${r.song_title}"?`)) return;
                            await fetch(`/api/admin/search-requests?id=${r.id}`, { method: "DELETE" });
                            fetchRequests();
                          }}
                          className="font-mono text-xs text-[var(--danger)] hover:opacity-70"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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
            <p className="font-display font-bold text-lg text-[var(--text)] mb-2">Import CSV</p>
            <p className="font-mono text-xs text-[var(--text-dim)] leading-relaxed mb-4">
              Upload a CSV file to bulk import songs or rights holders. The importer auto-detects the type from headers.
            </p>
            <label className={`${btnClass} inline-block cursor-pointer ${uploading ? "opacity-40 pointer-events-none" : ""}`}>
              {uploading ? "Importing..." : "Choose CSV File"}
              <input type="file" accept=".csv" onChange={handleCSV} className="hidden" />
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-mono text-sm font-medium text-[var(--text)] mb-1">Song CSV format</p>
              <pre className="font-mono text-xs text-[var(--text-dim)] bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
{`song_title,artist,master_owner,publisher,writer,isrc
"It Was a Good Day","Ice Cube","Priority Records","WB Music","O'Shea Jackson",""`}
              </pre>
            </div>
            <div>
              <p className="font-mono text-sm font-medium text-[var(--text)] mb-1">Rights Holder CSV format</p>
              <pre className="font-mono text-xs text-[var(--text-dim)] bg-[var(--surface)] p-3 rounded-lg overflow-x-auto">
{`name,type,contact_email,contact_phone,website
"Warner Chappell","publisher","licensing@warnerchappell.com","","warnerchappell.com"`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Email compose modal */}
      {emailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEmailModal(null)}>
          <div className="bg-[var(--bg)] border border-[var(--border-active)] rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-display font-bold text-lg text-[var(--text)] mb-4">Compose Email</p>
            <div className="space-y-3">
              <div>
                <label className="font-mono text-xs text-[var(--text-dim)]">To</label>
                <input className={inputClass} value={emailModal.to} onChange={(e) => setEmailModal({ ...emailModal, to: e.target.value })} />
              </div>
              <div>
                <label className="font-mono text-xs text-[var(--text-dim)]">Subject</label>
                <input className={inputClass} value={emailModal.subject} onChange={(e) => setEmailModal({ ...emailModal, subject: e.target.value })} />
              </div>
              <div>
                <label className="font-mono text-xs text-[var(--text-dim)]">Body</label>
                <textarea className={`${inputClass} resize-none`} rows={8} placeholder="Write your message..." value={emailModal.body} onChange={(e) => setEmailModal({ ...emailModal, body: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={sendEmail} disabled={sendingEmail || !emailModal.body} className={btnClass}>
                  {sendingEmail ? "Sending..." : "Send Email"}
                </button>
                <button onClick={() => setEmailModal(null)} className="font-mono text-sm text-[var(--text-dim)] hover:text-[var(--text)]">Cancel</button>
              </div>
              <p className="font-mono text-xs text-[var(--text-dim)]">Sent from: noreply@clearthewax.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
