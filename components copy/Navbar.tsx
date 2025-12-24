"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/sourcing", label: "Sourcing" },
  { href: "/markets", label: "Markets" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="navInner">
      <Link href="/" className="brandWrap" aria-label="RisingHorn Group Home">
        {/* Replace this file with your finalized logo */}
        <Image src="/logo.svg" alt="RisingHorn Group logo" width={34} height={34} priority />
        <div className="brandText">RisingHorn Group</div>
      </Link>

      <nav className="links" aria-label="Primary navigation">
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
  );
}
