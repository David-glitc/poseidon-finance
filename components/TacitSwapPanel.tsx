"use client";

import { useEffect, useState } from "react";
import { useNetworks } from "@/lib/network/context";
import { fetchPools } from "@/lib/tacit/client";
import { tacitSwapUrl } from "@/lib/tacit/wallet-store";
import { Panel } from "./Panel";

interface PoolRow {
  pool_id?: string;
  asset_a?: string;
  asset_b?: string;
  reserve_a?: string;
  reserve_b?: string;
}

export function TacitSwapPanel() {
  const { tact } = useNetworks();
  const [pools, setPools] = useState<PoolRow[]>([]);
  const [selected, setSelected] = useState<PoolRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPools(tact)
      .then((list) => {
        const rows = list.slice(0, 12);
        setPools(rows);
        setSelected(rows[0] ?? null);
      })
      .catch(() => {
        setPools([]);
        setSelected(null);
      })
      .finally(() => setLoading(false));
  }, [tact]);

  const swapHref = selected
    ? tacitSwapUrl(selected.pool_id, selected.asset_a, selected.asset_b)
    : tacitSwapUrl();

  return (
    <Panel title={`AMM · ${tact}`}>
      <p className="mb-4 text-sm text-[var(--pf-muted)]">
        Pool data from the Tacit indexer. Proofs and settlement happen in the Tacit wallet.
      </p>
      {loading ? (
        <p className="text-sm text-[var(--pf-muted)]">Loading pools…</p>
      ) : pools.length === 0 ? (
        <p className="text-sm text-[var(--pf-muted)]">No pools on {tact}.</p>
      ) : (
        <>
          <label className="label">Pool</label>
          <select
            className="input mt-1"
            value={selected?.pool_id ?? ""}
            onChange={(e) => setSelected(pools.find((p) => p.pool_id === e.target.value) ?? null)}
          >
            {pools.map((p) => (
              <option key={p.pool_id} value={p.pool_id}>
                {(p.asset_a ?? "?").slice(0, 8)} / {(p.asset_b ?? "?").slice(0, 8)}
              </option>
            ))}
          </select>
          {selected && (
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="border border-[var(--pf-border)] p-3">
                <div className="text-[var(--pf-muted)]">Reserve A</div>
                <div className="mt-1 font-[family-name:var(--font-mono)]">{selected.reserve_a ?? "—"}</div>
              </div>
              <div className="border border-[var(--pf-border)] p-3">
                <div className="text-[var(--pf-muted)]">Reserve B</div>
                <div className="mt-1 font-[family-name:var(--font-mono)]">{selected.reserve_b ?? "—"}</div>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <a href={swapHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Open in Tacit wallet
            </a>
            <a href="https://tacit.finance" target="_blank" rel="noopener noreferrer" className="btn-outline">
              Full dApp
            </a>
          </div>
        </>
      )}
    </Panel>
  );
}
