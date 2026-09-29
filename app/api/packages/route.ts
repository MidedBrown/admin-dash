import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/session";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin.from("packages")
      .select("id,agent_id,package_name,price_in_pesewas,created_at")
      .order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
