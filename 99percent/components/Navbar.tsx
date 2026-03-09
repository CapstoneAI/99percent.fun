'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MOCK_TOKENS = [
  { name: 'Based Pepe', ticker: 'BPEPE', address: '0x0001', type: 'human' },
  { name: 'AgentX', ticker: 'AGX', address: '0x0002', type: 'agent' },
  { name: 'Moon Frog', ticker: 'MFROG', address: '0x0003', type: 'human' },
  { name: 'NeuralBot', ticker: 'NBOT', address: '0x0004', type: 'agent' },
  { name: 'Degen Chad', ticker: 'CHAD', address: '0x0005', type: 'human' },
]

export function Navbar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  const results = query.length >= 2
    ? MOCK_TOKENS.filter(t =>
        t.ticker.toLowerCase().includes(query.toLowerCase()) ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.address.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(address: string) {
    setQuery('')
    setFocused(false)
    router.push(`/token/${address}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.length > 10) {
      handleSelect(query)
    }
  }

  return (
    <nav className="border-b border-[#1a2a45] bg-[#050d18] px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-white font-black text-lg" style={{ fontFamily: 'var(--font-syne)' }}>
            <span style={{ color: '#29d4f5' }}>99</span>
            {' '}
            <span style={{ color: 'white' }}>PERCENT</span>
            <span style={{ color: '#4a6080' }}>.fun</span>
          </span>
        </Link>

        {/* Search */}
        <div ref={ref} className="flex-1 max-w-sm relative">
          <div className="flex items-center border border-[#1a2a45] bg-[#0d1f35] px-3 py-2 focus-within:border-[#29d4f5] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#4a6080] flex-shrink-0 mr-2">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search token or address..."
              className="bg-transparent text-white text-xs outline-none w-full placeholder:text-[#2a3a50]"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#4a6080] hover:text-white ml-1 text-xs">✕</button>
            )}
          </div>

          {/* Dropdown */}
          {focused && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 border border-[#1a2a45] bg-[#0d1f35] z-50">
              {results.map(token => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token.address)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#1a2a45] transition-colors text-left"
                >
                  <span className="text-sm">{token.type === 'human' ? '👤' : '🤖'}</span>
                  <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-syne)' }}>{token.name}</span>
                  <span className="text-xs px-1.5 py-0.5 ml-1"
                    style={{ color: token.type === 'human' ? '#29d4f5' : '#0052ff',
                      background: (token.type === 'human' ? '#29d4f5' : '#0052ff') + '20',
                      fontFamily: 'var(--font-mono)' }}>
                    ${token.ticker}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {focused && query.length >= 2 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 border border-[#1a2a45] bg-[#0d1f35] z-50 px-3 py-2">
              <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>No tokens found</span>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#human-tokens" className="text-[#4a6080] hover:text-[#29d4f5] text-xs uppercase tracking-widest transition-colors flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)' }}>
            👤 Human
          </Link>
          <Link href="/#agent-tokens" className="text-[#4a6080] hover:text-[#0052ff] text-xs uppercase tracking-widest transition-colors flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)' }}>
            🤖 Agent
          </Link>
        </div>

        <div className="ml-auto flex-shrink-0">
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
