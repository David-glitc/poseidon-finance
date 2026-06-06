import Link from "next/link";
import { PriceTicker } from "@/components/PriceTicker";
import { MultiResolver } from "@/components/MultiResolver";
import { GlassCard } from "@/components/GlassCard";
import { fetchAssets, fetchPools } from "@/lib/tacit/client";

export const revalidate = 60;

export default async function DashboardPage() {
  const [assets, pools] = await Promise.all([
    fetchAssets("mainnet").catch(() => []),
    fetchPools("mainnet").catch(() => []),
  ]);

  return (
    <div className="space-y-10">
      <section className="glass-strong rounded-3xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.25em] text-sky-400/70">
          Poseidon Finance
        </p>
        <h1 className="glow-text mt-3 font-display text-4xl font-bold md:text-5xl">
          Liquid glass DeFi on Tacit
        </h1>
        <p className="mt-4 max-w-2xl text-sky-200/50">
          Multi-resolver for <span className="text-sky-200">.tact</span>,{" "}
          <span className="text-sky-200">.btc</span>,{" "}
          <span className="text-sky-200">.wei</span>, and{" "}
          <span className="text-sky-200">.eth</span>. Confidential AMM swaps, names from $2,
          vanity set capped at $20.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/swap" className="btn-primary">
            Open Swap
          </Link>
          <Link href="/names" className="btn-ghost">
            Register a name
          </Link>
          <Link href="/wallet" className="btn-ghost">
            Connect wallets
          </Link>
        </div>
      </section>

      <MultiResolver />

      <section>
        <h2 className="mb-4 text-sm uppercase tracking-wider text-sky-400/40">
          Live prices
        </h2>
        <PriceTicker />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-5">
          <div className="text-3xl font-bold text-sky-200">{assets.length}</div>
          <div className="text-sm text-sky-200/40">Tacit assets indexed</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-3xl font-bold text-sky-300">{pools.length}</div>
          <div className="text-sm text-sky-200/40">AMM pools</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-3xl font-bold text-sky-100">4</div>
          <div className="text-sm text-sky-200/40">TLDs · tact wei eth btc</div>
        </GlassCard>
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-display text-lg font-semibold text-sky-100">Featured assets</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.slice(0, 6).map((a) => (
            <Link
              key={a.asset_id}
              href={`/market?asset=${a.asset_id}`}
              className="rounded-2xl border border-sky-400/10 bg-black/30 p-4 transition hover:border-sky-400/35"
            >
              <div className="font-medium text-sky-100">
                {a.ticker ?? a.name ?? a.asset_id.slice(0, 8)}
              </div>
              <div className="mt-1 truncate text-xs text-sky-400/40">
                {a.asset_id}
              </div>
            </Link>
          ))}
          {assets.length === 0 && (
            <p className="text-sm text-sky-300/40">Worker unreachable — retry later.</p>
          )}
        </div>
      </section>
    </div>
  );
}
