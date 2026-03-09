'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function CreatePage() {
  const { isConnected } = useAccount()
  const [form, setForm] = useState({ name: '', ticker: '', description: '' })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!isConnected || !form.name || !form.ticker) return
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050d18] px-6 py-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>Cook a Token</h1>
          <p className="text-[#4a6080] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>Launch your token on Base via Clanker</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Token Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Based Pepe"
              className="bg-[#0d1f35] border border-[#1a2a45] text-white px-4 py-3 text-sm outline-none focus:border-[#29d4f5] transition-colors placeholder:text-[#2a3a50]"
              style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Ticker *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#29d4f5] text-sm" style={{ fontFamily: 'var(--font-mono)' }}>$</span>
              <input type="text" name="ticker" value={form.ticker}
                onChange={(e) => setForm((p) => ({ ...p, ticker: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') }))}
                placeholder="PEPE" maxLength={10}
                className="w-full bg-[#0d1f35] border border-[#1a2a45] text-white pl-8 pr-4 py-3 text-sm outline-none focus:border-[#29d4f5] transition-colors placeholder:text-[#2a3a50] uppercase"
                style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Description <span className="text-[#2a3a50] normal-case tracking-normal">(optional)</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's this token about?" rows={3}
              className="bg-[#0d1f35] border border-[#1a2a45] text-white px-4 py-3 text-sm outline-none focus:border-[#29d4f5] transition-colors placeholder:text-[#2a3a50] resize-none"
              style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-[#4a6080]" style={{ fontFamily: 'var(--font-mono)' }}>Image <span className="text-[#2a3a50] normal-case tracking-normal">(optional)</span></label>
            <label className="cursor-pointer">
              <div className="border border-dashed border-[#1a2a45] hover:border-[#29d4f5] transition-colors p-8 flex flex-col items-center justify-center gap-2 bg-[#0d1f35]">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover" />
                ) : (
                  <>
                    <span className="text-2xl opacity-30">🖼</span>
                    <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Click to upload</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
          <div className="border border-[#1a2a45] bg-[#0d1f35] p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Launch fee</span>
              <span className="text-white text-xs" style={{ fontFamily: 'var(--font-mono)' }}>0.001 ETH + $1 platform fee</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Platform fee</span>
              <span className="text-white text-xs" style={{ fontFamily: 'var(--font-mono)' }}>$1.00</span>
            </div>
            <div className="border-t border-[#1a2a45] pt-2 flex justify-between">
              <span className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Total</span>
              <span className="text-[#29d4f5] text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>~$4.30</span>
            </div>
            <p className="text-[#4a6080] text-xs mt-1 pt-2 border-t border-[#1a2a45]" style={{ fontFamily: 'var(--font-mono)' }}>
              You earn <span className="text-[#29d4f5]">40%</span> of all trading fees forever
            </p>
          </div>
          {isConnected ? (
            <button onClick={handleSubmit} disabled={loading || !form.name || !form.ticker}
              className="w-full bg-[#29d4f5] text-[#050d18] font-bold py-4 text-sm uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-syne)' }}>
              {loading ? 'Launching...' : 'Launch Token →'}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#4a6080] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>Connect your wallet to launch</p>
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
