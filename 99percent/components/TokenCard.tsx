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

export default function TokenCard({ token, variant = 'feed' }: { token: Token, variant?: 'trending' | 'feed' }) {
  const [hovered, setHovered] = useState(false)
  const isAgent = token.type === 'agent'
  const accentColor = isAgent ? '#0052ff' : '#29d4f5'
  const href = token.id ? `/token/${token.contract_address || token.id}` : '#'

  function formatMcap(v: number) {
    if (v >= 1000000) return '$' + (v / 1000000).toFixed(1) + 'M'
    if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'K'
    return '$' + v
  }

  const mcap = token.market_cap && token.market_cap > 0 ? formatMcap(token.market_cap) : '$0'

  if (variant === 'trending') {
    return (
      <Link href={href} onClick={(e) => { if (!token.id) e.preventDefault() }} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            width: 200,
            height: 200,
            borderRadius: 12,
            overflow: 'hidden',
            cursor: 'pointer',
            border: '2px solid ' + (hovered ? accentColor : '#1a2a45'),
            transition: 'all 0.2s',
            transform: hovered ? 'translateY(-3px)' : 'none',
            background: '#0a1628',
            flexShrink: 0,
          }}
        >
          {token.image_url ? (
            <img src={token.image_url || 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'} alt={token.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
              {isAgent ? '🤖' : '👤'}
            </div>
          )}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, rgba(5,13,24,0.9) 0%, rgba(5,13,24,0.2) 50%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: 'rgba(5,13,24,0.75)',
            borderRadius: 6, padding: '3px 8px',
          }}>
            <span style={{ color: 'white', fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>{mcap}</span>
          </div>
          <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 17, fontFamily: 'var(--font-syne), sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontVariantNumeric: 'normal', lineHeight: 1.2 }}>
              {token.name}
            </div>
            <div style={{ color: accentColor, fontSize: 13, fontFamily: 'monospace', fontWeight: 600 }}>
              ${token.ticker} · {isAgent ? 'Agent AI' : 'Human'}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} onClick={(e) => { if (!token.id) e.preventDefault() }} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer', width: '100%' }}
      >
        <div style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 10,
          overflow: 'hidden',
          border: '1.5px solid ' + (hovered ? accentColor : '#1a2a45'),
          transition: 'all 0.2s',
          transform: hovered ? 'translateY(-2px)' : 'none',
          background: '#0a1628',
        }}>
          {token.image_url ? (
            <img src={token.image_url || 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'} alt={token.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
              {isAgent ? '🤖' : '👤'}
            </div>
          )}
        </div>
        <div style={{ padding: '8px 2px 0 2px' }}>
          <span style={{
            background: accentColor,
            color: isAgent ? 'white' : '#050d18',
            fontSize: 9, fontWeight: 700,
            fontFamily: 'monospace', letterSpacing: 1,
            padding: '2px 6px', borderRadius: 3,
            textTransform: 'uppercase',
          }}>
            {isAgent ? 'Agent AI' : 'Human'}
          </span>
          <div style={{
            color: 'white', fontWeight: 700, fontSize: 16,
            fontFamily: 'var(--font-syne), sans-serif',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginTop: 4,
          }}>
            {token.name} <span style={{ color: accentColor, fontSize: 13, fontWeight: 600 }}>${token.ticker}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <span style={{ color: '#6a8aaa', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase' }}>MC</span>
            <span style={{ color: '#c0d4e8', fontSize: 15, fontFamily: 'monospace', fontWeight: 700 }}>{mcap}</span>
          </div>
          {isAgent && token.agent_name && (
            <div style={{ marginTop: 2, color: '#29d4f5', fontSize: 10, fontFamily: 'monospace' }}>
              🤖 {token.agent_name}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
