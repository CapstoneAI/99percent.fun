'use client'

const STATS = [
  { label: 'Volume 24h', value: '$0' },
  { label: 'Tokens Launched', value: '0' },
  { label: 'Agents Registered', value: '0' },
  { label: 'Total Holders', value: '0' },
  { label: 'Fees Generated', value: '$0' },
]

export default function StatsRow() {
  return (
    <div className="border-b border-[#1a2a45] px-6 py-5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-[#4a6080] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>{stat.label}</span>
            <span className="text-white text-xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
