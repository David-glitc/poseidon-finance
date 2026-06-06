"use client";

import { useState } from "react";
import Link from "next/link";
import { TLDS, type NameTld } from "@/lib/names/tlds";
import { GlassCard } from "./GlassCard";

interface ResolvePayload {
  qualified: string;
  tld: NameTld;
  found: boolean;
  verified: boolean;
  source: string;
  records: {
    eth?: string;
    btc?: string;
    tacit_shielded?: string;
  };
}

export function MultiResolver() {
  const [label, setLabel] = useState("");
  const [tld, setTld] = useState<NameTld>("tact");
  const [result, setResult] = useState<ResolvePayload | null>(null);
  const [loading, setLoading] = useState(false);

  async function resolve() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/names/resolve?label=${encodeURIComponent(label)}&tld=${tld}`,
      );
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard strong className="p-6 md:p-8">
      <h2 className="font-display text-xl font-semibold text-sky-100">
        Multi-chain resolver
      </h2>
      <p className="mt-2 text-sm text-sky-200/50">
        .tact · .btc · .wei · .eth — one search, chain-native lookup
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          className="input-glass flex-1"
          placeholder="alice"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <select
          className="input-glass sm:w-36"
          value={tld}
          onChange={(e) => setTld(e.target.value as NameTld)}
        >
          {Object.values(TLDS).map((t) => (
            <option key={t.tld} value={t.tld}>
              {t.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={resolve} disabled={loading}>
          {loading ? "…" : "Resolve"}
        </button>
      </div>
      {result && (
        <div className="mt-6 rounded-2xl border border-sky-400/15 bg-black/30 p-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sky-100">{result.qualified}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                result.found
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-500/20 text-slate-300"
              }`}
            >
              {result.found ? "registered" : "available"}
            </span>
            {result.found && (
              <span className="text-[10px] text-sky-300/50">{result.source}</span>
            )}
          </div>
          {result.found && (
            <dl className="mt-3 space-y-1 font-mono text-xs text-sky-200/70">
              {result.records.eth && (
                <div>
                  <dt className="inline text-sky-400/60">eth </dt>
                  <dd className="inline break-all">{result.records.eth}</dd>
                </div>
              )}
              {result.records.btc && (
                <div>
                  <dt className="inline text-sky-400/60">btc </dt>
                  <dd className="inline break-all">{result.records.btc}</dd>
                </div>
              )}
              {result.records.tacit_shielded && (
                <div>
                  <dt className="inline text-sky-400/60">tacit </dt>
                  <dd className="inline break-all">{result.records.tacit_shielded}</dd>
                </div>
              )}
            </dl>
          )}
          {!result.found && (tld === "tact" || tld === "btc") && (
            <Link href="/names" className="mt-3 inline-block text-sky-300 underline">
              Register on Poseidon →
            </Link>
          )}
        </div>
      )}
    </GlassCard>
  );
}
