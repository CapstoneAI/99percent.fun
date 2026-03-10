'use client'

import { useState, useEffect } from 'react'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'
import { getDailyPick } from '@/lib/api'

function getSecondsUntilMidnightUTC() {
  const now = new Date()
  const midnight = new Date()
  midnight.setUTCHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}

const TODAY = new Date().toISOString().split('T')[0]

export default function DailyPack() {
  const [state, setState] = useState<'idle'|'shaking'|'exploding'|'revealed'>('idle')
  const [token, setToken] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(getSecondsUntilMidnightUTC())
  const [alreadyOpened, setAlreadyOpened] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedDate = localStorage.getItem('dailypack_date')
    const savedRevealed = localStorage.getItem('dailypack_revealed')
    if (savedDate === TODAY && savedRevealed === 'true') {
      setAlreadyOpened(true)
      setState('revealed')
    }
  }, [])

  useEffect(() => {
    getDailyPick().then(data => {
      if (data?.token) setToken(data.token)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getSecondsUntilMidnightUTC()), 1000)
    return () => clearInterval(interval)
  }, [])

  function handleOpen() {
    if (state !== 'idle' || alreadyOpened || !token) return
    setState('shaking')
    setTimeout(() => {
      setState('exploding')
      setTimeout(() => {
        setState('revealed')
        localStorage.setItem('dailypack_date', TODAY)
        localStorage.setItem('dailypack_revealed', 'true')
      }, 800)
    }, 700)
  }

  const tokenAddress = token?.contract_address || token?.id

  if (loading) return null

  if (!token) return null

  return (
    <section className="border-b border-[#1a2a45] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white" style={{fontFamily:'var(--font-syne)'}}>
              Daily Pack
            </h2>
            <p className="text-xs text-[#4a6080] mt-0.5" style={{fontFamily:'var(--font-mono)'}}>
              One random token gets the spotlight — resets at midnight UTC
            </p>
          </div>
          <div className="text-xs text-[#29d4f5] font-bold" style={{fontFamily:'var(--font-mono)'}}>
            Resets in {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Pack box */}
          <div
            onClick={handleOpen}
            className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center border border-[#1a2a45] bg-[#0d1f35] cursor-pointer select-none overflow-hidden"
            style={{
              animation: state === 'shaking' ? 'pack-shake 0.1s ease-in-out infinite'
                : state === 'exploding' ? 'pack-explode 0.8s ease-out forwards' : 'none'
            }}>
            {state !== 'revealed' && (
              <>
                <div className="text-5xl" style={{animation:'float 2s ease-in-out infinite'}}>🎁</div>
                <span className="absolute bottom-2 text-xs font-black uppercase tracking-widest px-3 py-1"
                  style={{color:'#050d18',background:'#29d4f5',fontFamily:'var(--font-mono)'}}>
                  {alreadyOpened ? 'OPENED' : 'OPEN'}
                </span>
              </>
            )}
          </div>

          {/* Content */}
          {state === 'revealed' && token ? (
            <div className="flex items-center gap-6 animate-fade-in w-full">
              <Link href={`/token/${tokenAddress}`}>
                <TokenCard
                  name={token.name}
                  ticker={token.ticker}
                  type={token.type}
                  imageUrl={token.image_url}
                  volumeUsd={token.volume_usd}
                />
              </Link>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-white text-sm font-bold mb-1" style={{fontFamily:'var(--font-syne)'}}>Today's Spotlight</div>
                  <div className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>
                    ${token.ticker} is pinned to the top<br/>of the feed for 24 hours
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs" style={{fontFamily:'var(--font-mono)',color:'#29d4f5'}}>Pinned in feed for 24h</div>
                  <div className="text-xs" style={{fontFamily:'var(--font-mono)',color:'#29d4f5'}}>Featured badge on card</div>
                </div>
                <Link href={`/token/${tokenAddress}`}
                  className="text-xs px-3 py-2 font-bold text-center uppercase tracking-widest hover:opacity-80 transition-opacity"
                  style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)'}}>
                  Trade ${token.ticker}
                </Link>
              </div>
            </div>
          ) : (
            !alreadyOpened && state === 'idle' && (
              <div className="flex flex-col gap-1">
                <div className="text-white text-sm font-bold mb-1" style={{fontFamily:'var(--font-syne)'}}>Open today's pack!</div>
                <div className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>One lucky token gets pinned</div>
                <div className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>to the top for 24 hours</div>
                <div className="mt-3 text-xs" style={{color:'#29d4f5',fontFamily:'var(--font-mono)'}}>Click the box to reveal</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
