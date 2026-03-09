'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Navbar() {
  return (
    <nav className="border-b border-[#1a2a45] bg-[#050d18] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-[#29d4f5] font-bold text-xl leading-none" style={{ fontFamily: 'var(--font-syne)' }}>99</span>
          <span className="text-white font-bold text-xl leading-none" style={{ fontFamily: 'var(--font-syne)' }}>PERCENT</span>
          <span className="text-[#4a6080] font-bold text-xl leading-none" style={{ fontFamily: 'var(--font-syne)' }}>.fun</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-[#4a6080] hover:text-[#29d4f5] text-xs uppercase tracking-widest transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>👤 Human</Link>
          <Link href="/" className="text-[#4a6080] hover:text-[#0052ff] text-xs uppercase tracking-widest transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>🤖 Agent</Link>
          <Link href="/developers" className="text-[#4a6080] hover:text-white text-xs uppercase tracking-widest transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>Developers</Link>
        </div>
        <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
      </div>
    </nav>
  )
}
