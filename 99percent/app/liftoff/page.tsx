'use client'
import { useState, useEffect } from 'react'
import TokenCardList from '@/components/TokenCardList'
import { getTokens } from '@/lib/api'

export default function LiftoffPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const t = await getTokens('trending')
      const movers = [...t]
        .filter((tk: any) => Number(tk.price_change_24h) > 0)
        .sort((a: any, b: any) => Number(b.price_change_24h) - Number(a.price_change_24h))
        .slice(0, 25)
      setTokens(movers)
      setLoading(false)
    }
    load()
    const iv = setInterval(load, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>Liftoff</h1>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(41,212,245,0.5)', background: 'rgba(41,212,245,0.08)', padding: '2px 8px', borderRadius: 5 }}>{tokens.length}</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#29d4f5', letterSpacing: '0.08em' }}>● LIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
        {!loading && tokens.length > 0 ? tokens.map(token => (
          <TokenCardList key={token.id} token={token} />
        )) : [...Array(12)].map((_, i) => (
          <div key={i} className="ufo-skeleton-card" style={{ height: 102, borderRadius: 10, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(41,212,245,0.07)' }}>
            <div className="ufo-skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
