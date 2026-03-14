'use client'

import { useState, useEffect } from 'react'
import AgentLeaderboard from '@/components/AgentLeaderboard'
import DailyPack from '@/components/DailyPack'
import TokenCard from '@/components/TokenCard'
import UFOTrendingBar from '@/components/UFOTrendingBar'
import Link from 'next/link'
import { getTokens, getStats } from '@/lib/api'

type FilterType = 'trending' | 'new' | 'mcap'

export default function Home() {
  const [filter, setFilter] = useState<FilterType>('trending')
  const [tokens, setTokens] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load(showLoading = true) {
      if (showLoading) setLoading(true)
      const [t, s] = await Promise.all([getTokens(filter), getStats()])
      setTokens(t)
      setStats(s)
      setLoading(false)
    }
    load()
    const interval = setInterval(() => load(false), 10000)
    return () => clearInterval(interval)
  }, [filter])

  const humanVol = tokens.filter(t => t.type === 'human').reduce((a, t) => a + Number(t.volume_usd), 0)
  const agentVol = tokens.filter(t => t.type === 'agent').reduce((a, t) => a + Number(t.volume_usd), 0)
  const topTokens = [...tokens].sort((a, b) => Number(b.volume_usd) - Number(a.volume_usd)).slice(0, 6)

  return (
    <main className="min-h-screen hero-bg grid-lines bg-[#050d18]">
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

        {/* Top Trending */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{fontFamily:'var(--font-syne)'}}>
              Top Trending
            </h2>
          </div>
          {/* UFO vola sopra le card */}
          <div style={{ position: 'relative', height: 88, overflow: 'visible' }}>
            <UFOTrendingBar tokens={topTokens} />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 stagger" style={{scrollbarWidth:'none'}}>
            {topTokens.length > 0 ? topTokens.map((token, i) => (
              <div key={token.id} className="flex-shrink-0" id={`trending-card-${i}`}>
                <TokenCard token={token} variant="trending" />
              </div>
            )) : [...Array(6)].map((_, i) => (
              <div key={i} style={{width:158,height:200,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(41,212,245,0.08)',flexShrink:0}} />
            ))}
          </div>
            </section>

            {/* UFO ABDUCTION SPACE */}
            <div style={{ height: 80, position: 'relative', marginBottom: 8 }}>
              
            </div>

            {/* TOP MARKET CAP */}
            <section style={{ marginBottom: 40 }}>
              <h2 className="text-white font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)', fontSize: 13, letterSpacing: 3, marginBottom: 16 }}>Top Market Cap</h2>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                {[...tokens].sort((a, b) => Number(b.market_cap_usd || 0) - Number(a.market_cap_usd || 0)).slice(0, 6).map((token, i) => (
                  <div key={token.id} style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: '#0d1f35', border: '1px solid #29d4f5', borderRadius: 4, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#29d4f5', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{i+1}</span>
                    </div>
                    <TokenCard token={token} variant="trending" />
                  </div>
                ))}
                {tokens.length === 0 && (
                  <p style={{ color: '#4a6080', fontSize: 12, fontFamily: 'var(--font-mono)' }}>No tokens yet.</p>
                )}
              </div>
            </section>

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
            <TokenCard key={token.id} token={token} />
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
