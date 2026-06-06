"use client";

import { useEffect, useState } from "react";
import { useBtcWallet, useEthWallet } from "@/lib/wallet/provider";
import {
  TACIT_DAPP_URL,
  clearTacitLink,
  getTacitWalletMeta,
  markTacitLinked,
  type TacitNetwork,
} from "@/lib/tacit/wallet-store";
import { GlassCard } from "./GlassCard";

export function WalletHub() {
  const { address, isConnected, connect, connectors, disconnect } = useEthWallet();
  const { btcAddress, disconnectBtc } = useBtcWallet();
  const [tacitMeta, setTacitMeta] = useState<ReturnType<typeof getTacitWalletMeta>>(null);
  const [network, setNetwork] = useState<TacitNetwork>("mainnet");
  const [btcBusy, setBtcBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setTacitMeta(getTacitWalletMeta(network));
  }, [network]);

  const { connectBtc } = useBtcWallet();

  async function connectSats() {
    setBtcBusy(true);
    setErr(null);
    try {
      await connectBtc();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "BTC connect failed");
    } finally {
      setBtcBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <GlassCard className="p-6">
        <h3 className="text-sm uppercase tracking-wider text-sky-400/70">Ethereum</h3>
        <p className="mt-2 text-xs text-sky-200/45">Name payments · .wei · .eth bridge</p>
        {isConnected && address ? (
          <>
            <p className="mt-4 break-all font-mono text-sm text-sky-100">{address}</p>
            <button type="button" className="btn-ghost mt-4 w-full" onClick={() => disconnect()}>
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary mt-4 w-full"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect ETH
          </button>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm uppercase tracking-wider text-sky-400/70">Bitcoin</h3>
        <p className="mt-2 text-xs text-sky-200/45">sats-connect · Xverse / Leather / OKX</p>
        {btcAddress ? (
          <>
            <p className="mt-4 break-all font-mono text-sm text-sky-100">{btcAddress}</p>
            <button type="button" className="btn-ghost mt-4 w-full" onClick={disconnectBtc}>
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary mt-4 w-full"
            onClick={connectSats}
            disabled={btcBusy}
          >
            {btcBusy ? "Connecting…" : "Connect BTC (sats-connect)"}
          </button>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-sm uppercase tracking-wider text-sky-400/70">Tacit wallet</h3>
        <p className="mt-2 text-xs text-sky-200/45">Confidential balances · AMM · mixer</p>
        <select
          className="input-glass mt-4"
          value={network}
          onChange={(e) => setNetwork(e.target.value as TacitNetwork)}
        >
          <option value="mainnet">Mainnet</option>
          <option value="signet">Signet</option>
        </select>
        {tacitMeta?.hasKey ? (
          <>
            <p className="mt-4 text-sm text-emerald-300">Linked to {network}</p>
            <button
              type="button"
              className="btn-ghost mt-4 w-full"
              onClick={() => {
                clearTacitLink(network);
                setTacitMeta(null);
              }}
            >
              Clear link flag
            </button>
          </>
        ) : (
          <a
            href={TACIT_DAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 block text-center"
            onClick={() => markTacitLinked(network)}
          >
            Open Tacit · create / import key
          </a>
        )}
      </GlassCard>
      {err && <p className="text-sm text-rose-300 lg:col-span-3">{err}</p>}
    </div>
  );
}
