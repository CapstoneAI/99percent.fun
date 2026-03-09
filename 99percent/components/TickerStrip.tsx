'use client'

const items: { ticker: string; price: string; change: string; positive: boolean }[] = []

export function TickerStrip() {
  if (items.length === 0) return null
  const doubled = [...items, ...items]
  return (
    <div className="border-b border-[#1a2a45] bg-[#050d18] overflow-hidden py-2">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="text-[#4a6080] uppercase">${item.ticker}</span>
            <span className="text-white">{item.price}</span>
            <span className={item.positive ? 'text-[#29d4f5]' : 'text-red-400'}>{item.change}</span>
            <span className="text-[#1a2a45] ml-4">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
