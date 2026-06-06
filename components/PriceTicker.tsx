import { fetchPrices } from "@/lib/pricing/coingecko";

export async function PriceTicker() {
  const prices = await fetchPrices(["BTC", "ETH"]);
  return (
    <div className="flex flex-wrap gap-3">
      {prices.map((p) => (
        <div
          key={p.symbol}
          className="rounded-2xl border border-white/10 bg-depth/60 px-4 py-3 backdrop-blur"
        >
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            {p.symbol}
          </div>
          <div className="font-display text-lg font-semibold text-white">
            ${p.usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          {p.change24h != null && (
            <div
              className={`text-xs ${p.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}
            >
              {p.change24h >= 0 ? "+" : ""}
              {p.change24h.toFixed(2)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
