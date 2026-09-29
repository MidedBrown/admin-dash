"use client";

import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [q,setQ]=useState(""); const [status,setStatus]=useState(""); const [rows,setRows]=useState<any[]>([]); const [error,setError]=useState("");
  async function load() {
    const r=await fetch(`/api/transactions?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`); const d=await r.json();
    if(!r.ok) setError(d.error||"Failed"); else {setError("");setRows(d.data||[]);}
  }
  useEffect(()=>{load()},[]);
  return <div className="card">
    <h2>Transactions</h2>
    <div className="toolbar"><input placeholder="Paystack ref, agent, phone, voucher..." value={q} onChange={e=>setQ(e.target.value)} />
    <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option>success</option><option>pending</option><option>failed</option><option>unmatched</option><option>out_of_stock</option></select>
    <button className="btn primary" onClick={load}>Filter</button></div>
    {error&&<div className="error">{error}</div>}
    <div className="table-wrap"><table><thead><tr><th>Date</th><th>Paystack Ref</th><th>Agent</th><th>Customer</th><th>Amount</th><th>Voucher</th><th>Status</th><th>SMS</th></tr></thead>
    <tbody>{rows.map(x=><tr key={x.id}><td>{new Date(x.created_at).toLocaleString()}</td><td>{x.paystack_ref}</td><td>{x.agent_id}</td><td>{x.customer_phone}</td><td>GH₵ {(Number(x.amount_paid)/100).toFixed(2)}</td><td>{x.voucher_code||"—"}</td><td><span className="badge">{x.status}</span></td><td>{x.sms_status}</td></tr>)}</tbody></table></div>
  </div>;
}
