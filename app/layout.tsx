import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { OceanBackground } from "@/components/OceanBackground";
import { WalletProvider } from "@/lib/wallet/provider";
import { getSiteOrigin, PLANNED_DOMAIN } from "@/lib/config/site";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "Poseidon Finance — Tacit DeFi",
  description:
    ".tact · .wei · .eth · .btc names, confidential Tacit AMM, BTC + ETH wallets",
  openGraph: {
    title: "Poseidon Finance",
    description: "Liquid glass DeFi on Tacit",
    siteName: "Poseidon Finance",
    url: getSiteOrigin(),
  },
  alternates: {
    canonical: getSiteOrigin(),
  },
  other: {
    "planned-domain": PLANNED_DOMAIN,
  },
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
