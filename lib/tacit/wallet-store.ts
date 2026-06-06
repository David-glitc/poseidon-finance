export type TacitNetwork = "mainnet" | "signet";

const KEY = (net: TacitNetwork) => `poseidon-tacit-wallet:${net}`;

export interface TacitWalletMeta {
  network: TacitNetwork;
  hasKey: boolean;
  pubkeyHint?: string;
  linkedAt: number;
}

export function getTacitWalletMeta(network: TacitNetwork): TacitWalletMeta | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY(network));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TacitWalletMeta;
  } catch {
    return null;
  }
}

export function markTacitLinked(network: TacitNetwork, pubkeyHint?: string) {
  const meta: TacitWalletMeta = {
    network,
    hasKey: true,
    pubkeyHint,
    linkedAt: Date.now(),
  };
  localStorage.setItem(KEY(network), JSON.stringify(meta));
}

export function clearTacitLink(network: TacitNetwork) {
  localStorage.removeItem(KEY(network));
}

export const TACIT_DAPP_URL = "https://tacit.finance";

export function tacitSwapUrl(poolId?: string, assetA?: string, assetB?: string) {
  const u = new URL(TACIT_DAPP_URL);
  if (poolId) u.searchParams.set("pool", poolId);
  if (assetA) u.searchParams.set("assetA", assetA);
  if (assetB) u.searchParams.set("assetB", assetB);
  u.searchParams.set("tab", "swap");
  return u.toString();
}
