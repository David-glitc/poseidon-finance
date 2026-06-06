export interface PriceQuote {
  symbol: string;
  usd: number;
  change24h?: number;
}

const IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  TAC: "bitcoin",
};

export async function fetchPrices(
  symbols: string[] = ["BTC", "ETH"],
): Promise<PriceQuote[]> {
  const ids = [...new Set(symbols.map((s) => IDS[s] ?? s.toLowerCase()))].join(
    ",",
  );
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    { next: { revalidate: 120 } },
  );
  if (!res.ok) return symbols.map((s) => ({ symbol: s, usd: 0 }));
  const data = await res.json();
  return symbols.map((symbol) => {
    const id = IDS[symbol] ?? symbol.toLowerCase();
    const row = data[id];
    return {
      symbol,
      usd: row?.usd ?? 0,
      change24h: row?.usd_24h_change,
    };
  });
}
