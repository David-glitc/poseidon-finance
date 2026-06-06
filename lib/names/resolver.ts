import { createPublicClient, http, namehash } from "viem";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";
import type { NameTld } from "./tlds";
import { getRegistration, resolveWithProof, loadSnapshotBundle } from "@/lib/tact-names/store";
import { verifyRegistration } from "@/lib/tact-names/verify";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";

const WEI_NFT = "0x0000000000696760e15f265e828db644a0c242eb" as const;

const ethClient = createPublicClient({
  chain: mainnet,
  transport: http("https://cloudflare-eth.com"),
});

export interface ResolvedRecords {
  eth?: string;
  btc?: string;
  tacit_shielded?: string;
  contenthash?: string;
  text?: Record<string, string>;
}

export interface MultiResolveResult {
  qualified: string;
  tld: NameTld;
  found: boolean;
  verified: boolean;
  source: string;
  records: ResolvedRecords;
}

async function resolveWei(label: string): Promise<MultiResolveResult> {
  const qualified = `${label}.wei`;
  try {
    const node = namehash(normalize(qualified));
    const tokenId = BigInt(node);
    await ethClient.readContract({
      address: WEI_NFT,
      abi: [
        {
          name: "ownerOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ type: "address" }],
        },
      ],
      functionName: "ownerOf",
      args: [tokenId],
    });

    let addr = (await ethClient.readContract({
      address: WEI_NFT,
      abi: [
        {
          name: "addr",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "node", type: "bytes32" }],
          outputs: [{ type: "address" }],
        },
      ],
      functionName: "addr",
      args: [node],
    })) as string;

    const zero = "0x0000000000000000000000000000000000000000";
    if (!addr || addr === zero) {
      return {
        qualified,
        tld: "wei",
        found: false,
        verified: true,
        source: "wei-names-mainnet",
        records: {},
      };
    }

    return {
      qualified,
      tld: "wei",
      found: true,
      verified: true,
      source: "wei-names-mainnet",
      records: { eth: addr },
    };
  } catch {
    return {
      qualified,
      tld: "wei",
      found: false,
      verified: true,
      source: "wei-names-mainnet",
      records: {},
    };
  }
}

async function resolveEns(label: string): Promise<MultiResolveResult> {
  const qualified = `${label}.eth`;
  try {
    const addr = await ethClient.getEnsAddress({ name: qualified });
    if (!addr) {
      return {
        qualified,
        tld: "eth",
        found: false,
        verified: true,
        source: "ens-mainnet",
        records: {},
      };
    }
    return {
      qualified,
      tld: "eth",
      found: true,
      verified: true,
      source: "ens-mainnet",
      records: { eth: addr },
    };
  } catch {
    return {
      qualified,
      tld: "eth",
      found: false,
      verified: false,
      source: "ens-mainnet",
      records: {},
    };
  }
}

function resolvePoseidon(label: string, tld: "tact" | "btc"): MultiResolveResult {
  const qualified = `${label}.${tld}`;
  if (!isValidLabel(label)) {
    return {
      qualified,
      tld,
      found: false,
      verified: false,
      source: "poseidon-registry",
      records: {},
    };
  }
  const reg = getRegistration(normalizeLabel(label), tld);
  if (!reg) {
    return {
      qualified,
      tld,
      found: false,
      verified: true,
      source: "poseidon-registry",
      records: {},
    };
  }
  const { registration, proof, snapshot } = resolveWithProof(normalizeLabel(label));
  if (registration && (registration.tld ?? "tact") !== tld) {
    return {
      qualified,
      tld,
      found: false,
      verified: true,
      source: "poseidon-registry",
      records: {},
    };
  }
  if (!registration) {
    return {
      qualified,
      tld,
      found: false,
      verified: true,
      source: "poseidon-registry",
      records: {},
    };
  }
  const verified = verifyRegistration(registration, proof, snapshot);
  const records: ResolvedRecords = {
    eth: registration.records.eth,
    btc: registration.records.btc,
    tacit_shielded: registration.records.tacit_shielded,
    contenthash: registration.records.contenthash,
  };
  return {
    qualified,
    tld,
    found: true,
    verified,
    source: "poseidon-registry",
    records,
  };
}

export async function resolveQualified(
  label: string,
  tld: NameTld,
): Promise<MultiResolveResult> {
  switch (tld) {
    case "tact":
    case "btc":
      return resolvePoseidon(label, tld);
    case "wei":
      return resolveWei(label);
    case "eth":
      return resolveEns(label);
    default:
      throw new Error("unknown tld");
  }
}

export function listPoseidonNames() {
  return loadSnapshotBundle().registrations;
}
