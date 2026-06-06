import type { NameTld } from "./tlds";

export const MAX_PRICE_USD = 20;
export const MIN_PRICE_USD = 2;

export const VANITY_PREMIUM_LABELS = new Set([
  "poseidon",
  "trident",
  "atlantis",
  "neptune",
  "ocean",
  "abyss",
  "oracle",
  "pluto",
  "hades",
  "kraken",
  "nereid",
  "titan",
  "alpha",
  "omega",
  "btc",
  "eth",
  "tac",
]);

export interface PriceQuote {
  label: string;
  tld: NameTld;
  usd: number;
  tier: "vanity" | "premium" | "standard" | "economy";
  years: number;
}

export function quoteRegistration(
  label: string,
  tld: NameTld,
  years = 1,
): PriceQuote {
  const norm = label.toLowerCase();
  let usd: number;
  let tier: PriceQuote["tier"];

  if (VANITY_PREMIUM_LABELS.has(norm)) {
    usd = MAX_PRICE_USD;
    tier = "vanity";
  } else if (norm.length <= 2) {
    usd = MAX_PRICE_USD;
    tier = "premium";
  } else if (norm.length === 3) {
    usd = 15;
    tier = "premium";
  } else if (norm.length === 4) {
    usd = 10;
    tier = "standard";
  } else {
    usd = MIN_PRICE_USD;
    tier = "economy";
  }

  if (tld === "eth" || tld === "wei") {
    usd = Math.min(MAX_PRICE_USD, usd + 2);
  }

  usd = Math.min(MAX_PRICE_USD, Math.max(MIN_PRICE_USD, usd));

  return { label: norm, tld, usd: usd * years, tier, years };
}
