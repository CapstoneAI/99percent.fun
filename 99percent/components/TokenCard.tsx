import Link from 'next/link'

interface TokenCardProps {
  address: string
  name: string
  ticker: string
  type: 'human' | 'agent'
  price: string
  mcap: string
  vol24h: string
  change24h: string
  image?: string | null
  rank?: number
}

export default function TokenCard({ address, name, ticker, type, price, mcap, vol24h, change24h, image, rank }: TokenCardProps) {
  const isHuman = type === 'human'
  const color = isHuman ? '#29d4f5' : '#0052ff'
  const isPositive = change24h.startsWith('+')

  return (
    <Link href={`/token/${address}`}>
      <div className="border border-[#1a2a45] bg-[#0d1f35] p-4 hover:border-[#29d4f5] transition-all duration-200 cursor-pointer group">
        <div className="flex items-start gap-3">
          {rank && (
            <div className="text-[#1a2a45] text-xs font-bold w-4 flex-shrink-0 mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
              #{rank}
            </div>
          )}
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-xl border border-[#1a2a45]" style={{ background: color + '15' }}>
            {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : (isHuman ? '👤' : '🤖')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-sm font-bold truncate group-hover:text-[#29d4f5] transition-colors" style={{ fontFamily: 'var(--font-syne)' }}>
                {name}
              </span>
              <span className="text-xs px-1.5 py-0.5 flex-shrink-0" style={{ color, background: color + '20', fontFamily: 'var(--font-mono)' }}>
                ${ticker}
              </span>
            </div>
            <span className="text-xs px-1.5 py-0.5" style={{ color, border: `1px solid ${color}44`, fontFamily: 'var(--font-mono)' }}>
              {isHuman ? '👤 Human' : '🤖 Agent'}
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold" style={{ color: isPositive ? '#29d4f5' : '#f87171', fontFamily: 'var(--font-mono)' }}>
              {change24h}
            </div>
            <div className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>24h</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#1a2a45]">
          {[
            { label: 'Price', value: price },
            { label: 'MCap', value: mcap },
            { label: 'Vol 24h', value: vol24h },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-[#4a6080] text-xs uppercase tracking-widest mb-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{stat.label}</div>
              <div className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
