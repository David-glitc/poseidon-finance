const WORKER_MAINNET = "https://tacit-pin.rosscampbell9.workers.dev";
const WORKER_SIGNET = "https://tacit-pin.rosscampbell9.workers.dev";

export type TacitNetwork = "mainnet" | "signet";

export interface TacitAsset {
  asset_id: string;
  ticker?: string;
  name?: string;
  image_uri?: string;
  supply_kind?: string;
  cumulative_minted?: string;
  etch_height?: number;
}

export interface TacitListing {
  txid: string;
  vout: number;
  price_sats?: number;
  asset_amount?: string;
  owner_pubkey?: string;
}

function workerBase(network: TacitNetwork): string {
  return network === "mainnet" ? WORKER_MAINNET : WORKER_SIGNET;
}

export async function fetchAssets(
  network: TacitNetwork = "mainnet",
): Promise<TacitAsset[]> {
  const res = await fetch(`${workerBase(network)}/assets`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("tacit assets fetch failed");
  const data = await res.json();
  return Array.isArray(data) ? data : data.assets ?? [];
}

export async function fetchAssetDetail(
  assetId: string,
  network: TacitNetwork = "mainnet",
): Promise<TacitAsset | null> {
  const res = await fetch(`${workerBase(network)}/assets/${assetId}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchListings(
  assetId: string,
  network: TacitNetwork = "mainnet",
): Promise<TacitListing[]> {
  const res = await fetch(`${workerBase(network)}/assets/${assetId}/listings`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.listings ?? [];
}

export async function fetchPools(network: TacitNetwork = "mainnet") {
  const res = await fetch(`${workerBase(network)}/pools`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.pools ?? [];
}
