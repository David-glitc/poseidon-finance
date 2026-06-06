import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { NetworkBar } from "@/components/NetworkBar";
import { WalletProvider } from "@/lib/wallet/provider";
import { getSiteOrigin, PLANNED_DOMAIN } from "@/lib/config/site";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "Poseidon Finance",
  description: "Tacit DeFi, .tact names, multi-chain resolve for payments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable}`}>
      <body className="font-[family-name:var(--font-body)]">
        <WalletProvider>
          <Nav />
          <div className="mx-auto max-w-5xl px-4">
            <div className="py-3">
              <NetworkBar />
            </div>
            <main className="pb-12">{children}</main>
            <footer className="border-t border-[var(--pf-border)] py-6 text-xs text-[var(--pf-muted)]">
              Poseidon Finance · planned domain {PLANNED_DOMAIN}
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
