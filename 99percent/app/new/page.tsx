'use client'
import { useState, useEffect } from 'react'
import TokenCardList from '@/components/TokenCardList'
import { getTokens } from '@/lib/api'

export default function NewPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const t = await getTokens('new')
      setTokens(t.slice(0, 25))
      setLoading(false)
    }
    load()
    const iv = setInterval(load, 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ padding: '28px 24px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          New
        </h1>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(41,212,245,0.5)', background: 'rgba(41,212,245,0.08)', padding: '3px 10px', borderRadius: 6 }}>
          {tokens.length} tokens
        </span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(41,212,245,0.4)', letterSpacing: '0.08em' }}>
          ● LIVE
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 0, border: "1px solid rgba(41,212,245,0.1)", borderRadius: 12, overflow: "hidden" }}>
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
