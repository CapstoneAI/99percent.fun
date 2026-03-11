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
    <Link href={href} onClick={(e) => { if (!token.id) e.preventDefault() }} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 10,
          background: hovered ? '#0d1f38' : '#0a1628',
          border: '1px solid ' + (hovered ? accentColor : '#1a2a45'),
          transition: 'all 0.2s',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          overflow: 'hidden',
          flexShrink: 0,
          background: '#050d18',
          border: '1px solid #1a2a45',
        }}>
          {token.image_url ? (
            <img src={token.image_url} alt={token.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              {isAgent ? '\u{1F916}' : '\u{1F464}'}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 3 }}>
            <span style={{
              background: accentColor,
              color: isAgent ? 'white' : '#050d18',
              fontSize: 8, fontWeight: 700,
              fontFamily: 'monospace', letterSpacing: 1,
              padding: '2px 6px', borderRadius: 3,
              textTransform: 'uppercase',
            }}>
              {isAgent ? 'Agent AI' : 'Human'}
            </span>
          </div>

          <div style={{
            color: 'white', fontWeight: 700, fontSize: 13,
            fontFamily: 'var(--font-syne), sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginBottom: 2,
          }}>
            {token.name}
          </div>

          <div style={{ color: accentColor, fontSize: 10, fontFamily: 'monospace', fontWeight: 600, marginBottom: 4 }}>
            \${token.ticker}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#6a8aaa', fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase' }}>MC</span>
            <span style={{ color: '#c0d4e8', fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>
              {token.market_cap && token.market_cap > 0 ? formatMcap(token.market_cap) : '$0'}
            </span>
          </div>

          {isAgent && token.agent_name && (
            <div style={{ marginTop: 3, color: '#29d4f5', fontSize: 9, fontFamily: 'monospace' }}>
              {token.agent_name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
