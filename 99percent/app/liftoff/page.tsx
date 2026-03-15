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
    const iv = setInterval(load, 10000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ padding: '28px 24px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Liftoff
        </h1>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(41,212,245,0.5)', background: 'rgba(41,212,245,0.08)', padding: '3px 10px', borderRadius: 6 }}>
          top {tokens.length} movers 24h
        </span>
      </div>

      <div style={{ border: '1px solid rgba(41,212,245,0.1)', borderRadius: 12, overflow: 'hidden' }}>
        {!loading && tokens.length > 0 ? tokens.map(token => (
          <TokenCardList key={token.id} token={token} />
        )) : (
          [...Array(10)].map((_, i) => (
            <div key={i} className="ufo-skeleton-card" style={{ height: 92, borderBottom: '1px solid rgba(41,212,245,0.07)', position: 'relative', overflow: 'hidden' }}>
              <div className="ufo-skeleton-shimmer" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
