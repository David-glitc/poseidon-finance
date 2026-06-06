export type NameTld = "tact" | "wei" | "eth" | "btc";

export interface TldMeta {
  tld: NameTld;
  label: string;
  chain: string;
  description: string;
  managedBy: "poseidon" | "ens" | "wei";
  registerable: boolean;
}

export const TLDS: Record<NameTld, TldMeta> = {
  tact: {
    tld: "tact",
    label: ".tact",
    chain: "Tacit / Bitcoin",
    description: "Poseidon registry — register here",
    managedBy: "poseidon",
    registerable: true,
  },
  wei: {
    tld: "wei",
    label: ".wei",
    chain: "Ethereum",
    description: "Resolve only — register at wei.domains",
    managedBy: "wei",
    registerable: false,
  },
  eth: {
    tld: "eth",
    label: ".eth",
    chain: "Ethereum / EVM",
    description: "Resolve only — register via ENS",
    managedBy: "ens",
    registerable: false,
  },
  btc: {
    tld: "btc",
    label: ".btc",
    chain: "Bitcoin",
    description: "Resolve only — payment handle lookup",
    managedBy: "poseidon",
    registerable: false,
  },
};

export const RESOLVE_TLDS = Object.values(TLDS);

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
