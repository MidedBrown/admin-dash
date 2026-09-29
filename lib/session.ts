import crypto from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabaseAdmin";

const COOKIE = "zone_admin_session";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createAdminSession() {
  const token = crypto.randomBytes(48).toString("hex");
  const hours = Number(process.env.ADMIN_SESSION_HOURS || "12");
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000);

  const { error } = await supabaseAdmin.from("admin_sessions").insert({
    session_token_hash: sha256(token),
    expires_at: expires.toISOString()
  });

  if (error) throw new Error(error.message);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const hash = sha256(token);
  const { data, error } = await supabaseAdmin
    .from("admin_sessions")
    .select("id, expires_at, revoked_at")
    .eq("session_token_hash", hash)
    .maybeSingle();

  if (error || !data) return null;
  if (data.revoked_at) return null;
  if (new Date(data.expires_at).getTime() <= Date.now()) return null;

  return data;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function revokeAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await supabaseAdmin
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("session_token_hash", sha256(token));
  }
  jar.delete(COOKIE);
}
