'use client'

interface TokenCardProps {
  name?: string
  ticker?: string
  type?: 'human' | 'agent'
  imageUrl?: string
  volumeUsd?: number
  mcap?: string
  rank?: number
  preview?: boolean
}

function WaterFill({ percent, type }: { percent: number, type: 'human' | 'agent' }) {
  const color = type === 'human' ? '#29d4f5' : '#0052ff'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out"
        style={{ height: `${Math.min(percent, 100)}%` }}
      >
        <div className="absolute -top-3 left-0 right-0 overflow-hidden" style={{ height: '12px' }}>
          <svg viewBox="0 0 200 12" className="w-full" style={{ animation: 'wave 2s linear infinite' }}>
            <path
              d="M0,6 C20,0 40,12 60,6 C80,0 100,12 120,6 C140,0 160,12 180,6 C200,0 220,12 240,6 L240,12 L0,12 Z"
              fill={color}
              opacity="0.8"
            />
          </svg>
        </div>
        <div className="absolute inset-0" style={{ background: `${color}25`, borderTop: `1px solid ${color}60` }} />
      </div>
    </div>
  )
}

export default function TokenCard({
  name = '???',
  ticker = '???',
  type = 'human',
  imageUrl,
  volumeUsd = 0,
  mcap,
  rank,
  preview = false,
}: TokenCardProps) {
  const color = type === 'human' ? '#29d4f5' : '#0052ff'
  const emoji = type === 'human' ? '👤' : '🤖'
  const percent = preview ? 35 : Math.min((volumeUsd / 1_000_000) * 100, 100)

  const milestone = volumeUsd >= 1_000_000
    ? '🔥 ON FIRE'
    : volumeUsd >= 100_000
    ? '🚀 MOONING'
    : volumeUsd >= 10_000
    ? '✨ HEATING UP'
    : null

  return (
    <div
      className="relative w-44 h-44 overflow-hidden border transition-all duration-300 cursor-pointer"
      style={{ borderColor: '#1a2a45', background: '#0d1f35' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a2a45')}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-10">{emoji}</div>
      )}

      <WaterFill percent={percent} type={type} />

      <div className="absolute inset-0 flex flex-col justify-between p-2.5" style={{ background: 'linear-gradient(to top, #050d18cc 0%, transparent 60%)' }}>
        <div className="flex items-start justify-between">
          {rank && (
            <span className="text-xs font-bold px-1.5 py-0.5 bg-[#050d18cc]" style={{ fontFamily: 'var(--font-mono)', color: '#4a6080' }}>
              #{rank}
            </span>
          )}
          <span className="text-xs font-bold px-1.5 py-0.5 ml-auto"
            style={{ fontFamily: 'var(--font-mono)', color, background: `${color}20` }}>
            {emoji} {type.toUpperCase()}
          </span>
        </div>

        {milestone && (
          <div className="text-center">
            <span className="text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{milestone}</span>
          </div>
        )}

        <div>
          <div className="text-white text-xs font-black truncate" style={{ fontFamily: 'var(--font-syne)' }}>{name}</div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color, fontFamily: 'var(--font-mono)' }}>${ticker}</span>
            {mcap && <span className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>{mcap}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
