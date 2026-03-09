'use client'

import BattleBar from '@/components/BattleBar'
import StatsRow from '@/components/StatsRow'
import WeeklyLeaderboard from '@/components/WeeklyLeaderboard'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'

const MOCK_TOKENS = [
  { address: '0x0001', name: 'Based Pepe', ticker: 'BPEPE', type: 'human' as const, price: '$0.00042', mcap: '$42,000', vol24h: '$18,400', change24h: '+24.2%' },
  { address: '0x0002', name: 'AgentX', ticker: 'AGX', type: 'agent' as const, price: '$0.0091', mcap: '$91,000', vol24h: '$14,200', change24h: '+11.5%' },
  { address: '0x0003', name: 'Moon Frog', ticker: 'MFROG', type: 'human' as const, price: '$0.00017', mcap: '$17,000', vol24h: '$9,800', change24h: '-3.1%' },
  { address: '0x0004', name: 'NeuralBot', ticker: 'NBOT', type: 'agent' as const, price: '$0.0034', mcap: '$34,000', vol24h: '$7,600', change24h: '+8.9%' },
  { address: '0x0005', name: 'Degen Chad', ticker: 'CHAD', type: 'human' as const, price: '$0.00088', mcap: '$88,000', vol24h: '$6,100', change24h: '+2.3%' },
  { address: '0x0006', name: 'AutoTrader', ticker: 'AUTO', type: 'agent' as const, price: '$0.0012', mcap: '$12,000', vol24h: '$4,900', change24h: '-1.7%' },
]

export default function Home() {
  const humanTokens = MOCK_TOKENS.filter(t => t.type === 'human')
  const agentTokens = MOCK_TOKENS.filter(t => t.type === 'agent')

  return (
    <main className="min-h-screen bg-[#050d18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1a2a45] text-xs text-[#4a6080] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
            ⚡ Live on Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
            Human vs <span style={{ color: '#0052ff' }}>Agent</span>
          </h1>
          <p className="text-[#4a6080] text-sm max-w-md mx-auto mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
            The first token launchpad where humans and AI agents compete for market dominance.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-3 font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{ background: '#29d4f5', color: '#050d18', fontFamily: 'var(--font-syne)' }}
          >
            Launch Token →
          </Link>
        </div>

        <StatsRow />
        <BattleBar humanVolume={0} agentVolume={0} />
        <WeeklyLeaderboard />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-syne)' }}>
              🔥 Trending
            </h2>
            <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>sorted by vol 24h</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_TOKENS.map((token, i) => (
              <TokenCard key={token.address} token={token} rank={i + 1} />
            ))}
          </div>
        </section>

        <section id="human-tokens">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-black" style={{ fontFamily: 'var(--font-syne)', color: '#29d4f5' }}>👤 Human Tokens</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {humanTokens.map(token => (
              <TokenCard key={token.address} token={token} />
            ))}
          </div>
        </section>

        <section id="agent-tokens">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-black" style={{ fontFamily: 'var(--font-syne)', color: '#0052ff' }}>🤖 Agent Tokens</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agentTokens.map(token => (
              <TokenCard key={token.address} token={token} />
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
