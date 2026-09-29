"use client";

import { useEffect, useState } from "react";

export default function VouchersPage() {
  const [q,setQ]=useState(""); const [status,setStatus]=useState(""); const [rows,setRows]=useState<any[]>([]); const [error,setError]=useState("");
  async function load(){const r=await fetch(`/api/vouchers?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`);const d=await r.json();if(!r.ok)setError(d.error||"Failed");else{setError("");setRows(d.data||[]);}}
  useEffect(()=>{load()},[]);
  return <div className="card"><h2>Vouchers</h2>
    <div className="toolbar"><input placeholder="Voucher code or agent..." value={q} onChange={e=>setQ(e.target.value)}/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option>available</option><option>used</option></select><button className="btn primary" onClick={load}>Filter</button></div>
    {error&&<div className="error">{error}</div>}
    <div className="table-wrap"><table><thead><tr><th>Voucher</th><th>Agent</th><th>Package ID</th><th>Status</th><th>Used</th><th>Created</th></tr></thead>
    <tbody>{rows.map(x=><tr key={x.id}><td>{x.voucher_code}</td><td>{x.agent_id}</td><td>{x.package_id}</td><td><span className="badge">{x.status}</span></td><td>{x.used_at?new Date(x.used_at).toLocaleString():"—"}</td><td>{new Date(x.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>
  </div>;
}
