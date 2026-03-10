'use client'

import { useState, useRef } from 'react'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { createToken } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'human' | 'agent'>('human')
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [website, setWebsite] = useState('')
  const [agentName, setAgentName] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { address, isConnected } = useAccount()
  const router = useRouter()

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    if (!isConnected || !address) {
      setError('Connect your wallet first')
      return
    }
    if (!name || !ticker) {
      setError('Name and ticker are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await createToken({
        name,
        ticker,
        creator_wallet: address,
        type,
        description,
        image_url: imageUrl,
        agent_name: type === 'agent' ? agentName : undefined,
        proof_url: type === 'agent' ? proofUrl : undefined,
        twitter_url: twitter,
        telegram_url: telegram,
        website_url: website,
      })
      router.push(`/token/${result.token.id}`)
    } catch (err) {
      setError('Failed to create token. Try again.')
      setLoading(false)
    }
  }

  const humanActive = type === 'human'
  const color = humanActive ? '#29d4f5' : '#0052ff'

  return (
    <main className="min-h-screen bg-[#050d18]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <Link href="/" className="text-[#4a6080] text-xs hover:text-white transition-colors" style={{fontFamily:'var(--font-mono)'}}>
            Back
          </Link>
          <h1 className="text-2xl font-black text-white mt-3" style={{fontFamily:'var(--font-syne)'}}>Launch Token</h1>
          <p className="text-[#4a6080] text-xs mt-1" style={{fontFamily:'var(--font-mono)'}}>Join the battle. Choose your side.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-5">

            {/* Type */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setType('human')} className="py-3 flex flex-col items-center gap-1 border transition-all"
                  style={{borderColor:humanActive?'#29d4f5':'#1a2a45',background:humanActive?'#29d4f510':'transparent',color:humanActive?'#29d4f5':'#4a6080'}}>
                  <span className="text-xl">Human</span>
                  <span className="text-xs font-bold" style={{fontFamily:'var(--font-syne)'}}>Human</span>
                </button>
                <button onClick={() => setType('agent')} className="py-3 flex flex-col items-center gap-1 border transition-all"
                  style={{borderColor:!humanActive?'#0052ff':'#1a2a45',background:!humanActive?'#0052ff10':'transparent',color:!humanActive?'#0052ff':'#4a6080'}}>
                  <span className="text-xl">Agent</span>
                  <span className="text-xs font-bold" style={{fontFamily:'var(--font-syne)'}}>AI Agent</span>
                </button>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>Token Image</label>
              <div onClick={() => fileRef.current?.click()}
                className="border border-dashed border-[#1a2a45] h-28 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#29d4f5] transition-colors"
                style={{background:'#0d1f35'}}>
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <>
                    <span className="text-2xl">img</span>
                    <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>Click to upload</span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>Token Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Based Pepe" maxLength={32}
                className="w-full bg-[#0d1f35] border border-[#1a2a45] px-3 py-2.5 text-white text-sm outline-none focus:border-[#29d4f5] transition-colors"
                style={{fontFamily:'var(--font-mono)'}} />
            </div>

            {/* Ticker */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>Ticker</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6080] text-sm" style={{fontFamily:'var(--font-mono)'}}>$</span>
                <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8))}
                  placeholder="BPEPE"
                  className="w-full bg-[#0d1f35] border border-[#1a2a45] pl-7 pr-3 py-2.5 text-white text-sm outline-none focus:border-[#29d4f5] transition-colors"
                  style={{fontFamily:'var(--font-mono)'}} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell the story of your token..."
                rows={3} maxLength={200}
                className="w-full bg-[#0d1f35] border border-[#1a2a45] px-3 py-2.5 text-white text-sm outline-none focus:border-[#29d4f5] transition-colors resize-none"
                style={{fontFamily:'var(--font-mono)'}} />
              <div className="text-right text-xs text-[#4a6080] mt-1" style={{fontFamily:'var(--font-mono)'}}>{description.length}/200</div>
            </div>

            {/* Socials */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>
                Socials <span className="text-[#2a3a50]">(optional)</span>
              </label>
              <div className="flex flex-col gap-2">
                {[
                  {val:twitter, set:setTwitter, icon:'X', placeholder:'https://x.com/yourtoken'},
                  {val:telegram, set:setTelegram, icon:'TG', placeholder:'https://t.me/yourtoken'},
                  {val:website, set:setWebsite, icon:'W', placeholder:'https://yourtoken.com'},
                ].map(s => (
                  <div key={s.icon} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6080] text-xs font-bold" style={{fontFamily:'var(--font-mono)'}}>{s.icon}</span>
                    <input value={s.val} onChange={e => s.set(e.target.value)} placeholder={s.placeholder}
                      className="w-full bg-[#0d1f35] border border-[#1a2a45] pl-8 pr-3 py-2.5 text-white text-xs outline-none focus:border-[#29d4f5] transition-colors"
                      style={{fontFamily:'var(--font-mono)'}} />
                  </div>
                ))}
              </div>
            </div>

            {type === 'agent' && (
              <div>
                <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{fontFamily:'var(--font-mono)'}}>
                  Suggested by AI Agent <span className="text-[#2a3a50]">(optional)</span>
                </label>
                <div className="flex flex-col gap-2">
                  <input value={agentName} onChange={e => setAgentName(e.target.value)}
                    placeholder="@FelixAI"
                    className="w-full bg-[#0d1f35] border border-[#0052ff] px-3 py-2.5 text-white text-sm outline-none focus:border-[#0052ff] transition-colors"
                    style={{fontFamily:'var(--font-mono)'}} />
                  <input value={proofUrl} onChange={e => setProofUrl(e.target.value)}
                    placeholder="https://x.com/... or https://t.me/..."
                    className="w-full bg-[#0d1f35] border border-[#0052ff] px-3 py-2.5 text-white text-xs outline-none focus:border-[#0052ff] transition-colors"
                    style={{fontFamily:'var(--font-mono)'}} />
                  {proofUrl && !proofUrl.startsWith('https://x.com') && !proofUrl.startsWith('https://t.me') && (
                    <div className="text-xs text-red-400 mt-1" style={{fontFamily:'var(--font-mono)'}}>
                      Only x.com or t.me links accepted
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fee */}
            <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 flex items-center gap-3">
              <span className="text-lg">fee</span>
              <div>
                <div className="text-white text-xs font-bold" style={{fontFamily:'var(--font-syne)'}}>Launch fee: ~$1.30</div>
                <div className="text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>$1 platform + ~$0.30 gas on Base</div>
              </div>
            </div>

            {error && (
              <div className="border border-red-500 bg-red-500/10 px-3 py-2 text-red-400 text-xs" style={{fontFamily:'var(--font-mono)'}}>
                {error}
              </div>
            )}

            {!isConnected && (
              <div className="border border-[#1a2a45] bg-[#0d1f35] px-3 py-2 text-[#4a6080] text-xs text-center" style={{fontFamily:'var(--font-mono)'}}>
                Connect your wallet to launch
              </div>
            )}

            <button onClick={handleSubmit} disabled={!name || !ticker || loading}
              className="w-full py-4 font-black text-sm uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-30"
              style={{background:color,color:'#050d18',fontFamily:'var(--font-syne)'}}>
              {loading ? 'Launching...' : `Launch as ${type === 'human' ? 'Human' : 'Agent'}`}
            </button>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center gap-6">
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-4 block text-center" style={{fontFamily:'var(--font-mono)'}}>Live Preview</label>
              <TokenCard name={name||'Token Name'} ticker={ticker||'TICKER'} type={type} imageUrl={imageUrl} preview={true} />
            </div>
            <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 w-44">
              <div className="text-[#4a6080] text-xs mb-2 text-center" style={{fontFamily:'var(--font-mono)'}}>Volume milestones</div>
              {[
                {label:'$1M+',icon:'fire',text:'ON FIRE'},
                {label:'$100K',icon:'rocket',text:'MOONING'},
                {label:'$10K',icon:'star',text:'HEATING UP'},
                {label:'$0',icon:'drop',text:'Just launched'},
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2 py-0.5">
                  <span className="text-xs">{m.icon}</span>
                  <span className="text-xs text-white" style={{fontFamily:'var(--font-mono)'}}>{m.label}</span>
                  <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
