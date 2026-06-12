"use client";

/**
 * /admin — Layer 1 of the monitoring dashboard (docs/OPERATIONS.md §1).
 * Shows product metrics from our own database. Until real auth lands,
 * the stats API is protected by ADMIN_STATS_TOKEN (paste it below —
 * it is kept in this browser tab only, never stored).
 */

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState(null);

  async function load(tok) {
    setErr(null);
    try {
      const r = await fetch("/api/admin/stats", {
        headers: tok ? { "x-admin-token": tok } : {},
        cache: "no-store",
      });
      if (r.status === 401) { setErr("Token salah."); setStats(null); return; }
      setStats(await r.json());
    } catch {
      setErr("Gagal memuat statistik.");
    }
  }

  useEffect(() => { load(""); }, []);

  return (
    <div>
      <h1>Papan Pemuka Penjaga</h1>

      {stats && !stats.live && (
        <div className="demo-flag">
          {stats.note || "Mod demo — sambungkan Supabase untuk angka sebenar."}
        </div>
      )}

      <div style={{ margin: "12px 0" }}>
        <input
          type="password"
          placeholder="Admin token (jika ditetapkan)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", marginRight: 8 }}
        />
        <button className="btn" onClick={() => load(token)}>Muat semula</button>
      </div>

      {err && <p style={{ color: "#b91c1c" }}>{err}</p>}

      {stats && (
        <div className="stat-grid">
          <div className="stat"><div className="num">{stats.users ?? "—"}</div><div className="lab">Pengguna berdaftar</div></div>
          <div className="stat"><div className="num">{stats.trees ?? "—"}</div><div className="lab">Pokok keluarga</div></div>
          <div className="stat"><div className="num">{stats.persons ?? "—"}</div><div className="lab">Rekod individu</div></div>
          <div className="stat"><div className="num">{stats.memberships ?? stats.activatedFamilies ?? "—"}</div><div className="lab">Keahlian / keluarga aktif</div></div>
          <div className="stat"><div className="num">{stats.signups7d ?? "—"}</div><div className="lab">Daftar 7 hari</div></div>
          <div className="stat"><div className="num">{stats.treesOver50 ?? "—"}</div><div className="lab">Pokok ≥ 50 orang</div></div>
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <strong>Lapisan lain</strong> (docs/OPERATIONS.md): PostHog — corong &
        ralat · Supabase dashboard — DB & auth · Vercel — deploy & latency ·
        <code> /api/health</code> — denyut sistem untuk Jaga.
      </div>
    </div>
  );
}
