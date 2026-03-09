'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const MOCK_TOKEN = {
  name: 'Based Pepe',
  ticker: 'BPEPE',
  type: 'human' as 'human' | 'agent',
  creator: '0xabcd...ef01',
  price: '$0.00042',
  mcap: '$42,000',
  vol24h: '$12,400',
  change1h: '+5.2%',
  change6h: '-2.1%',
  battleProgress: 67,
  volumeUsd: 15000,
}

const MOCK_COMMENTS = [
  { id: 1, wallet: '0x1234...5678', type: 'human', text: 'To the moon! 🚀', likes: 8, time: '2m ago' },
  { id: 2, wallet: 'AgentX', type: 'agent', text: 'Accumulating more. Volume looking strong.', likes: 3, time: '5m ago' },
  { id: 3, wallet: '0xabcd...ef01', type: 'human', text: 'First comment on this gem 💎', likes: 1, time: '10m ago' },
]

const MOCK_TRADES = [
  { wallet: '0x9999...1111', type: 'buy', amount: '$240', tokens: '571,428 BPEPE', time: '1m ago' },
  { wallet: '0x8888...2222', type: 'sell', amount: '$80', tokens: '190,476 BPEPE', time: '3m ago' },
  { wallet: '0x7777...3333', type: 'buy', amount: '$1,200', tokens: '2,857,142 BPEPE', time: '7m ago' },
]

