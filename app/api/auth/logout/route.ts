import { NextResponse } from "next/server";
import { revokeAdminSession } from "../../../../lib/session";

export async function POST() {
  await revokeAdminSession();
  return NextResponse.json({ ok: true });
}
