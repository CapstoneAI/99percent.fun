'use client'
import { useState } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { parseEther, parseUnits } from 'viem'

const PRESETS = ['0.01', '0.05', '0.1']
const FONT_MONO = "'Space Mono',monospace"
const FONT_SYNE = "'Syne',sans-serif"

export default function TradeWidget({ contractAddress, tokenSymbol }: { contractAddress: string, tokenSymbol: string }) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [quote, setQuote] = useState<any>(null)

  const { address, isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

  async function getQuote() {
    if (!amount || !address) return
    setLoading(true)
    setStatus('Getting quote...')
    try {
      const isBuy = tab === 'buy'
      const params = new URLSearchParams({
        chainId: '8453',
        sellToken: isBuy ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : contractAddress,
        buyToken: isBuy ? contractAddress : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        sellAmount: isBuy ? parseEther(amount).toString() : parseUnits(amount, 18).toString(),
        taker: address,
      })
      const res = await fetch(`https://api.0x.org/swap/permit2/quote?${params}`, {
        headers: { '0x-api-key': 'placeholder', '0x-version': 'v2' }
      })
      const data = await res.json()
      if (data.issues?.balance) { setStatus('Insufficient balance'); setLoading(false); return }
      setQuote(data)
      const buyAmt = isBuy ? (Number(data.buyAmount) / 1e18).toFixed(2) : (Number(data.buyAmount) / 1e18).toFixed(6)
      setStatus(`You get ≈ ${buyAmt} ${isBuy ? tokenSymbol : 'ETH'}`)
    } catch (e) {
      setStatus('Quote failed - try again')
    }
    setLoading(false)
  }

  async function executeTrade() {
    if (!quote) return getQuote()
    setLoading(true)
    setStatus('Confirm in wallet...')
    try {
      await sendTransactionAsync({
        to: quote.transaction.to,
        data: quote.transaction.data,
        value: BigInt(quote.transaction.value || 0),
        gas: BigInt(quote.transaction.gas || 200000),
      })
      setStatus('Swap submitted! ✅')
      setQuote(null)
      setAmount('')
    } catch (e: any) {
      setStatus(e?.message?.includes('User rejected') ? 'Cancelled' : 'Swap failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(41,212,245,0.15)', borderRadius: 14, padding: 16 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4 }}>
        {(['buy','sell'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setQuote(null); setStatus('') }}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 8, cursor: 'pointer',
              background: tab===t ? (t==='buy' ? '#0052ff' : '#e05c5c') : 'transparent',
              color: tab===t ? '#fff' : 'rgba(255,255,255,0.4)',
              fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
            }}>{t === 'buy' ? 'Buy' : 'Sell'}</button>
        ))}
      </div>

      {/* Label */}
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
        {tab === 'buy' ? `ETH → ${tokenSymbol}` : `${tokenSymbol} → ETH`}
      </div>

      {/* Input */}
      <input
        type="number"
        placeholder={tab === 'buy' ? 'Amount in ETH' : `Amount in ${tokenSymbol}`}
        value={amount}
        onChange={e => { setAmount(e.target.value); setQuote(null); setStatus('') }}
        style={{
          width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(41,212,245,0.2)', borderRadius: 8, color: '#fff',
          fontFamily: FONT_MONO, fontSize: 13, boxSizing: 'border-box',
          outline: 'none', marginBottom: 8
        }}
      />

      {/* Presets */}
      {tab === 'buy' && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {PRESETS.map(v => (
            <button key={v} onClick={() => { setAmount(v); setQuote(null); setStatus('') }}
              style={{
                flex: 1, padding: '6px',
                background: amount===v ? 'rgba(41,212,245,0.15)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(41,212,245,0.2)', borderRadius: 6,
                color: 'rgba(41,212,245,0.8)', fontFamily: FONT_MONO, fontSize: 11, cursor: 'pointer'
              }}>{v} ETH</button>
          ))}
        </div>
      )}

      {/* Status */}
      {status && (
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: status.includes('✅') ? '#29d4f5' : 'rgba(255,255,255,0.5)', marginBottom: 10, textAlign: 'center' }}>
          {status}
        </div>
      )}

      {/* Button */}
      {isConnected ? (
        <button onClick={quote ? executeTrade : getQuote} disabled={!amount || loading}
          style={{
            width: '100%', padding: '13px', border: 'none', borderRadius: 10,
            background: !amount ? 'rgba(255,255,255,0.05)' : tab==='buy'
              ? 'linear-gradient(135deg,#29d4f5,#0052ff)'
              : 'linear-gradient(135deg,#e05c5c,#7f77dd)',
            color: amount ? '#fff' : 'rgba(255,255,255,0.3)',
            fontFamily: FONT_SYNE, fontSize: 14, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: amount ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
          }}>
          {loading ? 'Loading...' : quote ? 'Confirm Swap' : tab==='buy' ? `Buy $${tokenSymbol}` : `Sell $${tokenSymbol}`}
        </button>
      ) : (
        <div style={{ textAlign: 'center', padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          Connect wallet to trade
        </div>
      )}

      {/* Links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <a href={`https://dexscreener.com/base/${contractAddress}`} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: FONT_MONO, fontSize: 9, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
          DexScreener ↗
        </a>
      </div>
    </div>
  )
}