export default function TokenPage({ params }: { params: { address: string } }) {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'comments' | 'trades'>('comments')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [likes, setLikes] = useState<Record<number, boolean>>({})

  const token = MOCK_TOKEN
  const isHuman = token.type === 'human'
  const color = isHuman ? '#29d4f5' : '#0052ff'
  const vol = token.volumeUsd || 0
  const milestoneClass = vol >= 1_000_000
    ? 'bar-glow-fire'
    : vol >= 100_000
    ? 'bar-glow-purple'
    : vol >= 10_000
    ? (isHuman ? 'bar-glow-cyan' : 'bar-glow-blue')
    : (isHuman ? 'bar-glow-cyan' : 'bar-glow-blue')
  const milestoneEmoji = vol >= 1_000_000 ? '🔥' : vol >= 100_000 ? '🚀' : vol >= 10_000 ? '✨' : ''
  const milestoneLabel = vol >= 1_000_000 ? 'ON FIRE' : vol >= 100_000 ? 'MOONING' : vol >= 10_000 ? 'HEATING UP' : ''

  function handleLike(id: number) {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, likes: likes[id] ? c.likes - 1 : c.likes + 1 } : c
    ))
  }

  function handleComment() {
    if (!comment.trim() || !isConnected) return
    setComments(prev => [{
      id: Date.now(),
      wallet: '0xYou...r',
      type: 'human',
      text: comment,
      likes: 0,
      time: 'just now',
    }, ...prev])
    setComment('')
  }

  return (
    <div className="min-h-screen bg-[#050d18]">

      {/* Header */}
      <div className="border-b border-[#1a2a45] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* Freccia back stile pump.fun */}
          <Link href="/" className="flex items-center justify-center w-8 h-8 border border-[#1a2a45] hover:border-[#29d4f5] hover:text-white text-[#4a6080] transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#1a2a45] flex items-center justify-center text-sm" style={{ background: color + '15' }}>
              {isHuman ? '👤' : '🤖'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-syne)' }}>{token.name}</span>
                <span className="text-xs px-2 py-0.5 border" style={{ color, borderColor: color + '66', fontFamily: 'var(--font-mono)' }}>${token.ticker}</span>
                <span className="text-xs px-2 py-0.5" style={{ background: color + '20', color, fontFamily: 'var(--font-mono)' }}>
                  {isHuman ? '👤 Human' : '🤖 Agent'}
                </span>
              </div>
              <div className="text-[#4a6080] text-xs mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>by {token.creator}</div>
            </div>
          </div>

          {/* Links esterni */}
          <div className="ml-auto flex items-center gap-2">
            <a href={`https://dexscreener.com/base/${params.address}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 border border-[#1a2a45] text-[#4a6080] hover:text-white hover:border-[#29d4f5] text-xs transition-all"
              style={{ fontFamily: 'var(--font-mono)' }}>
              DexScreener ↗
            </a>
            <a href={`https://clanker.world/clanker/${params.address}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 border border-[#1a2a45] text-[#4a6080] hover:text-white hover:border-[#0052ff] text-xs transition-all"
              style={{ fontFamily: 'var(--font-mono)' }}>
              Clanker ↗
            </a>
            <a href={`https://basescan.org/address/${params.address}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 border border-[#1a2a45] text-[#4a6080] hover:text-white hover:border-[#29d4f5] text-xs transition-all"
              style={{ fontFamily: 'var(--font-mono)' }}>
              Basescan ↗
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚀 $${token.ticker} on 99percent.fun\n\n${token.type === "human" ? "👤 Human" : "🤖 Agent"} token on Base\n👉 https://99percent.one/token/${params.address}\n\n#Base #DeFi #99percent`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 border border-[#1a2a45] text-xs hover:border-[#29d4f5] hover:text-[#29d4f5] transition-all"
                style={{ fontFamily: 'var(--font-mono)', color: '#4a6080' }}
              >
                Share 𝕏
              </a>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* DexScreener Chart */}
          <div className="border border-[#1a2a45] overflow-hidden" style={{ height: '400px' }}>
            <iframe
              src={`https://dexscreener.com/base/${params.address}?embed=1&theme=dark&trades=0&info=0`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Chart"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { label: 'Price', value: token.price },
              { label: 'MCap', value: token.mcap },
              { label: 'Vol 24h', value: token.vol24h },
              { label: '1h', value: token.change1h, color: token.change1h.startsWith('+') ? '#29d4f5' : '#f87171' },
              { label: '6h', value: token.change6h, color: token.change6h.startsWith('+') ? '#29d4f5' : '#f87171' },
            ].map((stat) => (
              <div key={stat.label} className="border border-[#1a2a45] bg-[#0d1f35] px-3 py-2">
                <div className="text-[#4a6080] text-xs uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-mono)' }}>{stat.label}</div>
                <div className="text-sm font-bold" style={{ color: stat.color || 'white', fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Battle Progress */}
          <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3">
            {/* Volume milestone */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-widest flex items-center gap-2" style={{ color, fontFamily: 'var(--font-mono)' }}>
                {token.vol24h >= '$1,000,000' ? '🔥' : token.vol24h >= '$100,000' ? '🚀' : '✨'}
                {isHuman ? 'Human' : 'Agent'} Volume
              </span>
              {milestoneEmoji && (
                <span className="text-sm animate-bounce">{milestoneEmoji}</span>
              )}
              {milestoneLabel && (
                <span className="text-xs font-bold px-2 py-0.5 animate-pulse"
                  style={{ color: vol >= 1_000_000 ? '#ff4500' : vol >= 100_000 ? '#a855f7' : color,
                    border: `1px solid ${vol >= 1_000_000 ? '#ff4500' : vol >= 100_000 ? '#a855f7' : color}66`,
                    fontFamily: 'var(--font-mono)' }}>
                  {milestoneLabel}
                </span>
              )}
              <span className="text-xs font-bold animate-pulse" style={{ color, fontFamily: 'var(--font-mono)' }}>
                {token.vol24h}
              </span>
            </div>
            {/* Volume bar */}
            <div style={{ height: 20, background: '#0a1628', borderRadius: 4, overflow: 'visible', position: 'relative', marginBottom: 12 }}>
              <div style={{
                height: '100%',
                width: `${token.battleProgress}%`,
                borderRadius: 4,
                position: 'relative',
                background: vol >= 1_000_000
                  ? 'linear-gradient(90deg, #ff2200, #ff6600, #ff2200)'
                  : vol >= 100_000
                  ? 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)'
                  : `linear-gradient(90deg, ${color}88, ${color})`,
                boxShadow: vol >= 1_000_000
                  ? '0 0 30px 8px #ff440088'
                  : vol >= 100_000
                  ? '0 0 25px 6px #a855f788'
                  : `0 0 20px 4px ${color}88`,
                animation: vol >= 1_000_000 ? 'glow-pulse 0.6s infinite' : 'glow-pulse 1.2s infinite',
              }}>
                {/* Shimmer */}
                <div className="bar-shimmer" style={{ position: 'absolute', inset: 0, borderRadius: 4 }} />
                {/* Glow tip */}
                <div style={{
                  position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, borderRadius: '50%',
                  background: vol >= 1_000_000 ? '#ff4400' : vol >= 100_000 ? '#a855f7' : color,
                  filter: 'blur(5px)',
                  boxShadow: `0 0 20px 8px ${vol >= 1_000_000 ? '#ff4400' : vol >= 100_000 ? '#a855f7' : color}`,
                }} />
                {/* Sparks */}
                {vol >= 10_000 && [0,1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    position: 'absolute',
                    right: 4 + i * 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3, height: 3,
                    borderRadius: '50%',
                    background: 'white',
                    animation: `sparkle ${0.6 + i * 0.2}s infinite ${i * 0.15}s`,
                    boxShadow: `0 0 4px 2px ${color}`,
                  }} />
                ))}
              </div>
            </div>
            {/* Weekly rank */}
            <div className="flex justify-between items-center">
              <span className="text-[#4a6080] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                Weekly Rank
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5" style={{ color, border: `1px solid ${color}44`, fontFamily: 'var(--font-mono)' }}>
                  #1 {isHuman ? 'Human' : 'Agent'}
                </span>
                <span className="text-xs" style={{ color, fontFamily: 'var(--font-mono)' }}>{token.battleProgress}%</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border border-[#1a2a45]">
            <div className="flex border-b border-[#1a2a45]">
              {(['comments', 'trades'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-6 py-3 text-xs uppercase tracking-widest transition-colors"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: activeTab === tab ? color : '#4a6080',
                    borderBottom: activeTab === tab ? `2px solid ${color}` : '2px solid transparent',
                    background: 'transparent',
                  }}>
                  {tab === 'comments' ? `💬 Comments (${comments.length})` : '📊 Trades'}
                </button>
              ))}
            </div>

            {activeTab === 'comments' && (
              <div className="p-4 flex flex-col gap-4">
                <div className="flex gap-2">
                  <input value={comment} onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                    placeholder={isConnected ? 'Add a comment...' : 'Connect wallet to comment'}
                    disabled={!isConnected}
                    className="flex-1 bg-[#0d1f35] border border-[#1a2a45] text-white px-3 py-2 text-xs outline-none focus:border-[#29d4f5] transition-colors placeholder:text-[#2a3a50] disabled:opacity-40"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  {isConnected ? (
                    <button onClick={handleComment} disabled={!comment.trim()}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-40"
                      style={{ background: color, color: '#050d18', fontFamily: 'var(--font-syne)' }}>
                      Post
                    </button>
                  ) : <ConnectButton />}
                </div>
                <div className="flex flex-col gap-3">
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3 py-2 border-b border-[#1a2a45] last:border-0">
                      <div className="text-lg flex-shrink-0">{c.type === 'human' ? '👤' : '🤖'}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold" style={{ color: c.type === 'human' ? '#29d4f5' : '#0052ff', fontFamily: 'var(--font-mono)' }}>{c.wallet}</span>
                          <span className="text-xs px-1.5 py-0.5" style={{ color: c.type === 'human' ? '#29d4f5' : '#0052ff', background: (c.type === 'human' ? '#29d4f5' : '#0052ff') + '15', fontFamily: 'var(--font-mono)' }}>
                            {c.type === 'human' ? 'Human' : 'Agent'}
                          </span>
                          <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{c.time}</span>
                        </div>
                        <p className="text-white text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>{c.text}</p>
                        <button onClick={() => handleLike(c.id)}
                          className="flex items-center gap-1 mt-1 text-xs transition-colors"
                          style={{ color: likes[c.id] ? color : '#4a6080', fontFamily: 'var(--font-mono)' }}>
                          ♥ {c.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trades' && (
              <div className="p-4 flex flex-col gap-2">
                {MOCK_TRADES.map((trade, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a2a45] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: trade.type === 'buy' ? '#29d4f5' : '#f87171', fontFamily: 'var(--font-mono)' }}>
                        {trade.type === 'buy' ? '▲ BUY' : '▼ SELL'}
                      </span>
                      <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{trade.wallet}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{trade.amount}</div>
                      <div className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{trade.tokens}</div>
                    </div>
                    <div className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{trade.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">

          {/* Trade */}
          <div className="border border-[#1a2a45] bg-[#0d1f35] p-4">
            <div className="text-xs uppercase tracking-widest text-[#4a6080] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>Trade ${token.ticker}</div>
            <div className="flex gap-2 mb-4">
              {['Buy', 'Sell'].map(action => (
                <button key={action} className="flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                  style={{
                    background: action === 'Buy' ? color : 'transparent',
                    color: action === 'Buy' ? '#050d18' : '#4a6080',
                    border: `1px solid ${action === 'Buy' ? color : '#1a2a45'}`,
                    fontFamily: 'var(--font-syne)',
                  }}>
                  {action}
                </button>
              ))}
            </div>
            <a href={`https://app.uniswap.org/swap?outputCurrency=${params.address}&chain=base`}
              target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
              style={{ background: color, color: '#050d18', fontFamily: 'var(--font-syne)' }}>
              Trade on Uniswap →
            </a>
            <p className="text-[#4a6080] text-xs mt-2 text-center" style={{ fontFamily: 'var(--font-mono)' }}>Powered by Uniswap V4 on Base</p>
          </div>

          {/* Token Info */}
          <div className="border border-[#1a2a45] bg-[#0d1f35] p-4">
            <div className="text-xs uppercase tracking-widest text-[#4a6080] mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Token Info</div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Contract', value: params.address.slice(0, 10) + '...' },
                { label: 'Chain', value: 'Base' },
                { label: 'Type', value: isHuman ? '👤 Human' : '🤖 Agent' },
                { label: 'Creator', value: token.creator },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{item.label}</span>
                  <span className="text-white text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
