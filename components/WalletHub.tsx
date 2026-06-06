"use client";

import { useEffect, useState } from "react";
import { useBtcWallet, useEthWallet } from "@/lib/wallet/provider";
import { useNetworks } from "@/lib/network/context";
import {
  TACIT_DAPP_URL,
  clearTacitLink,
  getTacitWalletMeta,
  markTacitLinked,
} from "@/lib/tacit/wallet-store";
import { Panel } from "./Panel";

export function WalletHub() {
  const { address, isConnected, connect, connectors, disconnect } = useEthWallet();
  const { btcAddress, connectBtc, disconnectBtc } = useBtcWallet();
  const { tact, eth, btc } = useNetworks();
  const [tacitMeta, setTacitMeta] = useState<ReturnType<typeof getTacitWalletMeta>>(null);
  const [btcBusy, setBtcBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setTacitMeta(getTacitWalletMeta(tact));
  }, [tact]);

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
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title={`Ethereum · ${eth}`}>
        {isConnected && address ? (
          <>
            <p className="break-all font-[family-name:var(--font-mono)] text-xs">{address}</p>
            <button type="button" className="btn-outline mt-4 w-full" onClick={() => disconnect()}>
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect ETH
          </button>
        )}
      </Panel>

      <Panel title={`Bitcoin · ${btc}`}>
        <p className="mb-3 text-xs text-[var(--pf-muted)]">sats-connect — pick wallet in browser extension</p>
        {btcAddress ? (
          <>
            <p className="break-all font-[family-name:var(--font-mono)] text-xs">{btcAddress}</p>
            <button type="button" className="btn-outline mt-4 w-full" onClick={disconnectBtc}>
              Disconnect
            </button>
          </>
        ) : (
          <button type="button" className="btn-primary w-full" onClick={connectSats} disabled={btcBusy}>
            {btcBusy ? "Connecting…" : "Connect BTC"}
          </button>
        )}
      </Panel>

      <Panel title={`Tacit · ${tact}`}>
        {tacitMeta?.hasKey ? (
          <>
            <p className="text-sm">Linked to {tact}</p>
            <button
              type="button"
              className="btn-outline mt-4 w-full"
              onClick={() => {
                clearTacitLink(tact);
                setTacitMeta(null);
              }}
            >
              Clear link
            </button>
          </>
        ) : (
          <a
            href={TACIT_DAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary block text-center"
            onClick={() => markTacitLinked(tact)}
          >
            Open Tacit wallet
          </a>
        )}
      </Panel>
      {err && <p className="text-sm text-red-400 lg:col-span-3">{err}</p>}
    </div>
  );
}
