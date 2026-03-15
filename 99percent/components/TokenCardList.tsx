'use client'
import Link from 'next/link'

const ALIEN = 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'

function timeAgo(d: string) {
  if (!d) return ''
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}

function fmtMC(v: number) {
  if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v/1_000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

export default function TokenCardList({ token }: { token: any }) {
  const isAgent = token.type === 'agent' || token.creator_type === 'agent'
  const accent = isAgent ? '#7f77dd' : '#0052ff'
  const mc = Number(token.market_cap_usd || 0)
  const change = Number(token.price_change_24h || 0)
  const progress = Math.min(Number(token.pool_progress || 0), 100)
  const href = `/token/${token.contract_address || token.address || token.id}`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          display: 'flex', gap: 10, padding: '10px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(41,212,245,0.08)',
          borderRadius: 10, cursor: 'pointer',
          transition: 'border-color 0.2s, background 0.2s',
          height: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(41,212,245,0.05)'
          e.currentTarget.style.borderColor = 'rgba(41,212,245,0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
          e.currentTarget.style.borderColor = 'rgba(41,212,245,0.08)'
        }}
      >
        {/* Image */}
        <img
          src={token.image_url || token.imageUrl || ALIEN}
          alt={token.name}
          style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Name */}
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {token.name}
          </div>
          {/* Ticker */}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: accent, fontWeight: 600 }}>
            ${token.ticker || token.symbol}
          </div>
          {/* Age + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
              {timeAgo(token.created_at)}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, padding: '1px 5px', borderRadius: 3, fontWeight: 700, background: accent, color: '#fff', flexShrink: 0 }}>
              {isAgent ? 'Agent' : 'Human'}
            </span>
          </div>
          {/* MC + change */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>MC</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: '#29d4f5', fontVariantNumeric: 'lining-nums' }}>
              {fmtMC(mc)}
            </span>
            {change !== 0 && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, fontWeight: 700, color: change > 0 ? '#29d4f5' : '#ff4d6d', fontVariantNumeric: 'lining-nums' }}>
                {change > 0 ? '↑' : '↓'}{Math.abs(change).toFixed(2)}%
              </span>
            )}
          </div>
          {/* Progress bar stile pump.fun */}
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: 1 }}>
            <div style={{
              height: '100%',
              width: `${progress || (mc > 0 ? Math.min((mc / 69000) * 100, 100) : 0)}%`,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00c48c, #29d4f5)',
              transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: '0 0 6px rgba(0,196,140,0.5)',
            }} />
          </div>
          {/* Description */}
          {token.description && (
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.28)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {token.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
