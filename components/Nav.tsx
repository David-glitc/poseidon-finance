import Link from "next/link";
import { WalletBar } from "./WalletBar";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/market", label: "Market" },
  { href: "/swap", label: "Swap" },
  { href: "/names", label: "Names" },
  { href: "/send", label: "Send" },
  { href: "/wallet", label: "Wallet" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-400/10 bg-black/50 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="pf-float flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-200 text-lg font-bold text-black">
            ψ
          </span>
          <div>
            <div className="font-display text-sm font-semibold tracking-wide text-sky-50">
              Poseidon Finance
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-sky-400/50">
              liquid glass · Tacit
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-sky-100/60 transition hover:text-sky-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <WalletBar />
      </div>
    </header>
  );
}
