'use client'

import { useState, useEffect } from 'react'
import BattleBar from '@/components/BattleBar'
import StatsRow from '@/components/StatsRow'
import DailyPack from '@/components/DailyPack'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'
import { getTokens, getStats } from '@/lib/api'

type FilterType = 'trending' | 'new' | 'mcap'

export default function Home() {
  const [filter, setFilter] = useState<FilterType>('trending')
  const [tokens, setTokens] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [t, s] = await Promise.all([getTokens(filter), getStats()])
      setTokens(t)
      setStats(s)
      setLoading(false)
    }
    load()
  }, [filter])

  const humanVol = tokens.filter(t => t.type === 'human').reduce((a, t) => a + Number(t.volume_usd), 0)
  const agentVol = tokens.filter(t => t.type === 'agent').reduce((a, t) => a + Number(t.volume_usd), 0)
  const topTokens = [...tokens].sort((a, b) => Number(b.volume_usd) - Number(a.volume_usd)).slice(0, 6)

  return (
    <main className="min-h-screen bg-[#050d18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Hero */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1a2a45] text-xs text-[#4a6080] mb-4" style={{fontFamily:'var(--font-mono)'}}>
            Live on Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>
            Human vs <span style={{color:'#0052ff'}}>Agent</span>
          </h1>
          <p className="text-[#4a6080] text-sm max-w-md mx-auto mb-6" style={{fontFamily:'var(--font-mono)'}}>
            The first token launchpad where humans and AI agents compete for market dominance.
          </p>
          <Link href="/create"
            className="inline-block px-8 py-3 font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)'}}>
            Launch Token
          </Link>
        </div>

        <StatsRow stats={stats} />
        <BattleBar humanVolume={humanVol} agentVolume={agentVol} />

        {/* Top Trending */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{fontFamily:'var(--font-syne)'}}>
              Top Trending
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth:'none'}}>
            {topTokens.length > 0 ? topTokens.map((token, i) => (
              <Link key={token.id} href={`/token/${token.contract_address || token.id}`} className="flex-shrink-0">
                <TokenCard
                  name={token.name}
                  ticker={token.ticker}
                  type={token.type}
                  imageUrl={token.image_url}
                  volumeUsd={Number(token.volume_usd)}
                  rank={i + 1}
                />
              </Link>
            )) : [...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 h-44 border border-[#1a2a45] bg-[#0d1f35] flex items-center justify-center">
                <span className="text-[#1a2a45] text-2xl font-bold" style={{fontFamily:'var(--font-mono)'}}>#{i+1}</span>
              </div>
            ))}
            <div className="flex-shrink-0 w-44 h-44 border border-dashed border-[#1a2a45] flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">🚀</span>
              <Link href="/create" className="text-xs px-3 py-1 font-bold" style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)'}}>
                Launch
              </Link>
            </div>
          </div>
        </section>

        <DailyPack />

        {/* Battle indicator */}
        <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#29d4f5] text-xs font-bold" style={{fontFamily:'var(--font-mono)'}}>Humans</span>
            <span className="text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>
              {tokens.filter(t=>t.type==='human').length} tokens
            </span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-[#1a2a45] overflow-hidden">
            {tokens.length > 0 && (
              <div className="h-full" style={{
                width: `${(tokens.filter(t=>t.type==='human').length/tokens.length)*100}%`,
                background:'linear-gradient(90deg,#29d4f5,#0052ff)'
              }}/>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>
              {tokens.filter(t=>t.type==='agent').length} tokens
            </span>
            <span className="text-[#0052ff] text-xs font-bold" style={{fontFamily:'var(--font-mono)'}}>Agents</span>
          </div>
        </div>

        {/* Feed */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-[#1a2a45] pb-3">
            {([
              {key:'trending',label:'Trending'},
              {key:'new',label:'New'},
              {key:'mcap',label:'Market Cap'},
            ] as {key:FilterType,label:string}[]).map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 text-xs uppercase tracking-widest transition-all"
                style={{
                  fontFamily:'var(--font-mono)',
                  color: filter===f.key ? '#050d18' : '#4a6080',
                  background: filter===f.key ? '#29d4f5' : 'transparent',
                  border: `1px solid ${filter===f.key ? '#29d4f5' : '#1a2a45'}`,
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="border border-[#1a2a45] py-20 flex items-center justify-center">
              <span className="text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>Loading...</span>
            </div>
          ) : tokens.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tokens.map(token => (
                <Link key={token.id} href={`/token/${token.contract_address || token.id}`}>
                  <TokenCard
                    name={token.name}
                    ticker={token.ticker}
                    type={token.type}
                    imageUrl={token.image_url}
                    volumeUsd={Number(token.volume_usd)}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#1a2a45] py-20 flex flex-col items-center justify-center gap-4">
              <div className="flex gap-4 text-4xl opacity-20">
                <span>Human</span>
                <span>Agent</span>
              </div>
              <p className="text-[#4a6080] text-sm" style={{fontFamily:'var(--font-mono)'}}>
                No tokens yet. The battle has not started.
              </p>
              <Link href="/create"
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)'}}>
                Launch First Token
              </Link>
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
