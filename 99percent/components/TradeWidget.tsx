'use client'
import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction, usePublicClient } from 'wagmi'
import { parseEther, formatEther, encodeFunctionData } from 'viem'

const ALIEN = 'https://res.cloudinary.com/downrfwwt/image/upload/v1773432793/ChatGPT_Image_13_mar_2026_21_01_48_iwof3p.png'
const UNISWAP_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481' // Universal Router Base
const WETH = '0x4200000000000000000000000000000000000006'

interface Props {
  contractAddress: string
  launchType?: string
  tokenSymbol: string
  tokenName: string
  imageUrl?: string
}

export default function TradeWidget({ contractAddress, tokenSymbol, tokenName, imageUrl, launchType }: Props) {
  const [tab, setTab] = useState<'buy'|'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const handleTrade = async () => {
    if (!amount || !isConnected) return
    setLoading(true)
    setStatus('Opening wallet...')
    try {
      // Redirect to Uniswap with pre-filled params — wallet already knows the token
      const url = tab === 'buy'
        ? `https://app.uniswap.org/swap?chain=base&outputCurrency=${contractAddress}&exactAmount=${amount}&exactField=input`
        : `https://app.uniswap.org/swap?chain=base&inputCurrency=${contractAddress}&exactAmount=${amount}&exactField=input`
      window.open(url, '_blank')
      setStatus('')
    } catch (e) {
      setStatus('Error')
    }
    setLoading(false)
  }

  const ethBal = ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0'

  return (
    <div style={{ border: '1px solid rgba(41,212,245,0.15)', borderRadius: 14, overflow: 'hidden', background: 'rgba(7,15,28,0.95)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex' }}>
        {(['buy','sell'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '13px', border: 'none', cursor: 'pointer',
            background: tab === t ? (t === 'buy' ? 'rgba(41,212,245,0.1)' : 'rgba(255,77,109,0.1)') : 'transparent',
            color: tab === t ? (t === 'buy' ? '#29d4f5' : '#ff4d6d') : 'rgba(255,255,255,0.35)',
            fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700,
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            borderBottom: tab === t ? `2px solid ${t === 'buy' ? '#29d4f5' : '#ff4d6d'}` : '2px solid transparent',
            transition: 'all 0.2s',
          }}>
            {t === 'buy' ? '↑ Buy' : '↓ Sell'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Token header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 12px', background: 'rgba(41,212,245,0.04)', borderRadius: 10, border: '1px solid rgba(41,212,245,0.1)' }}>
          <img src={imageUrl || ALIEN} alt={tokenSymbol} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(41,212,245,0.3)' }} />
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>{tokenName}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(41,212,245,0.7)' }}>${tokenSymbol}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
            {launchType === 'doppler' ? 'Doppler • Base' : 'Uniswap V3 • Base'}
          </div>
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              {tab === 'buy' ? 'You pay (ETH)' : `You sell ($${tokenSymbol})`}
            </span>
            {isConnected && tab === 'buy' && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(41,212,245,0.5)', cursor: 'pointer' }}
                onClick={() => setAmount(ethBal)}>
                Balance: {ethBal} ETH
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(41,212,245,0.15)', borderRadius: 10, padding: '10px 12px' }}>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.0"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700, color: '#fff', fontVariantNumeric: 'lining-nums' }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              {['0.01','0.05','0.1'].map(v => (
                <button key={v} onClick={() => setAmount(v)} style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, padding: '3px 7px', borderRadius: 5, border: '1px solid rgba(41,212,245,0.2)', background: 'transparent', color: 'rgba(41,212,245,0.6)', cursor: 'pointer' }}>{v}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Trade button */}
        {isConnected ? (
          <button
            onClick={handleTrade}
            disabled={!amount || loading}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: 10, cursor: amount ? 'pointer' : 'not-allowed',
              background: !amount ? 'rgba(255,255,255,0.05)' : tab === 'buy' ? 'linear-gradient(135deg,#29d4f5,#0052ff)' : 'linear-gradient(135deg,#ff4d6d,#7f77dd)',
              color: amount ? '#fff' : 'rgba(255,255,255,0.3)',
              fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800,
              letterSpacing: '0.06em', textTransform: 'uppercase' as const,
              transition: 'all 0.2s',
            }}
          >
            {loading ? status : tab === 'buy' ? `Buy $${tokenSymbol}` : `Sell $${tokenSymbol}`}
          </button>
        ) : (
          <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(41,212,245,0.1)', fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            Connect wallet to trade
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <a href={`https://dexscreener.com/base/${contractAddress}`} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
            DexScreener ↗
          </a>
          <a href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${contractAddress}`} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
            Uniswap ↗
          </a>
        </div>
      </div>
    </div>
  )
}
