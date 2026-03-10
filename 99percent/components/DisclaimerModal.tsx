'use client'

interface Props { open: boolean; onClose: () => void }

export default function DisclaimerModal({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.85)'}}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-red-500/30" style={{background:'#050d18'}}>
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-red-500/30" style={{background:'#050d18'}}>
          <span className="text-red-400 font-black text-lg" style={{fontFamily:'var(--font-syne)'}}>⚠️ Disclaimer</span>
          <button onClick={onClose} className="text-[#4a6080] hover:text-white text-xl transition-colors">✕</button>
        </div>
        <div className="px-6 py-6 flex flex-col gap-6">

          <div className="border border-red-500/40 bg-red-500/5 px-4 py-3">
            <p className="text-red-400 text-xs font-bold" style={{fontFamily:'var(--font-syne)'}}>
              99percent.io is an experimental project in beta. Use at your own risk.
            </p>
          </div>

          {[
            {title:'🧪 Experimental Software',body:'99percent.io is an experimental platform currently in public beta. The smart contracts, interfaces, and infrastructure may contain bugs, vulnerabilities, or unexpected behaviors. No formal security audit has been performed on the 99percent.io frontend or backend. Clanker v4 contracts have been audited by Macro & Cantina, but we make no guarantees about the overall system.'},
            {title:'💸 Financial Risk',body:'Tokens launched on 99percent.io are speculative digital assets with no guaranteed value. You may lose all funds used to launch or trade tokens. Past performance of any token is not indicative of future results. Do not invest money you cannot afford to lose entirely.'},
            {title:'🚫 Not Financial Advice',body:'99percent.io does not provide financial, investment, legal, or tax advice. Nothing on this platform should be construed as a recommendation to buy, sell, or hold any token or digital asset. Always do your own research (DYOR) and consult a qualified professional before making financial decisions.'},
            {title:'🤖 AI Agent Content',body:'Tokens tagged as "Agent" on 99percent.io are self-declared by users. We do not verify whether a token was actually suggested by an AI agent. The proof links (X/Telegram) are provided voluntarily and are not independently verified by 99percent.io. We are not responsible for the accuracy of agent-generated content.'},
            {title:'⚖️ Legal & Regulatory',body:'The legal status of token launches, trading, and related activities varies by jurisdiction. It is your sole responsibility to ensure compliance with the laws and regulations of your country of residence. 99percent.io does not target users in jurisdictions where such activities are prohibited. By using this platform, you confirm that you are not a resident of a restricted jurisdiction.'},
            {title:'🔒 No Custody',body:'99percent.io is a non-custodial platform. We do not hold, control, or have access to your wallet, private keys, or funds at any time. All transactions are executed directly on the Base blockchain via your own wallet. You are solely responsible for the security of your wallet and private keys.'},
            {title:'📜 Protocol Dependencies',body:'99percent.io is built on top of Clanker and Uniswap v4. We are not affiliated with, endorsed by, or responsible for these protocols. Any issues, bugs, or changes in these underlying protocols may affect the functionality of 99percent.io without notice.'},
            {title:'🛠️ Development & Continuity Risk',body:'99percent.io is developed and maintained by a single human developer. We cannot guarantee the continued development, maintenance, or availability of the platform. The project may be paused, modified, or discontinued at any time due to technical, financial, or personal circumstances beyond our control. There is no obligation to deliver any feature listed in the roadmap or to continue operating the protocol.'},
            {title:'🔄 Changes & Availability',body:'We reserve the right to modify, suspend, or discontinue 99percent.io at any time without notice. Features, fees, and functionality may change. By using this platform, you accept these terms in their entirety.'},
          ].map(section => (
            <section key={section.title}>
              <h2 className="text-xs font-black uppercase tracking-widest text-white mb-2" style={{fontFamily:'var(--font-syne)'}}>{section.title}</h2>
              <p className="text-xs text-[#4a6080] leading-relaxed" style={{fontFamily:'var(--font-mono)'}}>{section.body}</p>
            </section>
          ))}

          <div className="border border-[#1a2a45] bg-[#0d1f35] px-4 py-3">
            <p className="text-xs text-[#4a6080] text-center" style={{fontFamily:'var(--font-mono)'}}>
              By using 99percent.io you acknowledge that you have read, understood, and agree to this disclaimer in full.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
