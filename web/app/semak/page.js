"use client";

/**
 * Semak Pertalian — the free, no-signup kinship calculator.
 * This is the viral hook (app plan §6): everything runs in the browser,
 * nothing is sent to any server. The engine is the same tested module
 * from the prototype (31/31 tests).
 */

import { useMemo, useState } from "react";
import Kinship from "@/lib/kinship.js";
import Avatar from "@/lib/avatar.js";
import { sampleFamily } from "@/lib/sample-family.js";

export default function SemakPage() {
  const ids = useMemo(
    () =>
      Object.keys(sampleFamily.persons).sort((a, b) =>
        sampleFamily.persons[a].name.localeCompare(sampleFamily.persons[b].name)
      ),
    []
  );
  const [a, setA] = useState("daud");
  const [b, setB] = useState("faridah");

  const result = useMemo(() => {
    try {
      return Kinship.computeKinship(sampleFamily, a, b);
    } catch {
      return null;
    }
  }, [a, b]);

  const pa = sampleFamily.persons[a];
  const pb = sampleFamily.persons[b];

  // Avatar.svg is XSS-safe by design: no user text ever enters the SVG
  // (only enums, numbers and a hash) — see lib/avatar.js header.
  const avA = useMemo(() => Avatar.svg({ id: a, ...pa }), [a, pa]);
  const avB = useMemo(() => Avatar.svg({ id: b, ...pb }), [b, pb]);

  return (
    <div>
      <h1>Semak Pertalian</h1>
      <p>
        Pilih dua orang daripada keluarga contoh lima generasi ini — lihat apa
        mereka patut panggil satu sama lain. Dalam app penuh, ini berjalan atas
        salasilah keluarga anda sendiri.
      </p>

      <div className="card">
        <div className="pick-row">
          <div>
            <label htmlFor="pilih-a">Orang pertama</label>
            <select id="pilih-a" value={a} onChange={(e) => setA(e.target.value)}>
              {ids.map((id) => (
                <option key={id} value={id}>
                  {sampleFamily.persons[id].name} ({sampleFamily.persons[id].birthYear})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pilih-b">Orang kedua</label>
            <select id="pilih-b" value={b} onChange={(e) => setB(e.target.value)}>
              {ids.map((id) => (
                <option key={id} value={id}>
                  {sampleFamily.persons[id].name} ({sampleFamily.persons[id].birthYear})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="card result">
          <div className="avatars">
            <div className="avatar-box">
              <div dangerouslySetInnerHTML={{ __html: avA }} />
              <div className="nama">{pa.name}</div>
            </div>
            <div className="arrowline">⇄</div>
            <div className="avatar-box">
              <div dangerouslySetInnerHTML={{ __html: avB }} />
              <div className="nama">{pb.name}</div>
            </div>
          </div>
          <p>
            {pa.name} panggil {pb.name}:
            <br />
            <span className="label">{result.aCallsB.label}</span>
            <br />
            <span className="pang">Panggilan: {result.aCallsB.panggilan}</span>
          </p>
          <p>
            {pb.name} panggil {pa.name}:
            <br />
            <span className="label">{result.bCallsA.label}</span>
            <br />
            <span className="pang">Panggilan: {result.bCallsA.panggilan}</span>
          </p>
        </div>
      )}

      <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.9rem" }}>
        Semua kiraan berlaku dalam pelayar anda. Tiada data dihantar.
      </p>
    </div>
  );
}
