import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/session";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const q = new URL(req.url).searchParams.get("q")?.trim() || "";
    let query = supabaseAdmin.from("agents")
      .select("id,user_id,agent_id,agent_name,phone,terminal_id,wallet_balance,login_failed_attempts,account_locked,account_locked_at,account_locked_reason,created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (q) query = query.or(`agent_id.ilike.%${q}%,agent_name.ilike.%${q}%,phone.ilike.%${q}%,terminal_id.ilike.%${q}%`);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
