'use client'

import { useEffect, useState } from 'react'

interface BattleBarProps {
  humanVolume: number
  agentVolume: number
}

function getMilestone(volume: number) {
  if (volume >= 1_000_000) return { emoji: '🔥', label: 'ON FIRE', color: '#ff4500', glow: '#ff4500' }
  if (volume >= 100_000) return { emoji: '🚀', label: 'MOONING', color: '#a855f7', glow: '#a855f7' }
  if (volume >= 10_000) return { emoji: '✨', label: 'HEATING UP', color: '#29d4f5', glow: '#29d4f5' }
  return { emoji: '', label: '', color: '#29d4f5', glow: 'transparent' }
}

export default function BattleBar({ humanVolume, agentVolume }: BattleBarProps) {
  const total = humanVolume + agentVolume
  const humanPct = total === 0 ? 50 : Math.round((humanVolume / total) * 100)
  const agentPct = 100 - humanPct
  const isEmpty = total === 0

  const humanMilestone = getMilestone(humanVolume)
  const agentMilestone = getMilestone(agentVolume)

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border border-[#1a2a45] bg-[#0d1f35] px-6 py-4">
      <div className="flex justify-between items-center mb-3">
        {/* Human side */}
        <div className="flex items-center gap-2">
          <span className="text-[#29d4f5] text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>
            👤 HUMAN
          </span>
          {humanMilestone.emoji && (
            <span className="text-sm animate-bounce">{humanMilestone.emoji}</span>
          )}
          {humanMilestone.label && (
            <span className="text-xs font-bold px-2 py-0.5 animate-pulse"
              style={{ color: humanMilestone.color, border: `1px solid ${humanMilestone.color}66`, fontFamily: 'var(--font-mono)' }}>
              {humanMilestone.label}
            </span>
          )}
        </div>

        {/* Center */}
        <div className="text-[#4a6080] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
          {isEmpty ? 'NO VOLUME YET' : `$${(total / 1000).toFixed(1)}K TOTAL`}
        </div>

        {/* Agent side */}
        <div className="flex items-center gap-2">
          {agentMilestone.label && (
            <span className="text-xs font-bold px-2 py-0.5 animate-pulse"
              style={{ color: agentMilestone.color, border: `1px solid ${agentMilestone.color}66`, fontFamily: 'var(--font-mono)' }}>
              {agentMilestone.label}
            </span>
          )}
          {agentMilestone.emoji && (
            <span className="text-sm animate-bounce">{agentMilestone.emoji}</span>
          )}
          <span className="text-[#0052ff] text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>
            AGENT 🤖
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-4 bg-[#1a2a45] overflow-hidden relative">
        {isEmpty ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-px w-full bg-[#1a2a45]" />
          </div>
        ) : (
          <div className="h-full flex">
            {/* Human bar */}
            <div
              className="h-full relative overflow-hidden transition-all duration-1000"
              style={{
                width: `${humanPct}%`,
                background: `linear-gradient(90deg, #29d4f533, #29d4f5)`,
                boxShadow: humanVolume >= 10_000 ? `0 0 20px ${humanMilestone.glow}88` : 'none',
              }}
            >
              {/* Scintille a 10k+ */}
              {humanVolume >= 10_000 && humanVolume < 100_000 && (
                <div className="absolute inset-0 animate-pulse"
                  style={{ background: 'linear-gradient(90deg, transparent, #29d4f544, transparent)' }} />
              )}
              {/* Razzi a 100k+ */}
              {humanVolume >= 100_000 && humanVolume < 1_000_000 && (
                <>
                  <div className="absolute inset-0 animate-pulse"
                    style={{ background: 'linear-gradient(90deg, transparent, #a855f766, transparent)' }} />
                  <div className="absolute right-1 top-0 h-full flex items-center text-xs">🚀</div>
                </>
              )}
              {/* Fuoco a 1M+ */}
              {humanVolume >= 1_000_000 && (
                <>
                  <div className="absolute inset-0 animate-pulse"
                    style={{ background: 'linear-gradient(90deg, #ff450033, #ff4500aa, #ff450033)' }} />
                  <div className="absolute right-1 top-0 h-full flex items-center text-xs">🔥</div>
                </>
              )}
              {/* Glow tip */}
              <div className="absolute right-0 top-0 h-full w-3"
                style={{ background: '#29d4f5', filter: 'blur(4px)', opacity: 0.8 }} />
            </div>

            {/* Agent bar */}
            <div
              className="h-full relative overflow-hidden transition-all duration-1000"
              style={{
                width: `${agentPct}%`,
                background: `linear-gradient(90deg, #0052ff, #0052ff33)`,
                boxShadow: agentVolume >= 10_000 ? `0 0 20px ${agentMilestone.glow}88` : 'none',
              }}
            >
              {agentVolume >= 10_000 && agentVolume < 100_000 && (
                <div className="absolute inset-0 animate-pulse"
                  style={{ background: 'linear-gradient(90deg, transparent, #0052ff44, transparent)' }} />
              )}
              {agentVolume >= 100_000 && agentVolume < 1_000_000 && (
                <>
                  <div className="absolute inset-0 animate-pulse"
                    style={{ background: 'linear-gradient(90deg, transparent, #a855f766, transparent)' }} />
                  <div className="absolute left-1 top-0 h-full flex items-center text-xs">🚀</div>
                </>
              )}
              {agentVolume >= 1_000_000 && (
                <>
                  <div className="absolute inset-0 animate-pulse"
                    style={{ background: 'linear-gradient(90deg, #ff450033, #ff4500aa, #ff450033)' }} />
                  <div className="absolute left-1 top-0 h-full flex items-center text-xs">🔥</div>
                </>
              )}
              <div className="absolute left-0 top-0 h-full w-3"
                style={{ background: '#0052ff', filter: 'blur(4px)', opacity: 0.8 }} />
            </div>
          </div>
        )}
      </div>

      {/* Percentages */}
      {!isEmpty && (
        <div className="flex justify-between mt-2">
          <span className="text-[#29d4f5] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{humanPct}%</span>
          <span className="text-[#0052ff] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{agentPct}%</span>
        </div>
      )}
    </div>
  )
}
