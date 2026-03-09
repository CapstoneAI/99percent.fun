'use client'

export function Footer() {
  return (
    <footer className="border-t border-[#1a2a45] bg-[#050d18] px-6 py-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">

        <div className="inline-flex items-center gap-2 border border-[#29d4f5] border-opacity-30 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#29d4f5] animate-pulse" />
          <span className="text-[#29d4f5] text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
            Experimental Protocol — Use at your own risk
          </span>
        </div>

        <p className="text-[#4a6080] text-xs text-center max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
          99percent.fun is an experimental token launchpad. Nothing here is financial advice.
          Tokens launched on this platform can lose all value. Only interact with funds you can afford to lose.
        </p>

        <div className="flex items-center gap-2 text-[#2a3a50] text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          <span>Built on</span>
          <span className="text-[#0052ff]">Base</span>
          <span>·</span>
          <span>Powered by</span>
          <span className="text-[#29d4f5]">Clanker</span>
          <span>·</span>
          <span>© 2025 99percent.fun</span>
        </div>

      </div>
    </footer>
  )
}
