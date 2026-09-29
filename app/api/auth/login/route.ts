import { NextResponse } from "next/server";
import { createAdminSession } from "../../../../lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body.username || "");
    const password = String(body.password || "");
    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "";

    if (!expectedPass || username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ error: "Invalid administrator credentials." }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login service error." }, { status: 500 });
  }
}
