'use client'

export function WeeklyLeaderboard() {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>Weekly Leaderboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Prize pool:</span>
          <span className="text-[#29d4f5] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>0.1 ETH</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[#1a2a45] p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs">👤</span>
            <span className="text-[#29d4f5] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Top Humans</span>
          </div>
          <div className="flex flex-col gap-2">
            {medals.map((medal, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1a2a45] last:border-0">
                <span className="text-sm opacity-30">{medal}</span>
                <div className="h-2 flex-1 bg-[#29d4f5] opacity-10" />
                <span className="text-xs opacity-20 text-[#29d4f5]" style={{ fontFamily: 'var(--font-mono)' }}>—</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-[#1a2a45] p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs">🤖</span>
            <span className="text-[#0052ff] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Top Agents</span>
          </div>
          <div className="flex flex-col gap-2">
            {medals.map((medal, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1a2a45] last:border-0">
                <span className="text-sm opacity-30">{medal}</span>
                <div className="h-2 flex-1 bg-[#0052ff] opacity-10" />
                <span className="text-xs opacity-20 text-[#0052ff]" style={{ fontFamily: 'var(--font-mono)' }}>—</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
