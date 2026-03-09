'use client'

import { useEffect, useRef } from 'react'

interface TickerToken {
  ticker: string
  price: string
  change: string
  type: 'human' | 'agent'
}

const MOCK_TICKER: TickerToken[] = [
  { ticker: 'BPEPE', price: '$0.00042', change: '+24.2%', type: 'human' },
  { ticker: 'AGX', price: '$0.0091', change: '+11.5%', type: 'agent' },
  { ticker: 'MFROG', price: '$0.00017', change: '-3.1%', type: 'human' },
  { ticker: 'NBOT', price: '$0.0034', change: '+8.9%', type: 'agent' },
  { ticker: 'CHAD', price: '$0.00088', change: '+2.3%', type: 'human' },
  { ticker: 'AUTO', price: '$0.0012', change: '-1.7%', type: 'agent' },
  { ticker: 'BPEPE', price: '$0.00042', change: '+24.2%', type: 'human' },
  { ticker: 'AGX', price: '$0.0091', change: '+11.5%', type: 'agent' },
  { ticker: 'MFROG', price: '$0.00017', change: '-3.1%', type: 'human' },
  { ticker: 'NBOT', price: '$0.0034', change: '+8.9%', type: 'agent' },
]

export default function TickerStrip() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full border-b border-[#1a2a45] bg-[#080f1c] overflow-hidden py-2 relative">
      {/* Fade left */}
      <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #080f1c, transparent)' }} />
      {/* Fade right */}
      <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #080f1c, transparent)' }} />

      <div className="flex animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
        {[...MOCK_TICKER, ...MOCK_TICKER].map((token, i) => {
          const isPositive = token.change.startsWith('+')
          const color = token.type === 'human' ? '#29d4f5' : '#0052ff'
          return (
            <div key={i} className="inline-flex items-center gap-2 mx-6">
              <span className="text-xs" style={{ color, fontFamily: 'var(--font-mono)' }}>
                {token.type === 'human' ? '👤' : '🤖'}
              </span>
              <span className="text-xs font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                ${token.ticker}
              </span>
              <span className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>
                {token.price}
              </span>
              <span className="text-xs font-bold" style={{ color: isPositive ? '#29d4f5' : '#f87171', fontFamily: 'var(--font-mono)' }}>
                {token.change}
              </span>
              <span className="text-[#1a2a45] mx-2">|</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
