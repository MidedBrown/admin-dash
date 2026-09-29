import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/session";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    await requireAdmin();

    const [
      agents, locked, packages, transactions, vouchersAvailable, vouchersUsed
    ] = await Promise.all([
      supabaseAdmin.from("agents").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("agents").select("id", { count: "exact", head: true }).eq("account_locked", true),
      supabaseAdmin.from("packages").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("transactions").select("id, amount_paid, status, created_at").order("created_at", { ascending: false }).limit(1000),
      supabaseAdmin.from("vouchers").select("id", { count: "exact", head: true }).eq("status", "available"),
      supabaseAdmin.from("vouchers").select("id", { count: "exact", head: true }).eq("status", "used")
    ]);

    if (transactions.error) throw new Error(transactions.error.message);

    const today = new Date();
    today.setHours(0,0,0,0);
    const todayRows = (transactions.data || []).filter(t => new Date(t.created_at) >= today);
    const successful = todayRows.filter(t => t.status === "success");
    const revenuePesewas = successful.reduce((sum, t) => sum + Number(t.amount_paid || 0), 0);

    return NextResponse.json({
      agents: agents.count || 0,
      lockedAgents: locked.count || 0,
      packages: packages.count || 0,
      transactions: transactions.data?.length || 0,
      todayTransactions: todayRows.length,
      successfulToday: successful.length,
      todayRevenuePesewas: revenuePesewas,
      vouchersAvailable: vouchersAvailable.count || 0,
      vouchersUsed: vouchersUsed.count || 0
    });
  } catch (e: any) {
    const status = e.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? "Unauthorized" : e.message }, { status });
  }
}
