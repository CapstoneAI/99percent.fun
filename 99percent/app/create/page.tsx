'use client'

import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { Clanker } from 'clanker-sdk/v4'
import { useRouter } from 'next/navigation'
import TokenCard from '@/components/TokenCard'

const PLATFORM_WALLET = '0x0C8B2DdDA2cE646c6da1dD7D5bea5a541B728C24'
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const router = useRouter()

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
      // 1. Setup viem clients
      setStatus('Preparing deployment...')
      const publicClient = createPublicClient({ chain: base, transport: http() })

      // 2. Init Clanker SDK
      const clanker = new Clanker({
        publicClient: publicClient as any,
        wallet: walletClient as any,
      })

      // 3. Deploy token on-chain
      setStatus('Deploying token on Base... (confirm in wallet)')
      const { txHash, waitForTransaction, error: deployError } = await clanker.deploy({
        name,
        symbol: ticker.toUpperCase(),
        tokenAdmin: address,
        image: imageUrl || undefined,
        metadata: {
          description: description || undefined,
          socialMediaUrls: [twitter, telegram, website].filter(Boolean),
        },
        context: {
          interface: '99percent.one',
          platform: '99percent',
          messageId: '',
          id: address,
        },
        rewards: {
          recipients: [
            {
              recipient: address,
              admin: address,
              bps: 4000,
              token: 'Paired',
            },
            {
              recipient: PLATFORM_WALLET as `0x${string}`,
              admin: PLATFORM_WALLET as `0x${string}`,
              bps: 4000,
              token: 'Paired',
            },
          ]
        }
      })

      if (deployError) throw deployError

      setStatus(`Transaction sent: ${txHash}. Waiting for confirmation...`)

      // 4. Wait for tx
      const result = await waitForTransaction()
      const contractAddress = result?.address

      if (!contractAddress) throw new Error('No contract address returned')

      setStatus('Token deployed! Saving to database...')

      // 5. Save to DB
      const dbRes = await fetch(`${API_URL}/api/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          ticker: ticker.toUpperCase(),
          contract_address: contractAddress,
          creator_wallet: address,
          type,
          description,
          image_url: imageUrl || null,
          twitter_url: twitter || null,
          telegram_url: telegram || null,
          website_url: website || null,
          agent_name: type === 'agent' ? agentName : null,
          proof_url: type === 'agent' ? proofUrl : null,
        })
      })

      const dbData = await dbRes.json()
      if (!dbData.token) throw new Error('Failed to save token')

      setStatus('Done!')
      router.push(`/token/${contractAddress}`)

    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Something went wrong')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  const mono = { fontFamily: 'var(--font-jetbrains-mono), monospace' }
  const syne = { fontFamily: 'var(--font-syne), sans-serif' }

  return (
    <div style={{ background: '#050d18', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40 }}>

        {/* LEFT — Form */}
        <div>
          <div style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Launch a token</div>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 700, ...syne, marginBottom: 4, letterSpacing: -0.5 }}>Cook your token.</h1>
          <p style={{ color: '#4a6080', fontSize: 12, ...mono, marginBottom: 32 }}>Join the battle. Choose your side.</p>

          {/* Type selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>I AM A...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['human', 'agent'] as const).map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  padding: '14px',
                  border: `1px solid ${type === t ? (t === 'human' ? '#29d4f5' : '#0052ff') : '#1a2a45'}`,
                  background: type === t ? (t === 'human' ? '#29d4f510' : '#0052ff10') : 'transparent',
                  color: type === t ? (t === 'human' ? '#29d4f5' : '#0052ff') : '#4a6080',
                  cursor: 'pointer', ...syne, fontWeight: 700, fontSize: 14,
                }}>
                  {t === 'human' ? 'Human' : 'Agent'}
                  <div style={{ fontSize: 10, ...mono, opacity: 0.7, marginTop: 2 }}>{t === 'human' ? 'Human' : 'AI Agent'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>TOKEN IMAGE</label>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed #1a2a45', height: 120, cursor: 'pointer', background: '#0d1f35',
              overflow: 'hidden',
            }}>
              {imagePreview
                ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <><span style={{ fontSize: 24, marginBottom: 8 }}>img</span><span style={{ color: '#4a6080', fontSize: 11, ...mono }}>Click to upload</span></>
              }
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>TOKEN NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Based Pepe"
              style={{ width: '100%', background: '#0d1f35', border: '1px solid #1a2a45', color: 'white', padding: '10px 12px', ...mono, fontSize: 13, boxSizing: 'border-box' }} />
          </div>

          {/* Ticker */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>TICKER</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6080', ...mono }}>$</span>
              <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="BPEPE"
                style={{ width: '100%', background: '#0d1f35', border: '1px solid #1a2a45', color: 'white', padding: '10px 12px 10px 24px', ...mono, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
            <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 200))} placeholder="Tell the story of your token..." rows={3}
              style={{ width: '100%', background: '#0d1f35', border: '1px solid #1a2a45', color: 'white', padding: '10px 12px', ...mono, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
            <div style={{ color: '#4a6080', fontSize: 9, ...mono, textAlign: 'right' }}>{description.length}/200</div>
          </div>

          {/* Socials */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>SOCIALS (OPTIONAL)</label>
            {[['X', twitter, setTwitter, 'https://x.com/yourtoken'],
              ['TG', telegram, setTelegram, 'https://t.me/yourtoken'],
              ['W', website, setWebsite, 'https://yourtoken.com']].map(([label, val, setter, ph]: any) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: '#4a6080', fontSize: 10, ...mono, width: 20 }}>{label}</span>
                <input value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                  style={{ flex: 1, background: '#0d1f35', border: '1px solid #1a2a45', color: 'white', padding: '8px 10px', ...mono, fontSize: 11 }} />
              </div>
            ))}
          </div>

          {/* Agent fields */}
          {type === 'agent' && (
            <div style={{ marginBottom: 16, padding: 16, border: '1px solid #0052ff33', background: '#0052ff08' }}>
              <div style={{ color: '#0052ff', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>SUGGESTED BY AI AGENT</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>AGENT NAME</label>
                <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="e.g. @FelixAI"
                  style={{ width: '100%', background: '#0d1f35', border: '1px solid #1a2a45', color: 'white', padding: '8px 10px', ...mono, fontSize: 12, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>PROOF URL (X or Warpcast)</label>
                <input value={proofUrl} onChange={e => setProofUrl(e.target.value)} placeholder="https://x.com/..."
                  style={{ width: '100%', background: '#0d1f35', border: '1px solid #1a2a45', color: 'white', padding: '8px 10px', ...mono, fontSize: 12, boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* Fee info */}
          <div style={{ marginBottom: 24, padding: '10px 14px', background: '#0d1f35', border: '1px solid #1a2a45', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4a6080', fontSize: 10, ...mono }}>fee</span>
            <span style={{ color: 'white', fontSize: 11, ...mono, fontWeight: 700 }}>Launch fee: ~$1.30</span>
            <span style={{ color: '#4a6080', fontSize: 10, ...mono }}>$1 platform + ~$0.30 gas on Base</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#ff000010', border: '1px solid #ff000033', color: '#ff6b6b', fontSize: 11, ...mono }}>
              {error}
            </div>
          )}

          {/* Status */}
          {status && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#29d4f510', border: '1px solid #29d4f533', color: '#29d4f5', fontSize: 11, ...mono }}>
              {status}
            </div>
          )}

          {/* Submit */}
          {!isConnected ? (
            <div style={{ color: '#4a6080', fontSize: 12, ...mono, textAlign: 'center', padding: 16, border: '1px solid #1a2a45' }}>
              Connect your wallet to launch
            </div>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#1a2a45' : (type === 'human' ? '#29d4f5' : '#0052ff'),
              color: loading ? '#4a6080' : (type === 'human' ? '#050d18' : 'white'),
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              ...syne, fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
            }}>
              {loading ? status || 'Deploying...' : `Launch ${type === 'human' ? 'Human' : 'Agent'} Token →`}
            </button>
          )}
        </div>

        {/* RIGHT — Preview */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          <label style={{ color: '#4a6080', fontSize: 9, ...mono, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12, textAlign: 'center' }}>LIVE PREVIEW</label>
          <TokenCard token={{ id: 0, name: name || 'Token Name', ticker: ticker || 'TICKER', type: type as 'human' | 'agent', image_url: imageUrl || undefined, agent_name: agentName || undefined }} />

          <div style={{ marginTop: 16, border: '1px solid #1a2a45', background: '#0d1f35', padding: '12px 14px' }}>
            <div style={{ color: '#4a6080', fontSize: 10, ...mono, marginBottom: 8 }}>Volume milestones</div>
            {[['🔥', '$1M+', 'ON FIRE'], ['🚀', '$100K', 'MOONING'], ['⭐', '$10K', 'HEATING UP'], ['💧', '$0', 'Just launched']].map(([e, v, l]) => (
              <div key={v} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span>{e}</span>
                <span style={{ color: 'white', fontSize: 10, ...mono }}>{v}</span>
                <span style={{ color: '#4a6080', fontSize: 9, ...mono }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
