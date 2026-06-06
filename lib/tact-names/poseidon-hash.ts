import { poseidon4 } from "poseidon-lite";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { sha256 } from "@noble/hashes/sha256";

const TACT_NODE = sha256(new TextEncoder().encode("tact-names-v1"));

function fieldFromText(text: string): bigint {
  const digest = sha256(new TextEncoder().encode(text));
  return BigInt("0x" + bytesToHex(digest));
}

export function leafHash(
  label: string,
  tld: string,
  ownerEth: string,
  recordsJson: string,
): string {
  const h = poseidon4([
    fieldFromText(bytesToHex(TACT_NODE)),
    fieldFromText(`${label}.${tld}`),
    fieldFromText(ownerEth.toLowerCase()),
    fieldFromText(recordsJson),
  ]);
  return h.toString(16).padStart(64, "0");
}

export function merkleRoot(leaves: string[]): string {
  if (leaves.length === 0) {
    return bytesToHex(TACT_NODE);
  }
  let layer = [...leaves].sort();
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]!;
      const right = layer[i + 1] ?? left;
      const combined = sha256(hexToBytes(left + right));
      next.push(bytesToHex(combined));
    }
    layer = next;
  }
  return layer[0]!;
}

export function merkleProof(leaves: string[], index: number): string[] {
  const sorted = [...leaves].sort();
  const path: string[] = [];
  let layer = sorted;
  let idx = sorted.indexOf(leaves[index]!);
  if (idx < 0) idx = index;

  while (layer.length > 1) {
    const sibling = idx % 2 === 0 ? layer[idx + 1] ?? layer[idx]! : layer[idx - 1]!;
    path.push(sibling);
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]!;
      const right = layer[i + 1] ?? left;
      next.push(bytesToHex(sha256(hexToBytes(left + right))));
    }
    layer = next;
    idx = Math.floor(idx / 2);
  }
  return path;
}

export function verifyMerkleProof(
  leaf: string,
  proof: string[],
  root: string,
): boolean {
  let current = leaf;
  for (const sibling of proof) {
    const pair = [current, sibling].sort();
    current = bytesToHex(sha256(hexToBytes(pair[0]! + pair[1]!)));
  }
  return current === root;
}
