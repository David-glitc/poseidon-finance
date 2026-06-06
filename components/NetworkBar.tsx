"use client";

import { useNetworks } from "@/lib/network/context";

export function NetworkBar() {
  const { tact, eth, btc, setTact, setEth, setBtc } = useNetworks();

  return (
    <div className="panel flex flex-wrap items-center gap-4 px-4 py-3 text-xs">
      <span className="label">Networks</span>
      <label className="flex items-center gap-2">
        <span className="text-[var(--pf-muted)]">Tacit</span>
        <select className="input w-auto py-1" value={tact} onChange={(e) => setTact(e.target.value as "mainnet" | "signet")}>
          <option value="mainnet">Mainnet</option>
          <option value="signet">Signet</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-[var(--pf-muted)]">ETH</span>
        <select className="input w-auto py-1" value={eth} onChange={(e) => setEth(e.target.value as "mainnet" | "sepolia")}>
          <option value="mainnet">Mainnet</option>
          <option value="sepolia">Sepolia</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-[var(--pf-muted)]">BTC</span>
        <select className="input w-auto py-1" value={btc} onChange={(e) => setBtc(e.target.value as "mainnet" | "signet")}>
          <option value="mainnet">Mainnet</option>
          <option value="signet">Signet</option>
        </select>
      </label>
    </div>
  );
}
