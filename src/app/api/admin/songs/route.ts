import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("song_ownership")
      .select("*, publisher:publisher_id(name), label:label_id(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("song_ownership")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to add song" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from("song_ownership")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update song" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient();
    const { id } = await request.json();

    const { error } = await supabase
      .from("song_ownership")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
