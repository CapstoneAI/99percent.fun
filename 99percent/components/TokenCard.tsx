'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Token {
  id: number
  name: string
  ticker: string
  contract_address?: string
  type: 'human' | 'agent'
  description?: string
  image_url?: string
  volume_usd?: number
  market_cap?: number
  agent_name?: string
  proof_url?: string
  created_at?: string
}

export default function TokenCard({ token }: { token: Token }) {
  const [hovered, setHovered] = useState(false)
  const isAgent = token.type === 'agent'
  const accentColor = isAgent ? '#0052ff' : '#29d4f5'
  const href = token.id ? `/token/${token.contract_address || token.id}` : '#'

  function formatMcap(v: number) {
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M'
    if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'K'
    return '$' + v
  }

  return (
    <Link href={href} onClick={(e) => { if (!token.id) e.preventDefault() }} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1.5px solid ' + (hovered ? accentColor : '#1a2a45'),
          transition: 'border-color 0.2s, transform 0.2s',
          transform: hovered ? 'translateY(-2px)' : 'none',
          background: '#0a1628',
        }}
      >
        {token.image_url ? (
          <img
            src={token.image_url}
            alt={token.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, background: '#0a1628'
          }}>
            {isAgent ? '🤖' : '👤'}
          </div>
        )}

        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: accentColor,
          color: isAgent ? 'white' : '#050d18',
          fontSize: 9, fontWeight: 700,
          fontFamily: 'monospace', letterSpacing: 1,
          padding: '2px 6px', borderRadius: 4,
          textTransform: 'uppercase',
        }}>
          {isAgent ? 'AGENT' : 'HUMAN'}
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(5,13,24,0.95) 0%, rgba(5,13,24,0.6) 70%, transparent 100%)',
          padding: '20px 10px 10px 10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 3 }}>
            <span style={{
              color: 'white', fontWeight: 700, fontSize: 13,
              fontFamily: 'var(--font-syne), sans-serif',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '65%'
            }}>
              {token.name}
            </span>
            <span style={{ color: accentColor, fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }}>
              ${token.ticker}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#6a8aaa', fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase' }}>MCap</span>
            <span style={{ color: '#c0d4e8', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>
              {token.market_cap && token.market_cap > 0 ? formatMcap(token.market_cap) : '$0'}
            </span>
          </div>
          {isAgent && token.agent_name && (
            <div style={{ marginTop: 3, color: '#29d4f5', fontSize: 9, fontFamily: 'monospace' }}>
              🤖 {token.agent_name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
