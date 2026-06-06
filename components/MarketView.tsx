"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNetworks } from "@/lib/network/context";
import { fetchAssets, fetchListings, type TacitAsset } from "@/lib/tacit/client";
import { Panel } from "./Panel";

export function MarketView({ focusAsset }: { focusAsset?: string }) {
  const { tact } = useNetworks();
  const [assets, setAssets] = useState<TacitAsset[]>([]);
  const [listings, setListings] = useState<Record<string, Awaited<ReturnType<typeof fetchListings>>>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    fetchAssets(tact)
      .then(async (list) => {
        if (cancelled) return;
        setAssets(list.slice(0, 16));
        const slice = list.slice(0, 8);
        const pairs = await Promise.all(
          slice.map(async (a) => [a.asset_id, await fetchListings(a.asset_id, tact)] as const),
        );
        if (!cancelled) setListings(Object.fromEntries(pairs));
      })
      .catch((e) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : "failed to load market");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tact]);

  if (loading) {
    return <Panel title="Market">Loading Tacit assets…</Panel>;
  }

  if (err) {
    return <Panel title="Market">Could not reach Tacit worker: {err}</Panel>;
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => {
        const highlighted = focusAsset === asset.asset_id;
        const assetListings = listings[asset.asset_id] ?? [];
        return (
          <Panel key={asset.asset_id} className={highlighted ? "border-[var(--pf-accent)]" : ""}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">{asset.ticker ?? asset.name ?? "Unknown"}</h2>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--pf-muted)]">
                  {asset.asset_id}
                </p>
              </div>
              <a
                href={`https://tacit.finance/?asset=${asset.asset_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs"
              >
                Trade on Tacit
              </a>
            </div>
            <div className="mt-4">
              {assetListings.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {assetListings.slice(0, 4).map((l) => (
                    <li
                      key={`${l.txid}-${l.vout}`}
                      className="flex justify-between border border-[var(--pf-border)] px-3 py-2"
                    >
                      <span>
                        {l.price_sats != null
                          ? `${(l.price_sats / 1e8).toFixed(8)} BTC`
                          : "OTC listing"}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--pf-muted)]">
                        {l.txid.slice(0, 10)}…
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--pf-muted)]">No listings indexed</p>
              )}
            </div>
          </Panel>
        );
      })}
      <p className="text-center text-xs text-[var(--pf-muted)]">
        Swaps run in{" "}
        <Link href="https://tacit.finance" className="text-[var(--pf-accent)] underline">
          tacit.finance
        </Link>
        . Poseidon surfaces discovery on {tact}.
      </p>
    </div>
  );
}
