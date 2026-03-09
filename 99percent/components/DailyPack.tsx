'use client'

import { useState, useEffect } from 'react'
import TokenCard from '@/components/TokenCard'

function getTimeUntilMidnightUTC() {
  const now = new Date()
  const midnight = new Date()
  midnight.setUTCHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const MOCK_TOKEN = {
  name: 'Based Pepe',
  ticker: 'BPEPE',
  type: 'human' as const,
  volumeUsd: 42000,
}

export default function DailyPack() {
  const [state, setState] = useState<'idle' | 'opening' | 'revealed'>('idle')
  const [countdown, setCountdown] = useState(getTimeUntilMidnightUTC())
  const [alreadyOpened, setAlreadyOpened] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getTimeUntilMidnightUTC()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const opened = localStorage.getItem('dailypack')
    if (opened === today) setAlreadyOpened(true)
  }, [])

  function handleOpen() {
    if (alreadyOpened || state !== 'idle') return
    setState('opening')
    setTimeout(() => {
      setState('revealed')
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem('dailypack', today)
      setAlreadyOpened(true)
    }, 1200)
  }

  const color = '#29d4f5'

  return (
    <section className="border border-[#1a2a45] bg-[#0d1f35] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>
            🎁 Daily Pack
          </h2>
          <p className="text-xs text-[#4a6080] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
            One random token gets the spotlight every day
          </p>
        </div>
        {state === 'revealed' || alreadyOpened ? (
          <div className="text-right">
            <div className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Next pack in</div>
            <div className="text-sm font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>{countdown}</div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-6">
        <div
          onClick={handleOpen}
          className="relative flex-shrink-0 w-32 h-40 border-2 flex flex-col items-center justify-center gap-2 select-none"
          style={{
            borderColor: alreadyOpened ? '#1a2a45' : color,
            background: alreadyOpened ? '#080f1c' : '#0d2030',
            cursor: alreadyOpened ? 'default' : 'pointer',
            opacity: state === 'opening' ? 0 : 1,
            transition: state === 'opening' ? 'opacity 0.3s ease 0.9s' : 'all 0.3s',
          }}
        >
          {alreadyOpened && state !== 'opening' ? (
            <>
              <span className="text-3xl opacity-30">📦</span>
              <span className="text-xs text-[#2a3a50] text-center px-2" style={{ fontFamily: 'var(--font-mono)' }}>
                Come back tomorrow
              </span>
            </>
          ) : (
            <>
              <span className="text-4xl" style={{ animation: 'float 2s ease-in-out infinite' }}>🎁</span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color, fontFamily: 'var(--font-mono)' }}>
                OPEN
              </span>
            </>
          )}
        </div>

        {state === 'revealed' ? (
          <div className="flex items-center gap-4 animate-fade-in">
            <div>
              <div className="text-xs text-[#4a6080] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                ⚡ Today's spotlight token
              </div>
              <TokenCard
                name={MOCK_TOKEN.name}
                ticker={MOCK_TOKEN.ticker}
                type={MOCK_TOKEN.type}
                volumeUsd={MOCK_TOKEN.volumeUsd}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="border border-[#29d4f520] bg-[#29d4f508] px-3 py-2">
                <div className="text-xs font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>📌 Pinned 24h</div>
                <div className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Top of the feed</div>
              </div>
              <div className="border border-[#29d4f520] bg-[#29d4f508] px-3 py-2">
                <div className="text-xs font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>⚡ Featured badge</div>
                <div className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Visible on all cards</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            {alreadyOpened ? (
              <div className="text-xs text-[#4a6080]">
                <div className="text-white text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>Already opened today!</div>
                <div>New pack drops at midnight UTC</div>
                <div className="mt-2 text-lg font-bold" style={{ color }}>{countdown}</div>
              </div>
            ) : (
              <div className="text-xs text-[#4a6080]">
                <div className="text-white text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>Open today's pack!</div>
                <div>One token gets 24h spotlight</div>
                <div>in the feed + featured badge</div>
                <div className="mt-2" style={{ color }}>← Click the box to reveal</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
