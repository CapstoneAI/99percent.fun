'use client'
import TradeWidget from '@/components/TradeWidget'

import { useState } from 'react'
import Link from 'next/link'
import { postComment } from '@/lib/api'
import { useAccount } from 'wagmi'

interface Token {
  id: number
  name: string
  ticker: string
  type: 'human' | 'agent'
  contract_address: string
  creator_wallet: string
  description: string
  image_url: string
  twitter_url: string
  telegram_url: string
  website_url: string
  agent_name?: string
  proof_url?: string
  volume_usd: number
  market_cap: number
  created_at: string
  launch_type?: string
}

interface Comment {
  id: number
  wallet: string
  content: string
  created_at: string
  launch_type?: string
}

export default function TokenPageClient({ token, comments: initialComments, address }: {
  token: Token
  comments: Comment[]
  address: string
}) {
  const [tab, setTab] = useState<'comments' | 'trades'>('comments')
  const [comments, setComments] = useState(initialComments)
  const [comment, setComment] = useState('')
  const [posting, setPosting] = useState(false)
  const { address: wallet, isConnected } = useAccount()

  const color = token.type === 'human' ? '#29d4f5' : '#0052ff'
  const emoji = token.type === 'human' ? 'Human' : 'Agent'
  const contractAddr = token.contract_address || String(token.id)

  const battlePercent = Math.min((Number(token.volume_usd) / 1_000_000) * 100, 100)
  const milestone = Number(token.volume_usd) >= 1_000_000 ? 'ON FIRE'
    : Number(token.volume_usd) >= 100_000 ? 'MOONING'
    : Number(token.volume_usd) >= 10_000 ? 'HEATING UP' : null

  async function handleComment() {
    if (!wallet || !comment.trim()) return
    setPosting(true)
    try {
      const result = await postComment(contractAddr, wallet, comment)
      setComments([result.comment, ...comments])
      setComment('')
    } catch (e) {
      console.error(e)
    }
    setPosting(false)
  }

  function formatWallet(w: string) {
    return w ? w.slice(0,6) + '...' + w.slice(-4) : '???'
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff/60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m/60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h/24)}d ago`
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out $${token.ticker} on 99percent.fun!\n\n${token.type === 'human' ? 'Human' : 'Agent'} token on Base\n\nhttps://99percent.one/token/${contractAddr}\n\n#Base #DeFi #99percent`
  )}`

  return (
    <main className="min-h-screen bg-[#050d18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-wrap" style={{alignItems:"center"}}>
          <Link href="/" className="text-[#4a6080] hover:text-white transition-colors text-sm">←</Link>
          {token.image_url && <img src={token.image_url} alt={token.name} style={{width:56,height:56,borderRadius:8,objectFit:"cover",border:"2px solid #1a2a45",flexShrink:0,display:"block",alignSelf:"center"}} />}
          <span className="text-white font-black text-lg" style={{fontFamily:'var(--font-syne)'}}>{token.name}</span>
          <span className="px-2 py-0.5 text-xs font-bold" style={{color,background:`${color}20`,fontFamily:'var(--font-mono)'}}>${token.ticker}</span>
          <span className="px-2 py-0.5 text-xs border" style={{color,borderColor:color,fontFamily:'var(--font-mono)'}}>{emoji}</span>
          <span className="text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>by {formatWallet(token.creator_wallet)}</span>
          <div className="ml-auto flex items-center gap-2">
            {/* Copy address */}
            {token.contract_address && (
              <button
                onClick={() => {navigator.clipboard.writeText(token.contract_address!); alert('Address copied!')}}
                style={{display:'flex',alignItems:'center',gap:4,padding:'4px 10px',borderRadius:6,border:'1px solid #1a2a45',background:'#0a1628',color:'#6a8aaa',fontSize:11,fontFamily:'monospace',cursor:'pointer'}}
              >
                {token.contract_address.slice(0,6)}...{token.contract_address.slice(-4)}
                <span style={{fontSize:12}}>📋</span>
              </button>
            )}
            {token.contract_address && (
              <>
                <a href={`https://dexscreener.com/base/${token.contract_address}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 border border-[#1a2a45] text-xs hover:border-[#29d4f5] transition-all"
                  style={{fontFamily:'var(--font-mono)',color:'#4a6080'}}>DexScreener</a>
                <a href={`https://basescan.org/token/${token.contract_address}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 border border-[#1a2a45] text-xs hover:border-[#29d4f5] transition-all"
                  style={{fontFamily:'var(--font-mono)',color:'#4a6080'}}>Basescan</a>
              </>
            )}
            <a href={tweetUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 border border-[#1a2a45] text-xs hover:border-[#29d4f5] transition-all"
              style={{fontFamily:'var(--font-mono)',color:'#4a6080'}}>Share X</a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Chart */}
            <div className="border border-[#1a2a45] overflow-hidden" style={{height:'400px'}}>
              {token.contract_address ? (
                <iframe
                  src={`https://www.geckoterminal.com/base/pools/${token.contract_address}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
                  className="w-full h-full" style={{border:'none'}} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>
                  Chart available after token deploys on-chain
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                {label:'Price', value: token.contract_address ? '—' : '$0'},
                {label:'MCap', value: `$${Number(token.market_cap).toLocaleString()}`},
                {label:'Vol 24h', value: `$${Number(token.volume_usd).toLocaleString()}`},
                {label:'Created', value: timeAgo(token.created_at)},
              ].map(s => (
                <div key={s.label} className="border border-[#1a2a45] bg-[#0d1f35] p-3">
                  <div className="text-xs text-[#4a6080] mb-1" style={{fontFamily:'var(--font-mono)'}}>{s.label}</div>
                  <div className="text-sm font-bold text-white" style={{fontFamily:'var(--font-syne)'}}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Battle bar */}
            <div className="border border-[#1a2a45] bg-[#0d1f35] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{color,fontFamily:'var(--font-mono)'}}>
                  {token.type === 'human' ? 'Human' : 'Agent'} Volume
                </span>
                {milestone && <span className="text-xs px-2 py-0.5 border" style={{color,borderColor:color,fontFamily:'var(--font-mono)'}}>{milestone}</span>}
                <span className="text-xs text-white font-bold" style={{fontFamily:'var(--font-mono)'}}>${Number(token.volume_usd).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-[#1a2a45] overflow-hidden relative">
                <div className="h-full transition-all duration-1000" style={{width:`${battlePercent}%`,background:`linear-gradient(90deg,${color},${color}88)`}} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>$0</span>
                <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>$1M</span>
              </div>
            </div>

            {/* Comments/Trades */}
            <div className="border border-[#1a2a45]">
              <div className="flex border-b border-[#1a2a45]">
                {(['comments','trades'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="px-4 py-3 text-xs uppercase tracking-widest transition-all"
                    style={{
                      fontFamily:'var(--font-mono)',
                      color: tab===t ? '#29d4f5' : '#4a6080',
                      borderBottom: tab===t ? '2px solid #29d4f5' : '2px solid transparent'
                    }}>
                    {t} {t==='comments' ? `(${comments.length})` : ''}
                  </button>
                ))}
              </div>

              {tab === 'comments' && (
                <div className="p-4 flex flex-col gap-4">
                  {isConnected ? (
                    <div className="flex gap-2">
                      <input value={comment} onChange={e => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-[#050d18] border border-[#1a2a45] px-3 py-2 text-white text-xs outline-none focus:border-[#29d4f5] transition-colors"
                        style={{fontFamily:'var(--font-mono)'}}
                        onKeyDown={e => e.key==='Enter' && handleComment()} />
                      <button onClick={handleComment} disabled={posting || !comment.trim()}
                        className="px-4 py-2 text-xs font-bold disabled:opacity-30"
                        style={{background:'#29d4f5',color:'#050d18',fontFamily:'var(--font-syne)'}}>
                        Post
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-[#4a6080] text-center py-2" style={{fontFamily:'var(--font-mono)'}}>
                      Connect wallet to comment
                    </div>
                  )}
                  {comments.length === 0 ? (
                    <div className="text-xs text-[#4a6080] text-center py-4" style={{fontFamily:'var(--font-mono)'}}>
                      No comments yet. Be the first!
                    </div>
                  ) : comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs" style={{background:`${color}20`,color}}>
                        {c.wallet.slice(2,4).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold" style={{color,fontFamily:'var(--font-mono)'}}>{formatWallet(c.wallet)}</span>
                          <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-xs text-white" style={{fontFamily:'var(--font-mono)'}}>{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'trades' && (
                <div className="p-4 text-xs text-[#4a6080] text-center py-8" style={{fontFamily:'var(--font-mono)'}}>
                  Trades available after token deploys on-chain
                </div>
              )}
            </div>
          </div>

          {/* Right */}

          {/* Trade Widget */}
          {token.contract_address && (
            <TradeWidget
              contractAddress={token.contract_address}
              launchType={(token as any).launch_type}
              tokenSymbol={token.ticker}
              tokenName={token.name}
            />
          )}


          {/* Token info */}
            <div className="border border-[#1a2a45] bg-[#0d1f35] p-4">
              <div className="text-xs font-bold text-white mb-3 uppercase tracking-widest" style={{fontFamily:'var(--font-syne)'}}>Token Info</div>
              <div className="flex flex-col gap-2">
                {[
                  {label:'Contract', value: token.contract_address ? formatWallet(token.contract_address) : 'Pending'},
                  {label:'Chain', value: 'Base'},
                  {label:'Type', value: token.type === 'human' ? 'Human' : 'Agent'},
                  {label:'Creator', value: formatWallet(token.creator_wallet)},
        ...(token.agent_name ? [{label:'Suggested by', value: token.agent_name}] : []),
                ].map(i => (
                  <div key={i.label} className="flex justify-between">
                    <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{i.label}</span>
                    <span className="text-xs text-white" style={{fontFamily:'var(--font-mono)'}}>{i.value}</span>
                  </div>
                ))}
              </div>
              {token.proof_url && (
                <a href={token.proof_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-3 border border-[#0052ff] px-3 py-2 hover:bg-[#0052ff10] transition-all"
                  style={{fontFamily:'var(--font-mono)'}}>
                  <span className="text-xs text-[#0052ff] font-bold">🔗 View Agent Proof</span>
                  <span className="text-xs text-[#4a6080]">
                    {token.proof_url.startsWith('https://x.com') ? 'X (Twitter)' : 'Telegram'}
                  </span>
                </a>
              )}
              {token.description && (
                <p className="text-xs text-[#4a6080] mt-3 border-t border-[#1a2a45] pt-3" style={{fontFamily:'var(--font-mono)'}}>
                  {token.description}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {token.twitter_url && <a href={token.twitter_url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 border border-[#1a2a45] hover:border-[#29d4f5] transition-all" style={{fontFamily:'var(--font-mono)',color:'#4a6080'}}>X</a>}
                {token.telegram_url && <a href={token.telegram_url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 border border-[#1a2a45] hover:border-[#29d4f5] transition-all" style={{fontFamily:'var(--font-mono)',color:'#4a6080'}}>TG</a>}
                {token.website_url && <a href={token.website_url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 border border-[#1a2a45] hover:border-[#29d4f5] transition-all" style={{fontFamily:'var(--font-mono)',color:'#4a6080'}}>Web</a>}
              </div>
            </div>
          </div>
        </div>
    </main>
  )
}
