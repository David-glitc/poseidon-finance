import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { OceanBackground } from "@/components/OceanBackground";
import { WalletProvider } from "@/lib/wallet/provider";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Poseidon Finance — Tacit DeFi",
  description:
    ".tact · .wei · .eth · .btc names, confidential Tacit AMM, BTC + ETH wallets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <OceanBackground />
        <WalletProvider>
          <Nav />
          <main className="relative mx-auto max-w-6xl px-4 py-8">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
