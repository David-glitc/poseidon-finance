let loadPromise: Promise<typeof import("sats-connect")> | null = null;

export async function ensureSatsConnect() {
  if (!loadPromise) {
    loadPromise = import("sats-connect");
  }
  return loadPromise;
}

export async function connectBtcWallet(): Promise<{
  address: string;
  provider: string;
}> {
  const { default: satsConnect, AddressPurpose, BitcoinNetworkType } =
    await ensureSatsConnect();
  const res = await satsConnect.request("wallet_connect", {
    addresses: [AddressPurpose.Payment],
    message: "Poseidon Finance — connect Bitcoin wallet",
    network: BitcoinNetworkType.Mainnet,
  });
  if (res.status !== "success") {
    throw new Error(res.error?.message ?? "wallet_connect failed");
  }
  const payment = res.result.addresses.find(
    (a) => a.purpose === AddressPurpose.Payment,
  );
  if (!payment?.address) throw new Error("no payment address");
  return { address: payment.address, provider: "sats-connect" };
}

export async function getBtcNetwork(): Promise<string> {
  const { default: satsConnect } = await ensureSatsConnect();
  const res = await satsConnect.request("wallet_getNetwork", null);
  if (res.status !== "success") return "unknown";
  return res.result.bitcoin?.name ?? "unknown";
}
