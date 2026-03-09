'use client'

interface BattleBarProps {
  humanVolume: number
  agentVolume: number
}

function getMilestone(volume: number) {
  if (volume >= 1_000_000) return { emoji: '🔥', label: 'ON FIRE', color: '#ff4500' }
  if (volume >= 100_000) return { emoji: '🚀', label: 'MOONING', color: '#a855f7' }
  if (volume >= 10_000) return { emoji: '✨', label: 'HEATING UP', color: '#29d4f5' }
  return { emoji: '', label: '', color: '#29d4f5' }
}

export default function BattleBar({ humanVolume, agentVolume }: BattleBarProps) {
  const total = humanVolume + agentVolume
  const humanPct = total === 0 ? 50 : Math.round((humanVolume / total) * 100)
  const agentPct = 100 - humanPct
  const isEmpty = total === 0
  const humanM = getMilestone(humanVolume)
  const agentM = getMilestone(agentVolume)

  return (
    <div className="border border-[#1a2a45] bg-[#0d1f35] px-6 py-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#29d4f5] text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>👤 HUMAN</span>
          {humanM.emoji && <span className="text-sm animate-bounce">{humanM.emoji}</span>}
          {humanM.label && (
            <span className="text-xs font-bold px-2 py-0.5 animate-pulse"
              style={{ color: humanM.color, border: `1px solid ${humanM.color}66`, fontFamily: 'var(--font-mono)' }}>
              {humanM.label}
            </span>
          )}
        </div>
        <div className="text-[#4a6080] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
          {isEmpty ? 'NO VOLUME YET' : `$${(total / 1000).toFixed(1)}K TOTAL`}
        </div>
        <div className="flex items-center gap-2">
          {agentM.label && (
            <span className="text-xs font-bold px-2 py-0.5 animate-pulse"
              style={{ color: agentM.color, border: `1px solid ${agentM.color}66`, fontFamily: 'var(--font-mono)' }}>
              {agentM.label}
            </span>
          )}
          {agentM.emoji && <span className="text-sm animate-bounce">{agentM.emoji}</span>}
          <span className="text-[#0052ff] text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>AGENT 🤖</span>
        </div>
      </div>

      <div className="h-4 bg-[#1a2a45] overflow-hidden relative">
        {!isEmpty && (
          <div className="h-full flex">
            <div className="h-full relative overflow-hidden transition-all duration-1000"
              style={{ width: `${humanPct}%`, background: `linear-gradient(90deg, #29d4f533, #29d4f5)`,
                boxShadow: humanVolume >= 10_000 ? `0 0 20px ${humanM.color}88` : 'none' }}>
              {humanVolume >= 10_000 && <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, transparent, #29d4f544, transparent)' }} />}
              {humanVolume >= 100_000 && <div className="absolute right-1 top-0 h-full flex items-center text-xs">🚀</div>}
              {humanVolume >= 1_000_000 && <div className="absolute right-1 top-0 h-full flex items-center text-xs">🔥</div>}
              <div className="absolute right-0 top-0 h-full w-3" style={{ background: '#29d4f5', filter: 'blur(4px)', opacity: 0.8 }} />
            </div>
            <div className="h-full relative overflow-hidden transition-all duration-1000"
              style={{ width: `${agentPct}%`, background: `linear-gradient(90deg, #0052ff, #0052ff33)`,
                boxShadow: agentVolume >= 10_000 ? `0 0 20px ${agentM.color}88` : 'none' }}>
              {agentVolume >= 10_000 && <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, transparent, #0052ff44, transparent)' }} />}
              {agentVolume >= 100_000 && <div className="absolute left-1 top-0 h-full flex items-center text-xs">🚀</div>}
              {agentVolume >= 1_000_000 && <div className="absolute left-1 top-0 h-full flex items-center text-xs">🔥</div>}
              <div className="absolute left-0 top-0 h-full w-3" style={{ background: '#0052ff', filter: 'blur(4px)', opacity: 0.8 }} />
            </div>
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="flex justify-between mt-2">
          <span className="text-[#29d4f5] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{humanPct}%</span>
          <span className="text-[#0052ff] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{agentPct}%</span>
        </div>
      )}
    </div>
  )
}
