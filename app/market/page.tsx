import Link from "next/link";
import { fetchAssets, fetchListings } from "@/lib/tacit/client";

export const revalidate = 45;

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string }>;
}) {
  const { asset: focusAsset } = await searchParams;
  const assets = await fetchAssets("mainnet").catch(() => []);

  const listingsByAsset = await Promise.all(
    assets.slice(0, 12).map(async (a) => ({
      asset: a,
      listings: await fetchListings(a.asset_id).catch(() => []),
    })),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Token Market</h1>
        <p className="mt-2 text-white/50">
          Tacit assets with live listings — open in tacit.finance to trade with
          confidential amounts.
        </p>
      </div>

      <div className="grid gap-4">
        {listingsByAsset.map(({ asset, listings }) => {
          const highlighted = focusAsset === asset.asset_id;
          return (
            <article
              key={asset.asset_id}
              className={`glass p-5 ${highlighted ? "ring-1 ring-coral/40" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {asset.ticker ?? asset.name ?? "Unknown"}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-white/40">
                    {asset.asset_id}
                  </p>
                  {asset.supply_kind && (
                    <span className="mt-2 inline-block rounded-full bg-coral/10 px-2 py-0.5 text-[10px] uppercase text-coral">
                      {asset.supply_kind}
                    </span>
                  )}
                </div>
                <a
                  href={`https://tacit.finance/?asset=${asset.asset_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-foam/30 px-4 py-2 text-sm text-foam hover:bg-foam/10"
                >
                  Trade on Tacit →
                </a>
              </div>
              <div className="mt-4">
                {listings.length > 0 ? (
                  <ul className="space-y-2">
                    {listings.slice(0, 5).map((l) => (
                      <li
                        key={`${l.txid}-${l.vout}`}
                        className="flex items-center justify-between rounded-lg bg-abyss/50 px-3 py-2 text-sm"
                      >
                        <span className="text-white/70">
                          {l.price_sats != null
                            ? `${(l.price_sats / 1e8).toFixed(8)} BTC`
                            : "OTC listing"}
                        </span>
                        <span className="font-mono text-xs text-white/30">
                          {l.txid.slice(0, 10)}…
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-white/40">No active listings</p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-center text-sm text-white/40">
        Deep swaps &amp; AMM batches run in{" "}
        <Link href="https://tacit.finance" className="text-foam underline">
          tacit.finance
        </Link>
        . Poseidon surfaces discovery and routing.
      </p>
    </div>
  );
}
