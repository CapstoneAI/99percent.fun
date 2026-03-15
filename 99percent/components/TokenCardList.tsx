'use client'
import Link from 'next/link'

const ALIEN = 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'

function timeAgo(d: string) {
  if (!d) return ''
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h/24)}d`
}

function fmtMC(v: number) {
  if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v/1_000).toFixed(1)}K`
  return `$${v}`
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
        style={{ display: 'flex', gap: 8, padding: '8px 10px', borderBottom: '1px solid rgba(41,212,245,0.07)', background: 'transparent', transition: 'background 0.15s', cursor: 'pointer', alignItems: 'center' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(41,212,245,0.04)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Image */}
        <img
          src={token.image_url || token.imageUrl || ALIEN}
          alt={token.name}
          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(41,212,245,0.15)' }}
        />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Row 1: name + ticker + age + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
              {token.name}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: accent, fontWeight: 600, flexShrink: 0 }}>
              ${token.ticker || token.symbol}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
              {timeAgo(token.created_at)}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono',monospace", fontSize: 7, padding: '1px 5px', borderRadius: 3, fontWeight: 700, background: accent, color: '#fff', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {isAgent ? 'Agent' : 'Human'}
            </span>
          </div>

          {/* Row 2: MC + bar + change */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>MC</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: '#29d4f5', fontVariantNumeric: 'lining-nums', flexShrink: 0 }}>
              {fmtMC(mc)}
            </span>
            {token.launch_type === 'doppler' && (
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', maxWidth: 60 }}>
                <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2, background: 'linear-gradient(90deg,#29d4f5,#7f77dd)' }} />
              </div>
            )}
            {change !== 0 && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, color: change > 0 ? '#29d4f5' : '#ff4d6d', fontVariantNumeric: 'lining-nums', flexShrink: 0 }}>
                {change > 0 ? '↑' : '↓'}{Math.abs(change).toFixed(1)}%
              </span>
            )}
          </div>

          {/* Row 3: description */}
          {token.description && (
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.28)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {token.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
