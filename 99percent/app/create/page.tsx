'use client'

import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { createPublicClient, http, parseEther } from 'viem'
import { base } from 'viem/chains'
import { Clanker } from 'clanker-sdk/v4'
import { DopplerSDK } from '@whetstone-research/doppler-sdk'
import { useRouter } from 'next/navigation'
import TokenCard from '@/components/TokenCard'

const PLATFORM_WALLET = '0x0C8B2DdDA2cE646c6da1dD7D5bea5a541B728C24'
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const router = useRouter()

  const [launchMode, setLaunchMode] = useState<'clanker' | 'doppler'>('clanker')
  const [type, setType] = useState<'human' | 'agent'>('human')
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [website, setWebsite] = useState('')
  const [agentName, setAgentName] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const mono = { fontFamily: 'var(--font-mono)' }
  const syne = { fontFamily: 'var(--font-syne)' }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setImagePreview(base64)
      try {
        const res = await fetch(`${API_URL}/api/upload-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        })
        const data = await res.json()
        if (data.url) setImageUrl(data.url)
      } catch (err) {
        console.error('Image upload failed', err)
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    if (!isConnected || !address) { setError('Connect your wallet first'); return }
    if (!walletClient) { setError('Wallet not ready'); return }
    if (!name || !ticker) { setError('Name and ticker are required'); return }

    setLoading(true)
    setError('')

    try {
      const publicClient = createPublicClient({ chain: base, transport: http() })
      let contractAddress = ''
      let poolId = null

      if (launchMode === 'clanker') {
        setStatus('Preparing Clanker deployment...')
        const clanker = new Clanker({ publicClient: publicClient as any, wallet: walletClient as any })
        setStatus('Deploying token on Base... (confirm in wallet)')
        const { txHash, waitForTransaction, error: deployError } = await clanker.deploy({
          name,
          symbol: ticker.toUpperCase(),
          tokenAdmin: address,
          image: imageUrl || undefined,
          metadata: {
            description: description || undefined,
            socialMediaUrls: [
              twitter ? { platform: 'x', url: twitter } : null,
              telegram ? { platform: 'telegram', url: telegram } : null,
              website ? { platform: 'website', url: website } : null,
            ].filter(Boolean) as { platform: string; url: string }[],
          },
          context: { interface: '99percent.one', platform: '99percent', messageId: '', id: address },
          rewards: {
            recipients: [
              { recipient: address, admin: address, bps: 5000, token: 'Paired' },
              { recipient: PLATFORM_WALLET as `0x${string}`, admin: PLATFORM_WALLET as `0x${string}`, bps: 5000, token: 'Paired' },
            ]
          }
        })
        if (deployError) throw deployError
        setStatus(`Transaction sent: ${txHash}. Waiting...`)
        const result = await waitForTransaction()
        contractAddress = result?.address || ''
      } else {
        setStatus('Preparing Doppler bonding curve... (confirm in wallet)')
        const sdk = new DopplerSDK({ publicClient: publicClient as any, walletClient: walletClient as any, chainId: base.id })
        const WETH = '0x4200000000000000000000000000000000000006'
        const params = sdk
          .buildMulticurveAuction()
          .tokenConfig({ name, symbol: ticker.toUpperCase(), tokenURI: imageUrl || 'https://99percent.one/placeholder.png' })
          .saleConfig({ initialSupply: parseEther('1000000000'), numTokensToSell: parseEther('900000000'), numeraire: WETH })
          .withCurves({
            numerairePrice: 2000,
            curves: [
              { marketCap: { start: 500_000, end: 1_500_000 }, numPositions: 10, shares: parseEther('0.4') },
              { marketCap: { start: 1_000_000, end: 5_000_000 }, numPositions: 10, shares: parseEther('0.5') },
              { marketCap: { start: 5_000_000, end: 'max' }, numPositions: 1, shares: parseEther('0.1') },
            ],
            beneficiaries: [
              await sdk.getAirlockBeneficiary(),
              { beneficiary: PLATFORM_WALLET as `0x${string}`, shares: parseEther('0.95') },
            ],
          })
          .withGovernance({ type: 'noOp' })
          .withMigration({ type: 'noOp' })
          .withUserAddress(address)
          .build()
        setStatus('Deploying bonding curve on Base... (confirm in wallet)')
        const result = await sdk.factory.createMulticurve(params)
        contractAddress = result.tokenAddress
        poolId = result.poolId
      }

      if (!contractAddress) throw new Error('No contract address returned')
      setStatus('Token deployed! Saving to database...')

      const dbRes = await fetch(`${API_URL}/api/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, ticker: ticker.toUpperCase(), contract_address: contractAddress,
          creator_wallet: address, type, description: description || null,
          image_url: imageUrl || null, twitter_url: twitter || null,
          telegram_url: telegram || null, website_url: website || null,
          agent_name: type === 'agent' ? agentName : null,
          proof_url: type === 'agent' ? proofUrl : null,
          launch_mode: launchMode, pool_id: poolId,
        })
      })
      const dbData = await dbRes.json()
      if (dbData.token) router.push(`/token/${contractAddress}`)
    } catch (err: any) {
      setError(err.message || 'Launch failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#0d1f35', border: '1px solid #1a2a45', borderRadius: 8, color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, ...mono }

  return (
    <div style={{ minHeight: '100vh', background: '#050d18', padding: '40px 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
        <div>
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Launch a token</label>
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 700, ...syne, margin: '0 0 6px' }}>Cook your token.</h1>
          <p style={{ color: '#4a6080', fontSize: 13, ...mono, margin: '0 0 32px' }}>Join the battle. Choose your side.</p>

          {/* LAUNCH MODE */}
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Launch mode</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {(['clanker', 'doppler'] as const).map(mode => (
              <div key={mode} onClick={() => setLaunchMode(mode)} style={{ cursor: 'pointer', padding: '16px', background: launchMode === mode ? '#0f0a2e' : '#0d1f35', border: `1px solid ${launchMode === mode ? '#7f77dd' : '#1a2a45'}`, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: launchMode === mode ? 'white' : '#4a6080', fontWeight: 700, fontSize: 14, ...syne }}>{mode === 'clanker' ? '⚡ Instant' : '🚀 Bonding Curve'}</span>
                  <span style={{ fontSize: 10, ...mono, color: '#7f77dd', background: '#0f0a2e', padding: '2px 8px', borderRadius: 4 }}>{mode === 'clanker' ? 'Clanker' : 'Doppler'}</span>
                </div>
                <div style={{ color: '#4a6080', fontSize: 11, ...mono, lineHeight: 1.6 }}>
                  {mode === 'clanker' ? (
                    <>• Live on Uniswap instantly<br/>• 100B token supply<br/>• Gas ~$0.10</>
                  ) : (
                    <>• Fixed 1B supply<br/>• Price discovery + anti-bot<br/>• Gas ~$1-2 · Graduates at $5M</>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TYPE */}
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>I am a...</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {(['human', 'agent'] as const).map(t => (
              <div key={t} onClick={() => setType(t)} style={{ cursor: 'pointer', padding: '14px', textAlign: 'center', background: type === t ? (t === 'human' ? '#001a0f' : '#0d0a2e') : '#0d1f35', border: `1px solid ${type === t ? (t === 'human' ? '#29d4f5' : '#0052ff') : '#1a2a45'}`, borderRadius: 10 }}>
                <div style={{ color: type === t ? 'white' : '#4a6080', fontWeight: 700, fontSize: 14, ...syne }}>{t === 'human' ? 'Human' : 'Agent'}</div>
                <div style={{ color: type === t ? (t === 'human' ? '#29d4f5' : '#6b7fff') : '#4a6080', fontSize: 10, ...mono }}>{t === 'human' ? 'Human' : 'AI Agent'}</div>
              </div>
            ))}
          </div>

          {/* IMAGE */}
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Token image</label>
          <label style={{ display: 'block', cursor: 'pointer', marginBottom: 28 }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <div style={{ border: '1px dashed #1a2a45', borderRadius: 10, padding: '32px', textAlign: 'center', color: '#4a6080', fontSize: 13, ...mono, background: '#0d1f35' }}>
              {imagePreview ? <img src={imagePreview} style={{ maxHeight: 120, borderRadius: 8 }} /> : <><div style={{fontSize:24,marginBottom:6}}>📁</div><div>Click to upload</div></>}
            </div>
          </label>

          {/* FIELDS */}
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Token name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My Token" style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Ticker</label>
          <input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="$TICKER" style={{ ...inputStyle, marginBottom: 16 }} />

          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell the story of your token..." style={{ ...inputStyle, height: 90, resize: 'none', marginBottom: 8 }} />
          <div style={{ textAlign: 'right', color: '#4a6080', fontSize: 10, ...mono, marginBottom: 24 }}>{description.length}/300</div>

          {/* SOCIALS */}
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Socials (optional)</label>
          {[
            { label: 'X', val: twitter, set: setTwitter, ph: 'https://x.com/yourtoken' },
            { label: 'TG', val: telegram, set: setTelegram, ph: 'https://t.me/yourtoken' },
            { label: 'W', val: website, set: setWebsite, ph: 'https://yourtoken.com' },
          ].map(({ label, val, set, ph }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ color: '#4a6080', fontSize: 11, ...mono, width: 20 }}>{label}</span>
              <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{ ...inputStyle, flex: 1 }} />
            </div>
          ))}

          {/* AGENT FIELDS */}
          {type === 'agent' && (
            <div style={{ marginTop: 24, padding: 16, border: '1px solid #0052ff33', borderRadius: 10, background: '#0d0a2e' }}>
              <label style={{ color: '#6b7fff', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>Suggested by AI Agent</label>
              <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Agent name</label>
              <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="e.g. @FelixAI" style={{ ...inputStyle, marginBottom: 12 }} />
              <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Proof URL (X or Warpcast)</label>
              <input value={proofUrl} onChange={e => setProofUrl(e.target.value)} placeholder="https://x.com/..." style={{ ...inputStyle }} />
            </div>
          )}

          {/* DOPPLER INFO */}
          {launchMode === 'doppler' && (
            <div style={{ marginTop: 24, padding: 16, border: '1px solid #378add33', borderRadius: 10, background: '#001225' }}>
              <label style={{ color: '#378add', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Bonding curve — fixed parameters</label>
              {[
                ['Total supply', '1,000,000,000'],
                ['For sale', '900,000,000 (90%)'],
                ['Graduation target', '$5,000,000 MC'],
                ['Trading fee', '0.3%'],
                ['Anti-bot', 'Dutch auction'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#4a6080', fontSize: 11, ...mono }}>{k}</span>
                  <span style={{ color: '#378add', fontSize: 11, ...mono, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* GAS INFO */}
          <div style={{ marginTop: 24, padding: '10px 14px', background: '#29d4f510', border: '1px solid #29d4f533', borderRadius: 8, color: '#29d4f5', fontSize: 11, ...mono, marginBottom: 12 }}>
            {launchMode === 'clanker' ? 'Gas fee: ~$0.10 on Base' : 'Gas fee: ~$1-2 on Base · 0.3% trading fee shared automatically'}
          </div>

          {error && <div style={{ color: '#ff4444', fontSize: 12, ...mono, marginBottom: 12 }}>{error}</div>}
          {status && <div style={{ marginBottom: 12, padding: '10px 14px', background: '#29d4f510', border: '1px solid #29d4f533', borderRadius: 8, color: '#29d4f5', fontSize: 11, ...mono }}>{status}</div>}

          {!isConnected ? (
            <div style={{ color: '#4a6080', fontSize: 12, ...mono, textAlign: 'center', padding: 16, border: '1px solid #1a2a45', borderRadius: 8 }}>Connect your wallet to launch</div>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#1a2a45' : (type === 'human' ? '#1a2a45' : '#0052ff'), color: loading ? '#4a6080' : (type === 'human' ? '#29d4f5' : 'white'), border: `none`, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 8, ...syne, fontWeight: 700, fontSize: 15, letterSpacing: 0.5 }}>
              {loading ? status || 'Deploying...' : `Launch ${type === 'human' ? 'Human' : 'Agent'} Token ${launchMode === 'doppler' ? '🚀' : '⚡'}`}
            </button>
          )}
        </div>

        {/* RIGHT — Preview */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12, textAlign: 'center' }}>Live preview</label>
          <TokenCard token={{ id: 0, name: name || 'Token Name', ticker: ticker || 'TICKER', type: type as 'human' | 'agent', image_url: imagePreview || imageUrl || undefined, agent_name: agentName || undefined }} />
          <div style={{ marginTop: 16, border: '1px solid #1a2a45', background: '#0d1f35', padding: '12px 14px', borderRadius: 10 }}>
            {launchMode === 'doppler' ? (
              <>
                <div style={{ color: '#378add', fontSize: 10, ...mono, marginBottom: 10 }}>Bonding curve progress</div>
                {[['$500K', 'Launch price'], ['$1.5M', 'Growing'], ['$5M', 'Graduates to Uniswap']].map(([v, l], i) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#378add' : '#1a2a45', flexShrink: 0 }} />
                    <span style={{ color: '#378add', fontSize: 10, ...mono, fontWeight: 700 }}>{v}</span>
                    <span style={{ color: '#4a6080', fontSize: 9, ...mono }}>{l}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, background: '#1a2a45', borderRadius: 4, height: 4 }}>
                  <div style={{ background: '#378add', height: 4, width: '0%', borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: '#4a6080', fontSize: 9, ...mono }}>$0</span>
                  <span style={{ color: '#378add', fontSize: 9, ...mono }}>$5M</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ color: '#4a6080', fontSize: 10, ...mono, marginBottom: 8 }}>Volume milestones</div>
                {[['🔥', '$1M+', 'ON FIRE'], ['🚀', '$100K', 'MOONING'], ['⭐', '$10K', 'HEATING UP'], ['💧', '$0', 'Just launched']].map(([e, v, l]) => (
                  <div key={v} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span>{e}</span>
                    <span style={{ color: 'white', fontSize: 10, ...mono }}>{v}</span>
                    <span style={{ color: '#4a6080', fontSize: 9, ...mono }}>{l}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
