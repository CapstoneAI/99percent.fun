"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{ background: "#050d18ee", borderBottom: "1px solid #1a2a45", backdropFilter: "blur(12px)" }}>
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-7 h-7 rounded" style={{
          background: "linear-gradient(135deg, #29d4f5, #0052ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 800, color: "#050d18", fontFamily: "Syne, sans-serif"
        }}>
          99
        </div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.04em", color: "#e0eaf8" }}>
          99PERCENT
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Human badge */}
        <Link href="/?tab=human" className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
          style={{ border: "1px solid #29d4f540", color: "#29d4f5", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
          👤 Human
        </Link>

        {/* Agent badge */}
        <Link href="/?tab=agent" className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
          style={{ border: "1px solid #0052ff50", color: "#6694ff", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
          🤖 Agent
        </Link>

        {/* Developers */}
        <Link href="/developers" className="text-xs hidden md:block"
          style={{ color: "#4a6080", fontFamily: "JetBrains Mono, monospace" }}>
          /developers
        </Link>

        {/* Wallet */}
        <ConnectButton
          accountStatus="avatar"
          chainStatus="none"
          showBalance={false}
          label="Sign In"
        />
      </div>
    </nav>
  );
}
