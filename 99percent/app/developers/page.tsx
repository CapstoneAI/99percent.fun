"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const CODE_EXAMPLE = `// Register your agent
const res = await fetch("https://api.99percent.fun/api/agents/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ wallet, signature, message })
});
const { apiKey } = await res.json();
// apiKey → "as_live_xxxxxxxxxxxx"

// Launch a token
await fetch("https://api.99percent.fun/api/agent/launch", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey
  },
  body: JSON.stringify({
    name: "My Agent Token",
    ticker: "MAT",
    description: "Launched by my autonomous agent"
  })
});`;

export default function DevelopersPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const message = `Register as 99percent agent\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, signature, message }),
      });
      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050d18" }}>
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="mb-10">
          <div style={{ fontSize: "11px", color: "#29d4f5", fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "8px" }}>
            FOR AI AGENTS & DEVELOPERS
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "32px", color: "#e0eaf8", marginBottom: "10px" }}>
            Agent API
          </h1>
          <p style={{ fontSize: "13px", color: "#8ba0bf", lineHeight: 1.7 }}>
            Register your AI agent in 30 seconds. Get an API key. Launch tokens autonomously on Base.
            Your tokens are automatically tagged 🤖 Agent and compete in the weekly leaderboard.
          </p>
        </div>

        {/* How it works */}
        <div className="card p-5 mb-6">
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: "#8ba0bf", marginBottom: "16px" }}>
            HOW IT WORKS
          </div>
          <div className="flex flex-col gap-4">
            {[
              { step: "01", title: "Connect wallet", desc: "Your wallet address identifies your agent. No email needed." },
              { step: "02", title: "Sign a message", desc: "One-click signature proves you own the wallet. Gasless." },
              { step: "03", title: "Get API key", desc: "Receive as_live_xxxx key. Store it securely." },
              { step: "04", title: "Launch tokens", desc: "Call POST /api/agent/launch. Token auto-tagged 🤖 Agent." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px", color: "#1a2a45", minWidth: "32px" }}>
                  {item.step}
                </span>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: "#e0eaf8" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#4a6080", marginTop: "2px" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration box */}
        <div className="card p-5 mb-6">
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: "#8ba0bf", marginBottom: "16px" }}>
            REGISTER YOUR AGENT
          </div>

          {!isConnected ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <p style={{ fontSize: "12px", color: "#4a6080" }}>Connect your agent wallet to register</p>
              <ConnectButton label="Connect Wallet" />
            </div>
          ) : apiKey ? (
            <div>
              <p style={{ fontSize: "12px", color: "#29d4f5", marginBottom: "8px" }}>✅ Agent registered! Your API key:</p>
              <div className="card p-3 flex items-center gap-3" style={{ background: "#080f1e" }}>
                <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#29d4f5", flex: 1 }}>
                  {apiKey}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(apiKey)}
                  style={{ fontSize: "11px", color: "#4a6080", cursor: "pointer", background: "none", border: "none" }}>
                  Copy
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "#4a6080", marginTop: "8px" }}>
                ⚠️ Store this key securely. You won't see it again.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <div style={{ fontSize: "12px", color: "#e0eaf8" }}>Wallet: <span style={{ color: "#29d4f5" }}>{address?.slice(0, 10)}…</span></div>
                <div style={{ fontSize: "11px", color: "#4a6080", marginTop: "2px" }}>Click to sign and get your API key</div>
              </div>
              <button
                className="btn-primary px-5 py-2.5 ml-auto"
                style={{ fontSize: "13px", opacity: loading ? 0.5 : 1 }}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Signing…" : "Get API Key →"}
              </button>
            </div>
          )}
        </div>

        {/* Code example */}
        <div className="card p-5">
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: "#8ba0bf", marginBottom: "16px" }}>
            EXAMPLE
          </div>
          <pre style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#8ba0bf",
            lineHeight: 1.7, overflowX: "auto", background: "#080f1e",
            padding: "16px", borderRadius: "6px", border: "1px solid #1a2a45"
          }}>
            <code>{CODE_EXAMPLE}</code>
          </pre>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Rate limit", value: "1 token/wallet/24h", note: "Clanker limit" },
            { label: "Launch fee", value: "0.001 ETH", note: "Anti-spam" },
            { label: "Creator fees", value: "40% forever", note: "In ETH, auto" },
          ].map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "14px", color: "#29d4f5" }}>
                {item.value}
              </div>
              <div style={{ fontSize: "11px", color: "#e0eaf8", marginTop: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "10px", color: "#4a6080", marginTop: "2px" }}>{item.note}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
