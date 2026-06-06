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
import type { TacitNetwork } from "@/lib/tacit/client";

export type EthNetwork = "mainnet" | "sepolia";
export type BtcNetwork = "mainnet" | "signet";

interface NetworkState {
  tact: TacitNetwork;
  eth: EthNetwork;
  btc: BtcNetwork;
  setTact: (n: TacitNetwork) => void;
  setEth: (n: EthNetwork) => void;
  setBtc: (n: BtcNetwork) => void;
}

const KEY = "poseidon-networks";

const NetworkContext = createContext<NetworkState | null>(null);

function loadSaved(): Pick<NetworkState, "tact" | "eth" | "btc"> {
  if (typeof window === "undefined") {
    return { tact: "mainnet", eth: "mainnet", btc: "mainnet" };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { tact: "mainnet", eth: "mainnet", btc: "mainnet" };
    return { tact: "mainnet", eth: "mainnet", btc: "mainnet", ...JSON.parse(raw) };
  } catch {
    return { tact: "mainnet", eth: "mainnet", btc: "mainnet" };
  }
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [tact, setTactState] = useState<TacitNetwork>("mainnet");
  const [eth, setEthState] = useState<EthNetwork>("mainnet");
  const [btc, setBtcState] = useState<BtcNetwork>("mainnet");

  useEffect(() => {
    const s = loadSaved();
    setTactState(s.tact);
    setEthState(s.eth);
    setBtcState(s.btc);
  }, []);

  const persist = useCallback((next: { tact: TacitNetwork; eth: EthNetwork; btc: BtcNetwork }) => {
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const setTact = useCallback(
    (n: TacitNetwork) => {
      setTactState(n);
      persist({ tact: n, eth, btc });
    },
    [eth, btc, persist],
  );

  const setEth = useCallback(
    (n: EthNetwork) => {
      setEthState(n);
      persist({ tact, eth: n, btc });
    },
    [tact, btc, persist],
  );

  const setBtc = useCallback(
    (n: BtcNetwork) => {
      setBtcState(n);
      persist({ tact, eth, btc: n });
    },
    [tact, eth, persist],
  );

  const value = useMemo(
    () => ({ tact, eth, btc, setTact, setEth, setBtc }),
    [tact, eth, btc, setTact, setEth, setBtc],
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetworks() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetworks outside NetworkProvider");
  return ctx;
}
