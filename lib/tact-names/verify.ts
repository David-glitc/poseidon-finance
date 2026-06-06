import type { ResolveResult, TactRegistration, RegistrySnapshot } from "./types";
import { verifyMerkleProof, leafHash } from "./poseidon-hash";
import { isValidLabel, normalizeLabel, toDisplayName } from "./normalize";

const CACHE_KEY = "poseidon-tact-snapshot-v1";

export function verifyRegistration(
  registration: TactRegistration,
  proof: string[],
  snapshot: RegistrySnapshot,
): boolean {
  const leaf = leafHash(
    registration.label,
    registration.tld ?? "tact",
    registration.ownerEth,
    JSON.stringify(registration.records),
  );
  return verifyMerkleProof(leaf, proof, snapshot.merkleRoot);
}

export function cacheSnapshot(bundle: {
  snapshot: RegistrySnapshot;
  registrations: TactRegistration[];
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ cachedAt: Date.now(), ...bundle }),
  );
}

export function loadCachedSnapshot():
  | { snapshot: RegistrySnapshot; registrations: TactRegistration[] }
  | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function resolveTactName(
  raw: string,
  apiBase = "",
): Promise<ResolveResult> {
  const label = normalizeLabel(raw);
  if (!isValidLabel(label)) {
    throw new Error("invalid .tact name");
  }

  try {
    const res = await fetch(`${apiBase}/api/registry/resolve/${label}`);
    if (!res.ok) throw new Error("registry unavailable");
    const data = await res.json();
    const verified =
      data.registration && data.proof?.length
        ? verifyRegistration(data.registration, data.proof, data.snapshot)
        : !data.registration;
    if (data.snapshot && data.registrations) {
      cacheSnapshot({
        snapshot: data.snapshot,
        registrations: data.registrations,
      });
    }
    return {
      name: toDisplayName(label),
      registration: data.registration,
      proof: data.proof,
      snapshot: data.snapshot,
      verified,
      source: "live",
    };
  } catch {
    const cached = loadCachedSnapshot();
    if (!cached) {
      return {
        name: toDisplayName(label),
        registration: null,
        snapshot: {
          version: 0,
          generatedAt: 0,
          merkleRoot: "",
          count: 0,
        },
        verified: false,
        source: "cache",
      };
    }
    const registration =
      cached.registrations.find((r) => r.label === label) ?? null;
    return {
      name: toDisplayName(label),
      registration,
      snapshot: cached.snapshot,
      verified: !!registration,
      source: "cache",
    };
  }
}
