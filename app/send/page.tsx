"use client";

import { useState } from "react";
import { resolveTactName } from "@/lib/tact-names/verify";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";

export default function SendPage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    eth?: string;
    btc?: string;
    tacit?: string;
  } | null>(null);

  async function resolve() {
    const label = normalizeLabel(name);
    if (!isValidLabel(label)) {
      setResult("Invalid .tact name");
      return;
    }
    const res = await resolveTactName(label);
    if (!res.registration) {
      setResult("Name not found");
      setTarget(null);
      return;
    }
    setTarget({
      eth: res.registration.records.eth,
      btc: res.registration.records.btc,
      tacit: res.registration.records.tacit_shielded,
    });
    setResult(
      res.verified
        ? `Verified (${res.source}) — choose destination below`
        : `Resolved from ${res.source} — verify before sending`,
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Send to .tact</h1>
        <p className="mt-2 text-white/50">
          Resolve a name to ETH, BTC, or Tacit shielded destination.
        </p>
      </div>
      <div className="glass space-y-4 p-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="recipient.tact"
          className="w-full rounded-xl border border-white/10 bg-abyss px-4 py-3 text-white"
        />
        <button
          type="button"
          onClick={resolve}
          className="w-full rounded-xl bg-coral py-3 text-sm font-semibold text-abyss"
        >
          Resolve
        </button>
        {result && <p className="text-sm text-white/60">{result}</p>}
        {target && (
          <div className="space-y-2 text-sm">
            {target.tacit && (
              <a
                href={`https://tacit.finance/?send=${encodeURIComponent(target.tacit)}`}
                className="block rounded-lg border border-foam/20 p-3 hover:bg-foam/5"
              >
                Tacit shielded → open tacit.finance
              </a>
            )}
            {target.eth && (
              <div className="rounded-lg bg-abyss/60 p-3 font-mono text-xs">
                ETH {target.eth}
              </div>
            )}
            {target.btc && (
              <div className="rounded-lg bg-abyss/60 p-3 font-mono text-xs">
                BTC {target.btc}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
