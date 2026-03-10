'use client'

interface StatsRowProps {
  stats?: {
    total_tokens: number
    total_volume: number
    human_tokens: number
    agent_tokens: number
  } | null
}

export default function StatsRow({ stats }: StatsRowProps) {
  const items = [
    { label: 'Volume 24h', value: stats ? `$${Number(stats.total_volume).toLocaleString()}` : '$0' },
    { label: 'Tokens Launched', value: stats ? stats.total_tokens.toString() : '0' },
    { label: 'Human Tokens', value: stats ? stats.human_tokens.toString() : '0' },
    { label: 'Agent Tokens', value: stats ? stats.agent_tokens.toString() : '0' },
    { label: 'Fees Generated', value: '$0' },
  ]

  return (
    <div className="border-b border-[#1a2a45] px-6 py-5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
        {items.map(stat => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-xs text-[#4a6080] uppercase tracking-widest" style={{fontFamily:'var(--font-mono)'}}>{stat.label}</span>
            <span className="text-xl font-black text-white" style={{fontFamily:'var(--font-syne)'}}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
