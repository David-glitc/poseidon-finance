"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createConfig,
  http,
  WagmiProvider,
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connectBtcWallet } from "@/lib/tacit/sats-connect";
import { NetworkProvider, useNetworks } from "@/lib/network/context";

interface WalletContextValue {
  btcAddress: string | null;
  connectBtc: () => Promise<void>;
  disconnectBtc: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function BtcWalletBridge({ children }: { children: ReactNode }) {
  const [btcAddress, setBtcAddress] = useState<string | null>(null);
  const { btc } = useNetworks();

  useEffect(() => {
    const saved = localStorage.getItem("poseidon-btc");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { address: string };
      setBtcAddress(parsed.address);
    } catch {
      localStorage.removeItem("poseidon-btc");
    }
  }, []);

  const connectBtc = useCallback(async () => {
    const { address } = await connectBtcWallet(btc);
    setBtcAddress(address);
    localStorage.setItem("poseidon-btc", JSON.stringify({ address, network: btc }));
  }, [btc]);

  const disconnectBtc = useCallback(() => {
    setBtcAddress(null);
    localStorage.removeItem("poseidon-btc");
  }, []);

  const value = useMemo(
    () => ({ btcAddress, connectBtc, disconnectBtc }),
    [btcAddress, connectBtc, disconnectBtc],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

function EthChainSync({ children }: { children: ReactNode }) {
  const { eth } = useNetworks();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!isConnected) return;
    switchChain({ chainId: eth === "sepolia" ? sepolia.id : mainnet.id });
  }, [eth, isConnected, switchChain]);

  return <>{children}</>;
}

export function useBtcWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useBtcWallet outside provider");
  return ctx;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <WagmiProvider config={wagmiConfig}>
          <EthChainSync>
            <BtcWalletBridge>{children}</BtcWalletBridge>
          </EthChainSync>
        </WagmiProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}

export function useEthWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  return { address, isConnected, chainId, connect, connectors, isPending, disconnect };
}
