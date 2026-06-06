export type NameTld = "tact" | "wei" | "eth" | "btc";

export interface TldMeta {
  tld: NameTld;
  label: string;
  chain: string;
  description: string;
  managedBy: "poseidon" | "ens" | "wei";
}

export const TLDS: Record<NameTld, TldMeta> = {
  tact: {
    tld: "tact",
    label: ".tact",
    chain: "Bitcoin / Tacit",
    description: "Poseidon registry — shielded Tacit addresses",
    managedBy: "poseidon",
  },
  wei: {
    tld: "wei",
    label: ".wei",
    chain: "Ethereum",
    description: "Wei Name Service",
    managedBy: "wei",
  },
  eth: {
    tld: "eth",
    label: ".eth",
    chain: "Ethereum",
    description: "ENS",
    managedBy: "ens",
  },
  btc: {
    tld: "btc",
    label: ".btc",
    chain: "Bitcoin",
    description: "Poseidon BTC payment handles",
    managedBy: "poseidon",
  },
};

export function parseQualifiedName(raw: string): { label: string; tld: NameTld } | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");
  const dot = s.lastIndexOf(".");
  if (dot <= 0) return null;
  const label = s.slice(0, dot);
  const tld = s.slice(dot + 1) as NameTld;
  if (!TLDS[tld]) return null;
  if (!/^[a-z0-9]{1,62}$/.test(label)) return null;
  return { label, tld };
}
