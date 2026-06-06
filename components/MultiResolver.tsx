"use client";

import { useState } from "react";
import Link from "next/link";
import { RESOLVE_TLDS, type NameTld } from "@/lib/names/tlds";
import { useNetworks } from "@/lib/network/context";
import { Panel } from "./Panel";

interface ResolvePayload {
  qualified: string;
  tld: NameTld;
  found: boolean;
  verified: boolean;
  source: string;
  records: { eth?: string; btc?: string; tacit_shielded?: string };
}

export function MultiResolver({ compact = false }: { compact?: boolean }) {
  const { eth } = useNetworks();
  const [label, setLabel] = useState("");
  const [tld, setTld] = useState<NameTld>("tact");
  const [result, setResult] = useState<ResolvePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function resolve() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(
        `/api/names/resolve?label=${encodeURIComponent(label)}&tld=${tld}&ethNetwork=${eth}`,
      );
      if (!res.ok) throw new Error("resolve failed");
      setResult(await res.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "resolve failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const meta = RESOLVE_TLDS.find((t) => t.tld === tld);

  return (
    <Panel title={compact ? "Resolve" : "Name resolver"}>
      <p className="mb-4 text-sm text-[var(--pf-muted)]">
        Look up <strong className="text-[var(--pf-text)]">.tact</strong> (registry),{" "}
        <strong className="text-[var(--pf-text)]">.eth</strong> /{" "}
        <strong className="text-[var(--pf-text)]">.wei</strong> (EVM),{" "}
        <strong className="text-[var(--pf-text)]">.btc</strong> (handles).
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="input flex-1"
          placeholder="alice"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <select className="input sm:w-32" value={tld} onChange={(e) => setTld(e.target.value as NameTld)}>
          {RESOLVE_TLDS.map((t) => (
            <option key={t.tld} value={t.tld}>
              {t.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={resolve} disabled={loading}>
          {loading ? "…" : "Resolve"}
        </button>
      </div>
      {meta && !meta.registerable && (
        <p className="mt-2 text-xs text-[var(--pf-muted)]">{meta.description}</p>
      )}
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
      {result && (
        <div className="mt-4 border border-[var(--pf-border)] p-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{result.qualified}</span>
            <span className="border border-[var(--pf-border)] px-2 py-0.5 text-[10px] uppercase">
              {result.found ? "found" : "available"}
            </span>
            {result.found && (
              <span className="text-[10px] text-[var(--pf-muted)]">{result.source}</span>
            )}
          </div>
          {result.found && (
            <dl className="mt-3 space-y-1 font-[family-name:var(--font-mono)] text-xs">
              {result.records.eth && (
                <div>
                  <dt className="inline text-[var(--pf-muted)]">eth </dt>
                  <dd className="inline break-all">{result.records.eth}</dd>
                </div>
              )}
              {result.records.btc && (
                <div>
                  <dt className="inline text-[var(--pf-muted)]">btc </dt>
                  <dd className="inline break-all">{result.records.btc}</dd>
                </div>
              )}
              {result.records.tacit_shielded && (
                <div>
                  <dt className="inline text-[var(--pf-muted)]">tacit </dt>
                  <dd className="inline break-all">{result.records.tacit_shielded}</dd>
                </div>
              )}
            </dl>
          )}
          {!result.found && tld === "tact" && (
            <Link href="/names" className="mt-3 inline-block text-[var(--pf-accent)] underline">
              Register .tact →
            </Link>
          )}
        </div>
      )}
    </Panel>
  );
}
