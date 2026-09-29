import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/session";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const params = new URL(req.url).searchParams;
    const q = params.get("q")?.trim() || "";
    const status = params.get("status")?.trim() || "";
    let query = supabaseAdmin.from("transactions")
      .select("id,paystack_ref,agent_id,package_id,customer_phone,amount_paid,voucher_code,sms_status,status,created_at")
      .order("created_at", { ascending: false }).limit(500);

    if (status) query = query.eq("status", status);
    if (q) query = query.or(`paystack_ref.ilike.%${q}%,agent_id.ilike.%${q}%,customer_phone.ilike.%${q}%,voucher_code.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
