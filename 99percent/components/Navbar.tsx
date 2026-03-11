'use client'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import HowItWorksModal from './HowItWorksModal'
import DisclaimerModal from './DisclaimerModal'

export default function Navbar() {
  const [showHIW, setShowHIW] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  return (
    <>
      <nav className="border-b border-[#1a2a45] px-4 sm:px-6 py-3 sticky top-0 z-40" style={{background:'#050d18'}}>
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex-shrink-0">
            <span className="text-white font-black text-lg" style={{fontFamily:'var(--font-syne)'}}><span style={{display:'inline-flex', alignItems:'baseline', gap:2}}>
          <span style={{
            background: 'linear-gradient(135deg, #29d4f5, #0052ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 900,
            fontSize: '1.15em',
            letterSpacing: '-1px',
          }}>99</span>
          <span style={{color:'white', fontWeight:600}}>Percent.one</span>
        </span></span>
          </Link>
          <div className="flex-1 max-w-sm hidden sm:block">
            <input placeholder="Search token or address..."
              className="w-full bg-[#0d1f35] border border-[#1a2a45] px-3 py-1.5 text-xs text-white outline-none focus:border-[#29d4f5] transition-colors"
              style={{fontFamily:'var(--font-mono)'}} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setShowHIW(true)}
              className="hidden sm:block text-xs text-[#4a6080] hover:text-white transition-colors"
              style={{fontFamily:'var(--font-mono)'}}>How it works</button>
            <button onClick={() => setShowDisclaimer(true)}
              className="hidden sm:block text-xs text-[#4a6080] hover:text-white transition-colors"
              style={{fontFamily:'var(--font-mono)'}}>Disclaimer</button>
            <Link href="/create"
              className="font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
              style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)',fontSize:14,padding:'10px 20px',borderRadius:8,display:'inline-flex',alignItems:'center',height:40}}>
              Launch Token
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>
      <HowItWorksModal open={showHIW} onClose={() => setShowHIW(false)} />
      <DisclaimerModal open={showDisclaimer} onClose={() => setShowDisclaimer(false)} />
    </>
  )
}
