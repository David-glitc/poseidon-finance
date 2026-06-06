"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNetworks } from "@/lib/network/context";
import { fetchAssets, fetchPools } from "@/lib/tacit/client";
import { Panel } from "./Panel";

export function DashboardStats() {
  const { tact } = useNetworks();
  const [assets, setAssets] = useState(0);
  const [pools, setPools] = useState(0);
  const [featured, setFeatured] = useState<{ asset_id: string; ticker?: string; name?: string }[]>([]);

  useEffect(() => {
    Promise.all([fetchAssets(tact), fetchPools(tact)])
      .then(([a, p]) => {
        setAssets(a.length);
        setPools(p.length);
        setFeatured(a.slice(0, 6));
      })
      .catch(() => {
        setAssets(0);
        setPools(0);
        setFeatured([]);
      });
  }, [tact]);

  return (
    <>
      <section className="grid gap-px border border-[var(--pf-border)] bg-[var(--pf-border)] md:grid-cols-3">
        <div className="bg-[var(--pf-surface)] p-5">
          <div className="text-2xl font-semibold">{assets}</div>
          <div className="text-xs text-[var(--pf-muted)]">Assets · {tact}</div>
        </div>
        <div className="bg-[var(--pf-surface)] p-5">
          <div className="text-2xl font-semibold">{pools}</div>
          <div className="text-xs text-[var(--pf-muted)]">AMM pools</div>
        </div>
        <div className="bg-[var(--pf-surface)] p-5">
          <div className="text-2xl font-semibold">.tact</div>
          <div className="text-xs text-[var(--pf-muted)]">Register on Poseidon</div>
        </div>
      </section>
      {featured.length > 0 && (
        <Panel title="Assets">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <Link
                key={a.asset_id}
                href={`/market?asset=${a.asset_id}`}
                className="border border-[var(--pf-border)] p-3 text-sm hover:border-[var(--pf-accent)]"
              >
                <div className="font-medium">{a.ticker ?? a.name ?? a.asset_id.slice(0, 8)}</div>
                <div className="mt-1 truncate font-[family-name:var(--font-mono)] text-xs text-[var(--pf-muted)]">
                  {a.asset_id}
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}
