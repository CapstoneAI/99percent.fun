'use client'
import { useState, useEffect } from 'react'
import TokenCard from '@/components/TokenCard'
import { getTokens } from '@/lib/api'
import Link from 'next/link'

export default function GraduatedPage() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const t = await getTokens('mcap')
      // Graduated = Clanker (già live) + Doppler completati
      const graduated = t.filter((tk: any) =>
        tk.launch_type === 'clanker' || tk.graduated === true || Number(tk.market_cap_usd) > 0
      ).slice(0, 25)
      setTokens(graduated)
      setLoading(false)
    }
    load()
    const iv = setInterval(load, 10000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{padding:'32px 24px', maxWidth:1200}}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:24}}>
        <h1 style={{fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'0.06em', textTransform:'uppercase'}}>
          ◈ Graduated
        </h1>
        <span style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(41,212,245,0.5)', background:'rgba(41,212,245,0.08)', padding:'3px 10px', borderRadius:6}}>
          {tokens.length} tokens
        </span>
        {loading && <span style={{fontFamily:"'Space Mono',monospace", fontSize:10, color:'rgba(41,212,245,0.4)'}}>updating...</span>}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(158px, 1fr))', gap:12}}>
        {tokens.map(token => (
          <Link key={token.id} href={`/token/${token.address || token.id}`} style={{textDecoration:'none'}}>
            <TokenCard token={token} variant="trending" />
          </Link>
        ))}
        {loading && [...Array(25)].map((_, i) => (
          <div key={i} className="ufo-skeleton-card" style={{height:200, borderRadius:12, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(41,212,245,0.07)', overflow:'hidden', position:'relative'}}>
            <div className="ufo-skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
