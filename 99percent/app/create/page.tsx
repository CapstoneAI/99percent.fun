'use client'

import { useState, useRef } from 'react'
import TokenCard from '@/components/TokenCard'
import Link from 'next/link'

export default function CreatePage() {
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'human' | 'agent'>('human')
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const humanActive = type === 'human'

  return (
    <main className="min-h-screen bg-[#050d18]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#4a6080] text-xs hover:text-white transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>
            ← Back
          </Link>
          <h1 className="text-2xl font-black text-white mt-3" style={{ fontFamily: 'var(--font-syne)' }}>
            Launch Token
          </h1>
          <p className="text-[#4a6080] text-xs mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
            Join the battle. Choose your side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT — Form */}
          <div className="flex flex-col gap-5">

            {/* Type selector */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setType('human')}
                  className="py-3 flex flex-col items-center gap-1 border transition-all"
                  style={{
                    borderColor: humanActive ? '#29d4f5' : '#1a2a45',
                    background: humanActive ? '#29d4f510' : 'transparent',
                    color: humanActive ? '#29d4f5' : '#4a6080',
                  }}
                >
                  <span className="text-xl">👤</span>
                  <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Human</span>
                </button>
                <button
                  onClick={() => setType('agent')}
                  className="py-3 flex flex-col items-center gap-1 border transition-all"
                  style={{
                    borderColor: !humanActive ? '#0052ff' : '#1a2a45',
                    background: !humanActive ? '#0052ff10' : 'transparent',
                    color: !humanActive ? '#0052ff' : '#4a6080',
                  }}
                >
                  <span className="text-xl">🤖</span>
                  <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-syne)' }}>AI Agent</span>
                </button>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
                Token Image
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-[#1a2a45] h-28 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#29d4f5] transition-colors"
                style={{ background: '#0d1f35' }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <>
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>
                      Click to upload
                    </span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
                Token Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Based Pepe"
                maxLength={32}
                className="w-full bg-[#0d1f35] border border-[#1a2a45] px-3 py-2.5 text-white text-sm outline-none focus:border-[#29d4f5] transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Ticker */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
                Ticker
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6080] text-sm" style={{ fontFamily: 'var(--font-mono)' }}>$</span>
                <input
                  value={ticker}
                  onChange={e => setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                  placeholder="BPEPE"
                  className="w-full bg-[#0d1f35] border border-[#1a2a45] pl-7 pr-3 py-2.5 text-white text-sm outline-none focus:border-[#29d4f5] transition-colors"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'var(--font-mono)' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tell the story of your token..."
                rows={3}
                maxLength={200}
                className="w-full bg-[#0d1f35] border border-[#1a2a45] px-3 py-2.5 text-white text-sm outline-none focus:border-[#29d4f5] transition-colors resize-none"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <div className="text-right text-xs text-[#4a6080] mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
                {description.length}/200
              </div>
            </div>

            {/* Fee notice */}
            <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 flex items-center gap-3">
              <span className="text-lg">💰</span>
              <div>
                <div className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Launch fee: ~$1.30</div>
                <div className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>$1 platform + ~$0.30 gas on Base</div>
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full py-4 font-black text-sm uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-30"
              style={{
                background: type === 'human' ? '#29d4f5' : '#0052ff',
                color: '#050d18',
                fontFamily: 'var(--font-syne)',
              }}
              disabled={!name || !ticker}
            >
              {type === 'human' ? '👤' : '🤖'} Launch as {type === 'human' ? 'Human' : 'Agent'} →
            </button>
          </div>

          {/* RIGHT — Preview */}
          <div className="flex flex-col items-center gap-6">
            <div>
              <label className="text-xs text-[#4a6080] uppercase tracking-widest mb-4 block text-center" style={{ fontFamily: 'var(--font-mono)' }}>
                Live Preview
              </label>
              <TokenCard
                name={name || 'Token Name'}
                ticker={ticker || 'TICKER'}
                type={type}
                imageUrl={imageUrl}
                preview={true}
              />
            </div>

            <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 w-44 text-center">
              <div className="text-[#4a6080] text-xs mb-1" style={{ fontFamily: 'var(--font-mono)' }}>This is how it appears</div>
              <div className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>in the feed & trending</div>
              <div className="mt-2 text-xs" style={{ fontFamily: 'var(--font-mono)', color: type === 'human' ? '#29d4f5' : '#0052ff' }}>
                Water fills as volume grows 💧
              </div>
            </div>

            {/* Water level legend */}
            <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3 w-44">
              <div className="text-[#4a6080] text-xs mb-2 text-center" style={{ fontFamily: 'var(--font-mono)' }}>Volume milestones</div>
              {[
                { label: '$1M+', icon: '🔥', text: 'ON FIRE' },
                { label: '$100K', icon: '🚀', text: 'MOONING' },
                { label: '$10K', icon: '✨', text: 'HEATING UP' },
                { label: '$0', icon: '💧', text: 'Just launched' },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2 py-0.5">
                  <span className="text-xs">{m.icon}</span>
                  <span className="text-xs text-white" style={{ fontFamily: 'var(--font-mono)' }}>{m.label}</span>
                  <span className="text-xs text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
