"use client";

import { useState } from "react";
import Link from "next/link";
import { useBtcWallet, useEthWallet } from "@/lib/wallet/provider";

export function WalletBar() {
  const { address, isConnected, connect, connectors, disconnect } = useEthWallet();
  const { btcAddress, connectBtc, disconnectBtc } = useBtcWallet();
  const [btcBusy, setBtcBusy] = useState(false);

  async function onConnectBtc() {
    setBtcBusy(true);
    try {
      await connectBtc();
    } finally {
      setBtcBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isConnected && address ? (
        <button
          type="button"
          onClick={() => disconnect()}
          className="rounded-full border border-sky-400/30 bg-black/40 px-3 py-1.5 text-xs text-sky-200 hover:border-sky-300"
        >
          ETH {address.slice(0, 6)}…{address.slice(-4)}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => connect({ connector: connectors[0] })}
          className="rounded-full bg-sky-400/20 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-400/30"
        >
          Connect ETH
        </button>
      )}
      {btcAddress ? (
        <button
          type="button"
          onClick={disconnectBtc}
          className="rounded-full border border-sky-300/25 bg-black/40 px-3 py-1.5 text-xs text-sky-100 hover:border-sky-200"
        >
          BTC {btcAddress.slice(0, 6)}…{btcAddress.slice(-4)}
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnectBtc}
          disabled={btcBusy}
          className="rounded-full border border-sky-300/20 px-3 py-1.5 text-xs text-sky-200/90 hover:border-sky-200/50 disabled:opacity-50"
        >
          {btcBusy ? "…" : "Connect BTC"}
        </button>
      )}
      <Link
        href="/wallet"
        className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-sky-200 sm:inline"
      >
        Wallets
      </Link>
    </div>
  );
}
