"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { tacitSwapUrl } from "@/lib/tacit/wallet-store";

interface PoolRow {
  pool_id?: string;
  asset_a?: string;
  asset_b?: string;
  reserve_a?: string;
  reserve_b?: string;
}

const WORKER = "https://tacit-pin.rosscampbell9.workers.dev";

export function TacitSwapPanel() {
  const [pools, setPools] = useState<PoolRow[]>([]);
  const [selected, setSelected] = useState<PoolRow | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${WORKER}/pools`)
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.pools ?? [];
        setPools(list.slice(0, 12));
        setSelected(list[0] ?? null);
      })
      .catch(() => setPools([]))
      .finally(() => setLoading(false));
  }, []);

  const swapHref = selected
    ? tacitSwapUrl(
        selected.pool_id,
        selected.asset_a,
        selected.asset_b,
      )
    : tacitSwapUrl();

  return (
    <GlassCard strong className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-sky-100">
            Confidential AMM
          </h2>
          <p className="mt-1 text-sm text-sky-200/50">
            Pool discovery here — Groth16 swap proofs run in tacit.finance wallet
          </p>
        </div>
        <span className="pf-float text-3xl opacity-60">ψ</span>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-sky-300/40">Loading pools…</p>
      ) : pools.length === 0 ? (
        <p className="mt-8 text-sm text-sky-300/40">No pools returned from worker.</p>
      ) : (
        <>
          <label className="mt-6 block text-xs uppercase tracking-wider text-sky-400/60">
            Pool
          </label>
          <select
            className="input-glass mt-2"
            value={selected?.pool_id ?? ""}
            onChange={(e) => {
              const p = pools.find((x) => x.pool_id === e.target.value);
              setSelected(p ?? null);
            }}
          >
            {pools.map((p) => (
              <option key={p.pool_id} value={p.pool_id}>
                {(p.asset_a ?? "?").slice(0, 8)} / {(p.asset_b ?? "?").slice(0, 8)}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-xs uppercase tracking-wider text-sky-400/60">
            Amount (preview)
          </label>
          <input
            className="input-glass mt-2"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {selected && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-sky-300/60">
              <div className="rounded-xl bg-black/25 p-3">
                Reserve A
                <div className="mt-1 font-mono text-sky-100">
                  {selected.reserve_a ?? "—"}
                </div>
              </div>
              <div className="rounded-xl bg-black/25 p-3">
                Reserve B
                <div className="mt-1 font-mono text-sky-100">
                  {selected.reserve_b ?? "—"}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={swapHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Open swap in Tacit wallet
            </a>
            <a
              href="https://tacit.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Full dApp
            </a>
          </div>
          <p className="mt-4 text-xs text-sky-400/40">
            Tacit swaps use Pedersen commitments + Groth16 batch proofs. Connect your
            in-browser Tacit key on tacit.finance, then return here for discovery.
          </p>
        </>
      )}
    </GlassCard>
  );
}
