import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("nda_acceptances")
      .select("*")
      .order("accepted_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServerClient();
    const { error } = await supabase.from("nda_acceptances").insert({
      full_name: body.name,
      accepted_at: body.acceptedAt,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("NDA save error:", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
