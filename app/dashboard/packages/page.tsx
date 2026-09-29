"use client";

import { useEffect, useState } from "react";

export default function PackagesPage() {
  const [rows,setRows]=useState<any[]>([]); const [error,setError]=useState("");
  useEffect(()=>{fetch("/api/packages").then(r=>r.json()).then(d=>d.error?setError(d.error):setRows(d.data||[])).catch(e=>setError(e.message));},[]);
  return <div className="card"><h2>Packages</h2><p className="muted small">Read-only initial dashboard view.</p>
    {error&&<div className="error">{error}</div>}
    <div className="table-wrap"><table><thead><tr><th>Package</th><th>Agent</th><th>Price</th><th>Created</th></tr></thead>
    <tbody>{rows.map(x=><tr key={x.id}><td>{x.package_name}</td><td>{x.agent_id}</td><td>GH₵ {(Number(x.price_in_pesewas)/100).toFixed(2)}</td><td>{new Date(x.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>
  </div>;
}
