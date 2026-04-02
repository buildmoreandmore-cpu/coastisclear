import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV must have a header row and at least one data row" },
        { status: 400 }
      );
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = values[i]?.trim() || "";
      });
      return row;
    });

    // Detect import type from headers
    const isSongImport = headers.some((h) =>
      ["song_title", "title", "song"].includes(h)
    );
    const isRightsHolderImport = headers.some((h) =>
      ["name", "company", "rights_holder"].includes(h)
    );

    if (isSongImport) {
      const songs = rows.map((r) => ({
        song_title: r.song_title || r.title || r.song || "",
        artist: r.artist || r.original_artist || "",
        master_owner: r.master_owner || r.master || "",
        publisher: r.publisher || "",
        writer: r.writer || r.writers || "",
        isrc: r.isrc || "",
        notes: r.notes || "",
      })).filter((s) => s.song_title && s.artist);

      if (songs.length === 0) {
        return NextResponse.json(
          { error: "No valid song rows found. Ensure 'song_title' and 'artist' columns exist." },
          { status: 400 }
        );
      }

      const { error } = await supabase.from("song_ownership").insert(songs);
      if (error) throw error;

      return NextResponse.json({
        success: true,
        type: "songs",
        count: songs.length,
      });
    }

    if (isRightsHolderImport) {
      const holders = rows.map((r) => ({
        name: r.name || r.company || r.rights_holder || "",
        type: r.type || "publisher",
        contact_email: r.contact_email || r.email || "",
        contact_phone: r.contact_phone || r.phone || "",
        website: r.website || "",
        notes: r.notes || "",
      })).filter((h) => h.name);

      if (holders.length === 0) {
        return NextResponse.json(
          { error: "No valid rights holder rows found. Ensure 'name' column exists." },
          { status: 400 }
        );
      }

      const { error } = await supabase.from("rights_holders").insert(holders);
      if (error) throw error;

      return NextResponse.json({
        success: true,
        type: "rights_holders",
        count: holders.length,
      });
    }

    return NextResponse.json(
      { error: "Could not detect import type. Use headers like 'song_title, artist' for songs or 'name, type' for rights holders." },
      { status: 400 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 500 }
    );
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
