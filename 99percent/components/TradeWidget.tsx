'use client'
import { useState } from 'react'
import { useAccount } from 'wagmi'

interface TradeWidgetProps {
  contractAddress: string
  launchType?: string
  tokenSymbol: string
  tokenName: string
}

export default function TradeWidget({ contractAddress, launchType, tokenSymbol, tokenName }: TradeWidgetProps) {
  const [tab, setTab] = useState<'buy'|'sell'>('buy')
  const { isConnected } = useAccount()

  // Per tutti i token usa Uniswap embed su Base
  const uniswapUrl = `https://app.uniswap.org/swap?chain=base&outputCurrency=${contractAddress}&theme=dark`

  return (
    <div style={{ border: '1px solid rgba(41,212,245,0.15)', borderRadius: 12, overflow: 'hidden', background: '#070f1c' }}>
      {/* Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(41,212,245,0.1)' }}>
        {(['buy','sell'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
            background: tab === t ? 'rgba(41,212,245,0.08)' : 'transparent',
            color: tab === t ? '#29d4f5' : 'rgba(255,255,255,0.4)',
            fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: tab === t ? '2px solid #29d4f5' : '2px solid transparent',
            transition: 'all 0.2s',
          }}>
            {t === 'buy' ? '↑ Buy' : '↓ Sell'} {tokenSymbol}
          </button>
        ))}
      </div>

      {/* Uniswap iframe embed */}
      <div style={{ position: 'relative', width: '100%', height: 420 }}>
        <iframe
          src={tab === 'buy' ? uniswapUrl : `https://app.uniswap.org/swap?chain=base&inputCurrency=${contractAddress}&theme=dark`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="clipboard-write"
          title={`Trade ${tokenName}`}
        />
      </div>

      {/* Footer info */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(41,212,245,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
          {launchType === 'doppler' ? 'Doppler bonding curve • Base' : 'Uniswap V3 • Base'}
        </span>
        
          href={`https://dexscreener.com/base/${contractAddress}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(41,212,245,0.5)', textDecoration: 'none' }}
        >
          DexScreener ↗
        </a>
      </div>
    </div>
  )
}
