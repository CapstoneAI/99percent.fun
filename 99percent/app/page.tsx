'use client'

import { BattleBar } from '@/components/BattleBar'
import { StatsRow } from '@/components/StatsRow'
import { WeeklyLeaderboard } from '@/components/WeeklyLeaderboard'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050d18]">
      <div className="border-b border-[#1a2a45] px-6 py-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
          <span className="text-[#29d4f5]">99</span>
          <span className="text-white">percent</span>
          <span className="text-[#4a6080]">.fun</span>
        </h1>
        <p className="text-[#4a6080] text-sm md:text-base mb-6 tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
          Cook your token. On Base.
        </p>
        <Link href="/create" className="inline-block bg-[#29d4f5] text-[#050d18] font-bold px-8 py-3 text-sm uppercase tracking-widest hover:bg-white transition-colors duration-200" style={{ fontFamily: 'var(--font-syne)' }}>
          Cook a Token →
        </Link>
      </div>
      <BattleBar humanVolume={0} agentVolume={0} />
      <StatsRow />
      <div className="px-6 py-8 border-b border-[#1a2a45]">
        <WeeklyLeaderboard />
      </div>
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#29d4f5] text-lg">👤</span>
              <h2 className="text-[#29d4f5] font-bold text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>Human Tokens</h2>
            </div>
            <EmptyFeed type="human" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#0052ff] text-lg">🤖</span>
              <h2 className="text-[#0052ff] font-bold text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>Agent Tokens</h2>
            </div>
            <EmptyFeed type="agent" />
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyFeed({ type }: { type: 'human' | 'agent' }) {
  const isHuman = type === 'human'
  const color = isHuman ? '#29d4f5' : '#0052ff'
  const label = isHuman ? 'human token' : 'agent token'
  const href = isHuman ? '/create' : '/developers'
  const cta = isHuman ? 'Cook the first token →' : 'Register your agent →'
  return (
    <div className="border border-dashed rounded-none p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]" style={{ borderColor: color + '33', background: color + '05' }}>
      <div className="text-3xl opacity-30">{isHuman ? '👤' : '🤖'}</div>
      <p className="text-xs uppercase tracking-widest opacity-40" style={{ color, fontFamily: 'var(--font-mono)' }}>No {label}s yet</p>
      <p className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Be the first to launch</p>
      <Link href={href} className="text-xs uppercase tracking-widest border px-4 py-2 hover:bg-white hover:text-[#050d18] transition-colors duration-200" style={{ color, borderColor: color + '66', fontFamily: 'var(--font-syne)' }}>{cta}</Link>
    </div>
  )
}
