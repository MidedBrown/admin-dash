"use client";

import { useEffect, useState } from "react";

export default function AgentsPage() {
  const [q,setQ]=useState(""); const [rows,setRows]=useState<any[]>([]); const [error,setError]=useState("");
  async function load() {
    const r=await fetch(`/api/agents?q=${encodeURIComponent(q)}`); const d=await r.json();
    if(!r.ok) setError(d.error||"Failed"); else {setError("");setRows(d.data||[]);}
  }
  useEffect(()=>{load()},[]);
  return <div className="card">
    <div className="header"><div><h2>Agents</h2><div className="muted small">Up to 500 most recent records</div></div></div>
    <div className="toolbar"><input placeholder="Search agent, phone, terminal..." value={q} onChange={e=>setQ(e.target.value)} /><button className="btn primary" onClick={load}>Search</button></div>
    {error&&<div className="error">{error}</div>}
    <div className="table-wrap"><table><thead><tr><th>Agent</th><th>Name</th><th>Phone</th><th>Terminal</th><th>Wallet</th><th>Status</th><th>Created</th></tr></thead>
    <tbody>{rows.map(x=><tr key={x.id}><td>{x.agent_id}</td><td>{x.agent_name}</td><td>{x.phone||"—"}</td><td>{x.terminal_id||"—"}</td><td>GH₵ {Number(x.wallet_balance||0).toFixed(2)}</td><td><span className="badge">{x.account_locked?"Locked":"Active"}</span></td><td>{new Date(x.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>
  </div>;
}
