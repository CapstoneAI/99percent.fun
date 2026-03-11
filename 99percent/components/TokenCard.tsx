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
  const fillColor = isAgent ? '#0052ff' : '#29d4f5'
  const volume = token.volume_usd || 0
  const fillPercent = Math.min((volume / 500000) * 100, 100)
  const href = `/token/${token.contract_address || token.id}`

  function formatVolume(v: number) {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
    return `$${v}`
  }

  return (
    <Link href={token.id ? href : '#'} onClick={e => { if (!token.id) e.preventDefault() }} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          border: `1px solid ${hovered ? accentColor : '#1a2a45'}`,
          background: '#080f1e',
          width: '100%',
          minHeight: 200,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: hovered ? `0 0 20px ${accentColor}22` : 'none',
        }}
      >
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: `${fillPercent}%`,
          background: `linear-gradient(180deg, ${fillColor}10, ${fillColor}28)`,
          borderTop: `1px solid ${fillColor}44`,
          transition: 'height 1.5s ease',
        }} />

        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: accentColor,
          color: isAgent ? 'white' : '#050d18',
          fontSize: 8, fontWeight: 700,
          padding: '2px 6px',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          letterSpacing: 1, textTransform: 'uppercase',
        }}>
          {isAgent ? 'AGENT' : 'HUMAN'}
        </div>

        <div style={{
          position: 'relative', padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          height: '100%', boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, flexShrink: 0,
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}44`,
              borderRadius: '50%', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              {token.image_url
                ? <img src={token.image_url} alt={token.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (isAgent ? '🤖' : '👤')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: 'white', fontWeight: 700, fontSize: 14,
                fontFamily: 'var(--font-syne), sans-serif', letterSpacing: -0.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{token.name}</div>
              <div style={{ color: accentColor, fontSize: 10, fontFamily: 'monospace', marginTop: 1 }}>${token.ticker}</div>
              {token.market_cap && (
                <div style={{ color: '#4a6080', fontSize: 9, fontFamily: 'monospace', marginTop: 2 }}>
                  MCap {formatVolume(token.market_cap)}
                </div>
              )}
            </div>
          </div>

          {token.description && (
            <div style={{
              color: '#6a7a90', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.4,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {token.description}
            </div>
          )}

          {isAgent && token.agent_name && (
            <div style={{ borderTop: '1px solid #0052ff33', paddingTop: 8, marginTop: 'auto' }}>
              <div style={{
                color: '#4a6080', fontSize: 8, fontFamily: 'monospace',
                letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3,
              }}>Suggested by</div>
              <div style={{ color: '#29d4f5', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
                {token.agent_name}
              </div>
              {volume > 0 && (
                <div style={{ color: '#4a6080', fontSize: 9, fontFamily: 'monospace', marginTop: 3 }}>
                  {formatVolume(volume)} vol
                </div>
              )}
            </div>
          )}

          {!isAgent && volume > 0 && (
            <div style={{ marginTop: 'auto', color: '#4a6080', fontSize: 9, fontFamily: 'monospace' }}>
              {formatVolume(volume)} vol
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
