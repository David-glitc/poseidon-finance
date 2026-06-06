export type TactRecordType =
  | "tacit_shielded"
  | "btc"
  | "eth"
  | "text"
  | "contenthash";

export interface TactRecords {
  tacit_shielded?: string;
  btc?: string;
  eth?: string;
  contenthash?: string;
  [key: `text:${string}`]: string | undefined;
}

export interface TactRegistration {
  label: string;
  tld: "tact" | "btc";
  ownerEth: string;
  ownerBtc?: string;
  records: TactRecords;
  registeredAt: number;
  expiresAt: number;
  bookingSig?: string;
}

export interface TactBooking {
  label: string;
  tld: "tact" | "btc";
  ownerEth: string;
  ownerBtc?: string;
  expiresAt: number;
  createdAt: number;
  sig: string;
}

export interface RegistrySnapshot {
  version: number;
  generatedAt: number;
  merkleRoot: string;
  count: number;
  registryPubkey?: string;
  manifestSig?: string;
}

export interface ResolveResult {
  name: string;
  registration: TactRegistration | null;
  proof?: string[];
  snapshot: RegistrySnapshot;
  verified: boolean;
  source: "live" | "cache";
}
