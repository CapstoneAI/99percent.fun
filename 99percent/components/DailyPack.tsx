'use client'

import { useState, useEffect } from 'react'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'

function getSecondsUntilMidnightUTC() {
  const now = new Date()
  const midnight = new Date()
  midnight.setUTCHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function formatCountdown(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0')
}

const MOCK_TOKEN = { name: 'Based Pepe', ticker: 'BPEPE', type: 'human' as const, volumeUsd: 42000, address: '0x0001' }
type State = 'idle' | 'shaking' | 'exploding' | 'revealed'

export default function DailyPack() {
  const [state, setState] = useState<State>('idle')
  const [countdown, setCountdown] = useState(getSecondsUntilMidnightUTC())
  const [alreadyOpened, setAlreadyOpened] = useState(false)
  const [particles, setParticles] = useState<{id:number,x:number,y:number,color:string}[]>([])
  const today = new Date().toISOString().slice(0,10)

  useEffect(() => {
    const savedDate = localStorage.getItem('dailypack_date')
    const savedRevealed = localStorage.getItem('dailypack_revealed')
    if (savedDate === today) {
      setAlreadyOpened(true)
      if (savedRevealed === 'true') setState('revealed')
    }
  }, [today])

  useEffect(() => {
    const t = setInterval(() => setCountdown(getSecondsUntilMidnightUTC()), 1000)
    return () => clearInterval(t)
  }, [])

  function handleOpen() {
    if (alreadyOpened || state !== 'idle') return
    setState('shaking')
    setTimeout(() => {
      setState('exploding')
      const colors = ['#29d4f5','#0052ff','#ffffff','#a855f7']
      setParticles(Array.from({length:16},(_,i) => ({
        id: i, x: (Math.random()-0.5)*220, y: (Math.random()-0.5)*220, color: colors[i%colors.length]
      })))
    }, 700)
    setTimeout(() => {
      setState('revealed')
      setAlreadyOpened(true)
      localStorage.setItem('dailypack_date', today)
      localStorage.setItem('dailypack_revealed', 'true')
    }, 1500)
  }

  return (
    <div className="border border-[#1a2a45] bg-[#0d1f35] p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{fontFamily:'var(--font-syne)'}}>
            Daily Pack
          </h2>
          <p className="text-xs text-[#4a6080] mt-0.5" style={{fontFamily:'var(--font-mono)'}}>
            One random token gets the spotlight - resets at midnight UTC
          </p>
        </div>
        {alreadyOpened && (
          <div className="text-right">
            <div className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>Next pack in</div>
            <div className="text-sm font-bold" style={{color:'#29d4f5',fontFamily:'var(--font-mono)'}}>{formatCountdown(countdown)}</div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-8 min-h-[160px]">
        {state !== 'revealed' && (
          <div onClick={handleOpen}
            className="relative flex-shrink-0 w-36 h-44 border-2 flex flex-col items-center justify-center gap-3 select-none"
            style={{
              borderColor: alreadyOpened ? '#1a2a45' : '#29d4f5',
              background: alreadyOpened ? '#080f1c' : 'linear-gradient(135deg,#0d2030,#0d1f35)',
              cursor: alreadyOpened ? 'default' : 'pointer',
              boxShadow: alreadyOpened ? 'none' : '0 0 24px #29d4f525',
              animation: state==='shaking' ? 'pack-shake 0.12s ease-in-out infinite' : state==='exploding' ? 'pack-explode 0.5s ease-out forwards' : 'none',
            }}>
            {particles.map(p => (
              <div key={p.id} className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{background:p.color,left:'50%',top:'50%',
                  animation:state==='exploding'?'particle-fly 0.7s ease-out forwards':'none',
                  ['--tx' as string]:`${p.x}px`,['--ty' as string]:`${p.y}px`}}/>
            ))}
            {alreadyOpened ? (
              <>
                <span className="text-4xl opacity-20">box</span>
                <span className="text-xs text-[#2a3a50] text-center px-2" style={{fontFamily:'var(--font-mono)'}}>Come back<br/>tomorrow</span>
              </>
            ) : (
              <>
                <div className="text-5xl" style={{animation:'float 2s ease-in-out infinite'}}>gift</div>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1"
                  style={{color:'#050d18',background:'#29d4f5',fontFamily:'var(--font-mono)'}}>OPEN</span>
              </>
            )}
          </div>
        )}
        {state === 'revealed' && (
          <div className="flex items-center gap-6 animate-fade-in w-full">
            <Link href={`/token/${MOCK_TOKEN.address}`}>
              <TokenCard name={MOCK_TOKEN.name} ticker={MOCK_TOKEN.ticker} type={MOCK_TOKEN.type} volumeUsd={MOCK_TOKEN.volumeUsd}/>
            </Link>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-white text-sm font-black mb-1" style={{fontFamily:'var(--font-syne)'}}>Today's Spotlight</div>
                <div className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>
                  ${MOCK_TOKEN.ticker} is pinned to the top<br/>of the feed for 24 hours
                </div>
              </div>
              <div className="text-xs" style={{fontFamily:'var(--font-mono)',color:'#29d4f5'}}>Pinned in feed for 24h</div>
              <div className="text-xs" style={{fontFamily:'var(--font-mono)',color:'#29d4f5'}}>Featured badge on card</div>
              <Link href={`/token/${MOCK_TOKEN.address}`}
                className="text-xs px-3 py-2 font-bold text-center uppercase tracking-widest hover:opacity-80 transition-opacity"
                style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)'}}>
                Trade ${MOCK_TOKEN.ticker}
              </Link>
            </div>
          </div>
        )}
        {!alreadyOpened && state === 'idle' && (
          <div className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>
            <div className="text-white text-sm font-bold mb-2" style={{fontFamily:'var(--font-syne)'}}>Open today's pack!</div>
            <div>One lucky token gets pinned</div>
            <div>to the top for 24 hours</div>
            <div className="mt-3" style={{color:'#29d4f5'}}>Click the box to reveal</div>
          </div>
        )}
      </div>
    </div>
  )
}
