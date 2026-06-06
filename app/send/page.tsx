"use client";

import { useState } from "react";
import { RESOLVE_TLDS, type NameTld } from "@/lib/names/tlds";
import { useNetworks } from "@/lib/network/context";
import { Panel } from "@/components/Panel";

export default function SendPage() {
  const { eth } = useNetworks();
  const [label, setLabel] = useState("");
  const [tld, setTld] = useState<NameTld>("tact");
  const [result, setResult] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    eth?: string;
    btc?: string;
    tacit?: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  async function resolve() {
    setBusy(true);
    setResult(null);
    setTarget(null);
    try {
      const res = await fetch(
        `/api/names/resolve?label=${encodeURIComponent(label)}&tld=${tld}&ethNetwork=${eth}`,
      );
      const data = await res.json();
      if (!data.found) {
        setResult(`${label}.${tld} not registered`);
        return;
      }
      setTarget({
        eth: data.records.eth,
        btc: data.records.btc,
        tacit: data.records.tacit_shielded,
      });
      setResult(
        data.verified
          ? `Resolved via ${data.source} — pick a destination`
          : `Resolved (${data.source}) — verify before sending`,
      );
    } catch {
      setResult("Lookup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Send by name</h1>
        <p className="mt-2 text-sm text-[var(--pf-muted)]">
          Resolve any supported TLD to an ETH, BTC, or Tacit destination. Registration is only for{" "}
          <strong className="text-[var(--pf-text)]">.tact</strong>.
        </p>
      </div>
      <Panel>
        <div className="flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="recipient"
            className="input flex-1"
          />
          <select className="input w-28" value={tld} onChange={(e) => setTld(e.target.value as NameTld)}>
            {RESOLVE_TLDS.map((t) => (
              <option key={t.tld} value={t.tld}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={resolve} disabled={busy} className="btn-primary mt-4 w-full">
          {busy ? "Resolving…" : "Resolve"}
        </button>
        {result && <p className="mt-3 text-sm text-[var(--pf-muted)]">{result}</p>}
        {target && (
          <div className="mt-4 space-y-2 text-sm">
            {target.tacit && (
              <a
                href={`https://tacit.finance/?send=${encodeURIComponent(target.tacit)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[var(--pf-border)] p-3 hover:border-[var(--pf-accent)]"
              >
                Tacit shielded → open tacit.finance
              </a>
            )}
            {target.eth && (
              <div className="border border-[var(--pf-border)] p-3 font-[family-name:var(--font-mono)] text-xs">
                EVM {target.eth}
              </div>
            )}
            {target.btc && (
              <div className="border border-[var(--pf-border)] p-3 font-[family-name:var(--font-mono)] text-xs">
                BTC {target.btc}
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
