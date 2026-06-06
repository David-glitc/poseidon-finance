import { createPublicClient, http, namehash } from "viem";
import { normalize } from "viem/ens";
import { mainnet, sepolia } from "viem/chains";
import type { NameTld } from "./tlds";
import { getRegistration, resolveWithProof, loadSnapshotBundle } from "@/lib/tact-names/store";
import { verifyRegistration } from "@/lib/tact-names/verify";
import { isValidLabel, normalizeLabel } from "@/lib/tact-names/normalize";
import type { EthNetwork } from "@/lib/network/context";

const WEI_NFT = "0x0000000000696760e15f265e828db644a0c242eb" as const;

function ethClient(network: EthNetwork) {
  return createPublicClient({
    chain: network === "sepolia" ? sepolia : mainnet,
    transport: http(),
  });
}

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

async function resolveWei(label: string, ethNetwork: EthNetwork): Promise<MultiResolveResult> {
  const qualified = `${label}.wei`;
  if (ethNetwork !== "mainnet") {
    return {
      qualified,
      tld: "wei",
      found: false,
      verified: true,
      source: "wei-names-mainnet-only",
      records: {},
    };
  }
  try {
    const client = ethClient(ethNetwork);
    const node = namehash(normalize(qualified));
    const tokenId = BigInt(node);
    await client.readContract({
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

    const addr = (await client.readContract({
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
      return { qualified, tld: "wei", found: false, verified: true, source: "wei-names", records: {} };
    }
    return { qualified, tld: "wei", found: true, verified: true, source: "wei-names", records: { eth: addr } };
  } catch {
    return { qualified, tld: "wei", found: false, verified: true, source: "wei-names", records: {} };
  }
}

async function resolveEns(label: string, ethNetwork: EthNetwork): Promise<MultiResolveResult> {
  const qualified = `${label}.eth`;
  try {
    const client = ethClient(ethNetwork);
    const addr = await client.getEnsAddress({ name: qualified });
    if (!addr) {
      return { qualified, tld: "eth", found: false, verified: true, source: "ens", records: {} };
    }
    return { qualified, tld: "eth", found: true, verified: true, source: "ens", records: { eth: addr } };
  } catch {
    return { qualified, tld: "eth", found: false, verified: false, source: "ens", records: {} };
  }
}

function resolvePoseidon(label: string, tld: "tact" | "btc"): MultiResolveResult {
  const qualified = `${label}.${tld}`;
  if (!isValidLabel(label)) {
    return { qualified, tld, found: false, verified: false, source: "poseidon-registry", records: {} };
  }
  const norm = normalizeLabel(label);
  const reg = getRegistration(norm, tld === "btc" ? "btc" : "tact");
  if (!reg) {
    return { qualified, tld, found: false, verified: true, source: "poseidon-registry", records: {} };
  }
  const { registration, proof, snapshot } = resolveWithProof(norm);
  if (!registration || (registration.tld ?? "tact") !== (tld === "btc" ? "btc" : "tact")) {
    return { qualified, tld, found: false, verified: true, source: "poseidon-registry", records: {} };
  }
  const verified = verifyRegistration(registration, proof, snapshot);
  return {
    qualified,
    tld,
    found: true,
    verified,
    source: "poseidon-registry",
    records: {
      eth: registration.records.eth,
      btc: registration.records.btc,
      tacit_shielded: registration.records.tacit_shielded,
      contenthash: registration.records.contenthash,
    },
  };
}

export async function resolveQualified(
  label: string,
  tld: NameTld,
  ethNetwork: EthNetwork = "mainnet",
): Promise<MultiResolveResult> {
  switch (tld) {
    case "tact":
      return resolvePoseidon(label, "tact");
    case "btc":
      return resolvePoseidon(label, "btc");
    case "wei":
      return resolveWei(label, ethNetwork);
    case "eth":
      return resolveEns(label, ethNetwork);
    default:
      throw new Error("unknown tld");
  }
}

export function listPoseidonNames() {
  return loadSnapshotBundle().registrations;
}
