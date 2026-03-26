import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    let supabase;
    try {
      supabase = createServerClient();
    } catch {
      return NextResponse.json([]);
    }
    const { data, error } = await supabase
      .from("clearance_pipeline")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    console.error("Pipeline GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServerClient();
    const { error } = await supabase.from("clearance_pipeline").insert(body);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Pipeline POST error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const supabase = createServerClient();
    const { error } = await supabase
      .from("clearance_pipeline")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Pipeline PATCH error:", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const supabase = createServerClient();
    const { error } = await supabase
      .from("clearance_pipeline")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Pipeline DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
