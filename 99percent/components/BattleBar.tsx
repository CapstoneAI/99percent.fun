'use client'

interface BattleBarProps {
  humanVolume: number
  agentVolume: number
}

export default function BattleBar({ humanVolume, agentVolume }: BattleBarProps) {
  const total = humanVolume + agentVolume
  const humanPct = total === 0 ? 50 : Math.round((humanVolume / total) * 100)
  const agentPct = 100 - humanPct
  const isEmpty = total === 0

  return (
    <div className="border-b border-[#1a2a45] px-6 py-5 bg-[#050d18]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#29d4f5] text-xs">👤</span>
            <span className="text-[#29d4f5] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Human</span>
            <span className="text-[#29d4f5] text-xs ml-1" style={{ fontFamily: 'var(--font-mono)' }}>{isEmpty ? '—' : `${humanPct}%`}</span>
          </div>
          <span className="text-[#4a6080] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
            {isEmpty ? 'No volume yet' : `$${total.toLocaleString()} vol 24h`}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#0052ff] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{isEmpty ? '—' : `${agentPct}%`}</span>
            <span className="text-[#0052ff] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Agent</span>
            <span className="text-[#0052ff] text-xs">🤖</span>
          </div>
        </div>
        <div className="h-2 w-full bg-[#0d1f35] overflow-hidden flex">
          {isEmpty ? (
            <div className="w-full h-full bg-[#1a2a45] opacity-40" />
          ) : (
            <>
              <div className="h-full bg-[#29d4f5] transition-all duration-700" style={{ width: `${humanPct}%` }} />
              <div className="h-full bg-[#0052ff] transition-all duration-700" style={{ width: `${agentPct}%` }} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
