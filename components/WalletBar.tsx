"use client";

import { useState } from "react";
import Link from "next/link";
import { useBtcWallet, useEthWallet } from "@/lib/wallet/provider";

export function WalletBar() {
  const { address, isConnected, connect, connectors, disconnect } = useEthWallet();
  const { btcAddress, connectBtc, disconnectBtc } = useBtcWallet();
  const [btcBusy, setBtcBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onBtc() {
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
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center gap-2">
        {isConnected && address ? (
          <button type="button" onClick={() => disconnect()} className="btn-outline text-xs">
            ETH {address.slice(0, 6)}…{address.slice(-4)}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => connect({ connector: connectors[0] })}
            className="btn-primary text-xs"
          >
            ETH
          </button>
        )}
        {btcAddress ? (
          <button type="button" onClick={disconnectBtc} className="btn-outline text-xs">
            BTC {btcAddress.slice(0, 6)}…{btcAddress.slice(-4)}
          </button>
        ) : (
          <button type="button" onClick={onBtc} disabled={btcBusy} className="btn-outline text-xs disabled:opacity-50">
            {btcBusy ? "…" : "BTC"}
          </button>
        )}
        <Link href="/wallet" className="btn-outline hidden text-xs sm:inline">
          Hub
        </Link>
      </div>
      {err && <p className="max-w-[220px] text-right text-[10px] text-red-400">{err}</p>}
    </div>
  );
}
