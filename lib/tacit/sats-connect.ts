import type { BtcNetwork } from "@/lib/network/context";

let loadPromise: Promise<typeof import("sats-connect")> | null = null;

export async function ensureSatsConnect() {
  if (!loadPromise) loadPromise = import("sats-connect");
  return loadPromise;
}

function btcNetworkType(
  network: BtcNetwork,
  BitcoinNetworkType: typeof import("sats-connect").BitcoinNetworkType,
) {
  return network === "signet"
    ? BitcoinNetworkType.Signet
    : BitcoinNetworkType.Mainnet;
}

export async function connectBtcWallet(
  network: BtcNetwork = "mainnet",
): Promise<{ address: string; provider: string }> {
  const { default: satsConnect, AddressPurpose, BitcoinNetworkType } =
    await ensureSatsConnect();

  await satsConnect.selectProvider();

  const res = await satsConnect.request("wallet_connect", {
    addresses: [AddressPurpose.Payment],
    message: "Poseidon — connect BTC wallet",
    network: btcNetworkType(network, BitcoinNetworkType),
  });

  if (res.status !== "success") {
    throw new Error(res.error?.message ?? "wallet_connect failed");
  }

  const payment = res.result.addresses.find(
    (a) => a.purpose === AddressPurpose.Payment,
  );
  if (!payment?.address) throw new Error("No payment address returned");

  return { address: payment.address, provider: "sats-connect" };
}

export async function getBtcNetworkLabel(): Promise<string> {
  const { default: satsConnect } = await ensureSatsConnect();
  const res = await satsConnect.request("wallet_getNetwork", null);
  if (res.status !== "success") return "unknown";
  return res.result.bitcoin?.name ?? "unknown";
}
