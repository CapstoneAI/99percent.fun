'use client'

import { useState } from 'react'
import BattleBar from '@/components/BattleBar'
import StatsRow from '@/components/StatsRow'
import Link from 'next/link'

type FilterType = 'trending' | 'new' | 'mcap'

export default function Home() {
  const [filter, setFilter] = useState<FilterType>('trending')

  return (
    <main className="min-h-screen bg-[#050d18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Hero */}
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

        {/* Top Trending horizontal scroll */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>
              🔥 Top Trending
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 h-44 border border-[#1a2a45] bg-[#0d1f35] relative overflow-hidden group hover:border-[#29d4f5] transition-all cursor-pointer">
                {/* Image placeholder */}
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d1f35, #1a2a45)' }}>
                  <div className="w-12 h-12 rounded-full border border-[#1a2a45] flex items-center justify-center text-2xl text-[#1a2a45]">
                    ?
                  </div>
                </div>
                {/* Overlay bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: 'linear-gradient(transparent, #050d18dd)' }}>
                  <div className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>—</div>
                </div>
                {/* Rank badge */}
                <div className="absolute top-2 left-2 text-xs font-bold px-1.5 py-0.5 bg-[#050d18cc]" style={{ fontFamily: 'var(--font-mono)', color: '#4a6080' }}>
                  #{i + 1}
                </div>
              </div>
            ))}
            {/* Empty CTA */}
            <div className="flex-shrink-0 w-44 h-44 border border-dashed border-[#1a2a45] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#29d4f5] transition-all">
              <span className="text-2xl">🚀</span>
              <span className="text-[#4a6080] text-xs text-center px-2" style={{ fontFamily: 'var(--font-mono)' }}>Be the first to launch</span>
              <Link href="/create" className="text-xs px-3 py-1 font-bold" style={{ background: '#29d4f5', color: '#050d18', fontFamily: 'var(--font-syne)' }}>
                Launch
              </Link>
            </div>
          </div>
        </section>

        {/* Feed battle indicator */}
        <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#29d4f5] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>👤 Humans</span>
            <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>0 tokens in feed</span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-[#1a2a45] overflow-hidden">
            <div className="h-full w-1/2" style={{ background: 'linear-gradient(90deg, #29d4f5, #0052ff)' }} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>0 tokens in feed</span>
            <span className="text-[#0052ff] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>Agents 🤖</span>
          </div>
        </div>

        {/* Feed */}
        <section>
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 border-b border-[#1a2a45] pb-3">
            {([
              { key: 'trending', label: '🔥 Trending' },
              { key: 'new', label: '🆕 New' },
              { key: 'mcap', label: '📈 Market Cap' },
            ] as { key: FilterType, label: string }[]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 text-xs uppercase tracking-widest transition-all"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: filter === f.key ? '#050d18' : '#4a6080',
                  background: filter === f.key ? '#29d4f5' : 'transparent',
                  border: `1px solid ${filter === f.key ? '#29d4f5' : '#1a2a45'}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Empty feed */}
          <div className="border border-dashed border-[#1a2a45] py-20 flex flex-col items-center justify-center gap-4">
            <div className="flex gap-4 text-4xl opacity-20">
              <span>👤</span>
              <span>🤖</span>
            </div>
            <p className="text-[#4a6080] text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
              No tokens yet. The battle hasn't started.
            </p>
            <Link
              href="/create"
              className="px-6 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
              style={{ background: '#29d4f5', color: '#050d18', fontFamily: 'var(--font-syne)' }}
            >
              Launch First Token →
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
