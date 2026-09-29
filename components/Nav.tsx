"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Nav() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const links = [
    ["/dashboard", "Dashboard"],
    ["/dashboard/agents", "Agents"],
    ["/dashboard/transactions", "Transactions"],
    ["/dashboard/packages", "Packages"],
    ["/dashboard/vouchers", "Vouchers"],
  ];

  return (
    <div className="header">
      <div>
        <h1 style={{margin:"0 0 4px"}}>Zone Data Admin</h1>
        <div className="muted small">Administration console</div>
      </div>
      <div className="nav">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className={path === href ? "active" : ""}>{label}</Link>
        ))}
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
