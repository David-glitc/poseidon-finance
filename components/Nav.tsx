import Link from "next/link";
import { WalletBar } from "./WalletBar";

const links = [
  { href: "/", label: "Home" },
  { href: "/market", label: "Market" },
  { href: "/swap", label: "Swap" },
  { href: "/names", label: "Names" },
  { href: "/send", label: "Send" },
  { href: "/wallet", label: "Wallet" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--pf-border)] bg-[var(--pf-bg)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-[var(--pf-border)] text-sm font-bold text-[var(--pf-accent)]">
            P
          </span>
          <div>
            <div className="text-sm font-semibold tracking-tight">Poseidon</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--pf-muted)]">
              Finance · Tacit
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-[var(--pf-muted)] transition hover:text-[var(--pf-text)]"
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
