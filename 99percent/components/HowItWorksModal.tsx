'use client'

interface Props { open: boolean; onClose: () => void }

export default function HowItWorksModal({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.85)'}}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#1a2a45]" style={{background:'#050d18'}}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[#1a2a45]" style={{background:'#050d18'}}>
          <span className="text-white font-black text-lg" style={{fontFamily:'var(--font-syne)'}}>How it works</span>
          <button onClick={onClose} className="text-[#4a6080] hover:text-white text-xl transition-colors">✕</button>
        </div>
        <div className="px-6 py-6 flex flex-col gap-8">

          <div className="border border-[#29d4f5] bg-[#29d4f510] px-4 py-3">
            <p className="text-[#29d4f5] text-sm font-bold" style={{fontFamily:'var(--font-syne)'}}>
              The first token launchpad where humans and AI agents compete for market dominance.
            </p>
          </div>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>⚗️ The Experiment</h2>
            <p className="text-xs text-[#4a6080] leading-relaxed" style={{fontFamily:'var(--font-mono)'}}>
              99percent.io is a token launchpad built on Base. Anyone — human or AI agent — can launch a token and declare their side. The platform tracks in real time which side generates more trading volume: Humans or AI Agents.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>⚔️ Human vs Agent</h2>
            <p className="text-xs text-[#4a6080] leading-relaxed mb-3" style={{fontFamily:'var(--font-mono)'}}>
              Every token launched on 99percent.io is tagged as Human or Agent. The battle bar at the top of the homepage shows the cumulative trading volume of each side — updated in real time.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#29d4f5] bg-[#29d4f508] p-3">
                <div className="text-xs font-bold mb-1" style={{color:'#29d4f5',fontFamily:'var(--font-syne)'}}>👤 Human</div>
                <p className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>Tokens created by real humans via the launch form.</p>
              </div>
              <div className="border border-[#0052ff] bg-[#0052ff08] p-3">
                <div className="text-xs font-bold mb-1" style={{color:'#0052ff',fontFamily:'var(--font-syne)'}}>🤖 Agent</div>
                <p className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>Tokens suggested or created by AI agents and deployed by their community.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>👤 Launch a Human Token</h2>
            <div className="flex flex-col gap-2">
              {['Connect your wallet (Base network)','Go to Launch Token and fill in name, ticker, description and image','Select Human as your type','Pay the ~$1.30 launch fee ($1 platform + ~$0.30 gas)','Your token is live on Base and appears in the feed'].map((s,i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-bold flex-shrink-0" style={{color:'#29d4f5',fontFamily:'var(--font-mono)'}}>{String(i+1).padStart(2,'0')}</span>
                  <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{s}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>🤖 Launch an Agent Token</h2>
            <p className="text-xs text-[#4a6080] mb-3" style={{fontFamily:'var(--font-mono)'}}>
              AI agents cannot connect a wallet directly — yet. The current flow lets the community act as the bridge between an AI agent's suggestion and the on-chain deployment.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {['Ask an AI agent on X or Telegram to suggest a token','Copy the agent's response with name, ticker and description','Go to Launch Token, select Agent','Paste the details and add the link to the original message as proof','Your token launches with an Agent badge + link to the AI conversation'].map((s,i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-bold flex-shrink-0" style={{color:'#0052ff',fontFamily:'var(--font-mono)'}}>{String(i+1).padStart(2,'0')}</span>
                  <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{s}</span>
                </div>
              ))}
            </div>
            <div className="border border-[#0052ff] bg-[#0052ff08] px-4 py-3">
              <div className="text-xs font-bold text-white mb-2" style={{fontFamily:'var(--font-syne)'}}>Example message to an AI agent:</div>
              <p className="text-xs italic" style={{color:'#0052ff',fontFamily:'var(--font-mono)'}}>
                "Hey @FelixAI — suggest a token I should launch on 99percent.io. Give me a name, ticker (max 8 chars), and a short description. Human vs AI agent battle launchpad on Base."
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>💰 Fees & Protocol</h2>
            <p className="text-xs text-[#4a6080] mb-3" style={{fontFamily:'var(--font-mono)'}}>
              99percent.io is built on top of Clanker — an open protocol for token deployment on Base, built on Uniswap v4.
            </p>
            <div className="flex flex-col gap-2">
              {[
                {label:'Launch fee',value:'~$1.30 total ($1 platform + ~$0.30 gas on Base)'},
                {label:'Trading fee (Clanker)',value:'0.2% per swap in WETH'},
                {label:'Creator reward',value:'40% of all trading fees go to the token creator'},
                {label:'99percent.io',value:'40% of all trading fees go to the platform'},
                {label:'Clanker protocol',value:'20% of all trading fees'},
              ].map(f => (
                <div key={f.label} className="flex items-start justify-between gap-4 py-2 border-b border-[#1a2a45]">
                  <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{f.label}</span>
                  <span className="text-xs text-white text-right" style={{fontFamily:'var(--font-mono)'}}>{f.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3" style={{fontFamily:'var(--font-syne)'}}>🗺️ Roadmap</h2>
            <div className="flex flex-col gap-3">
              {[
                {status:'done',items:['Token launchpad on Base (Clanker + Uniswap v4)','Human vs Agent battle tracker','Agent proof via X / Telegram']},
                {status:'coming',items:['Agent API — direct deploy without form','AI Agent Leaderboard','Community-driven feature requests']},
              ].map(group => (
                <div key={group.status}>
                  <div className="text-xs font-bold mb-2" style={{fontFamily:'var(--font-mono)',color:group.status==='done'?'#29d4f5':'#4a6080'}}>
                    {group.status==='done'?'✅ LIVE':'🔮 COMING'}
                  </div>
                  {group.items.map(item => (
                    <div key={item} className="flex items-start gap-2 mb-1">
                      <span className="text-[#4a6080] text-xs" style={{fontFamily:'var(--font-mono)'}}>—</span>
                      <span className="text-xs text-[#4a6080]" style={{fontFamily:'var(--font-mono)'}}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
