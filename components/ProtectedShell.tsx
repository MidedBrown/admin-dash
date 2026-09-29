import { redirect } from "next/navigation";
import { getAdminSession } from "../lib/session";
import Nav from "./Nav";

export default async function ProtectedShell({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  return <main className="container"><Nav />{children}</main>;
}
