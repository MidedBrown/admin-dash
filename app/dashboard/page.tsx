"use client";

import { useEffect, useState } from "react";

type Stats = {
  agents:number; lockedAgents:number; packages:number; transactions:number;
  todayTransactions:number; successfulToday:number; todayRevenuePesewas:number;
  vouchersAvailable:number; vouchersUsed:number;
};

const money = (p:number) => `GH₵ ${(p/100).toFixed(2)}`;

export default function Dashboard() {
  const [s, setS] = useState<Stats|null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/dashboard").then(r=>r.json()).then(d=>d.error ? setError(d.error) : setS(d)).catch(e=>setError(e.message));
  }, []);
  if (error) return <div className="error">{error}</div>;
  if (!s) return <div className="card">Loading dashboard...</div>;

  const cards = [
    ["Agents", s.agents], ["Locked Agents", s.lockedAgents],
    ["Packages", s.packages], ["Transactions", s.transactions],
    ["Today's Transactions", s.todayTransactions], ["Successful Today", s.successfulToday],
    ["Today's Revenue", money(s.todayRevenuePesewas)],
    ["Available Vouchers", s.vouchersAvailable]
  ];

  return <>
    <div className="grid grid-4">
      {cards.map(([label,value]) => <div className="card" key={String(label)}>
        <div className="muted small">{label}</div><div className="metric">{value}</div>
      </div>)}
    </div>
    <div className="grid grid-2" style={{marginTop:16}}>
      <div className="card"><h2>Voucher inventory</h2><p>Available: <b>{s.vouchersAvailable}</b></p><p>Used: <b>{s.vouchersUsed}</b></p></div>
      <div className="card"><h2>Admin security</h2><p className="muted">Admin access is handled server-side. The Supabase service-role key never reaches the browser.</p></div>
    </div>
  </>;
}
