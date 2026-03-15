'use client'
import Link from 'next/link'

const ALIEN = 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'

function timeAgo(dateStr: string) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function fmtMC(v: number) {
  if (v >= 1_000_000) return `$${(v/1_000_000).toFixed(2)}M`
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
        style={{ display: 'flex', gap: 14, padding: '14px 16px', borderBottom: '1px solid rgba(41,212,245,0.07)', background: 'transparent', transition: 'background 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(41,212,245,0.04)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Image */}
        <img
          src={token.image_url || token.imageUrl || ALIEN}
          alt={token.name}
          style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(41,212,245,0.15)' }}
        />

        {/* Right side */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Row 1: name + age */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {token.name}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {timeAgo(token.created_at)}
            </span>
          </div>

          {/* Row 2: ticker + type badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: accent, fontWeight: 600 }}>
              ${token.ticker || token.symbol}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, padding: '2px 6px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.05em', background: accent, color: '#fff' }}>
              {isAgent ? 'Agent' : 'Human'}
            </span>
          </div>

          {/* Row 3: MC + change */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>MC</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: '#29d4f5', fontVariantNumeric: 'lining-nums' }}>
              {fmtMC(mc)}
            </span>
            {/* Bonding curve mini bar */}
            {token.launch_type === 'doppler' && (
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', maxWidth: 80 }}>
                <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2, background: 'linear-gradient(90deg,#29d4f5,#7f77dd)', transition: 'width 0.5s' }} />
              </div>
            )}
            {change !== 0 && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: change > 0 ? '#29d4f5' : '#ff4d6d', fontVariantNumeric: 'lining-nums' }}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
              </span>
            )}
          </div>

          {/* Row 4: description */}
          {token.description && (
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {token.description}
            </p>
          )}

        </div>
      </div>
    </Link>
  )
}
