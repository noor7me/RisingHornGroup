"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Contact" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path
          d="M18 6L6 18M6 6l12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="nav">
      <div className="navInner">
        <Link className="brand" href="/" aria-label="RisingHorn Group Home">
          <Image src="/logo.svg" alt="RisingHorn Group" width={160} height={56} priority />
        </Link>

        <button
          type="button"
          className="menuButton"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>

        <nav className={`tabs ${open ? "tabsOpen" : ""}`} aria-label="Primary navigation">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} className={`tab ${active ? "tabActive" : ""}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
