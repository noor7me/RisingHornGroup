"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="navInner">
      <Link className="brand" href="/" aria-label="RisingHorn Group Home">
        <Image src="/logo.svg" alt="RHG Logo" width={140} height={60} priority />
        <span>RisingHorn Group</span>
      </Link>

      <nav className="tabs" aria-label="Primary navigation">
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
