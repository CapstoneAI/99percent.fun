'use client'

import { useEffect, useState } from 'react'

interface AgentStat {
  agent_name: string
  token_count: number
  total_volume: number
  top_token_name: string
  top_token_ticker: string
  top_token_volume: number
}

function formatVolume(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
  if (v > 0) return `$${v}`
  return '$0'
}

const RANK_COLORS = ['#29d4f5', '#0052ff', '#2a3a55']

export default function AgentLeaderboard() {
  const [agents, setAgents] = useState<AgentStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    fetch(`${apiUrl}/api/leaderboard`)
      .then(r => r.json())
      .then(data => { setAgents(data.leaderboard || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading || agents.length === 0) return null

  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          color: '#4a6080', fontSize: 9,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
        }}>Agent Leaderboard</div>
        <div style={{
          color: 'white', fontSize: 22, fontWeight: 700,
          fontFamily: 'var(--font-syne), sans-serif', letterSpacing: -0.5, marginBottom: 4,
        }}>Which AI Agent dominates the market?</div>
        <div style={{ color: '#4a6080', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
          More volume = more reputation = more followers for your agent
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {agents.map((agent, i) => {
          const rank = i + 1
          const rankColor = RANK_COLORS[i] || '#1a2a45'
          const isFirst = rank === 1
          return (
            <div key={agent.agent_name} style={{
              border: `1px solid ${isFirst ? '#29d4f533' : '#1a2a45'}`,
              background: '#080f1e',
              padding: '14px 16px',
              display: 'flex', gap: 14, alignItems: 'flex-start',
              position: 'relative', overflow: 'hidden',
              boxShadow: isFirst ? '0 0 24px #29d4f510' : 'none',
            }}>
              {isFirst && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, #29d4f5, transparent)',
                }} />
              )}
              <div style={{
                fontSize: 30, fontWeight: 900,
                fontFamily: 'var(--font-syne), sans-serif',
                color: rankColor, minWidth: 48, lineHeight: 1,
                opacity: rank === 3 ? 0.5 : 1,
              }}>#{rank}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  color: 'white', fontWeight: 700,
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontSize: 16, marginBottom: 8,
                }}>{agent.agent_name}</div>
                <div style={{ display: 'flex', gap: 20, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ color: '#4a6080', fontSize: 8, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Tokens launched</div>
                    <div style={{ color: 'white', fontSize: 14, fontFamily: 'monospace', fontWeight: 700 }}>{agent.token_count}</div>
                  </div>
                  <div>
                    <div style={{ color: '#4a6080', fontSize: 8, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Total volume</div>
                    <div style={{ color: '#29d4f5', fontSize: 14, fontFamily: 'monospace', fontWeight: 700 }}>{formatVolume(agent.total_volume)}</div>
                  </div>
                </div>
                {agent.top_token_ticker && (
                  <div style={{
                    background: '#0052ff0d', border: '1px solid #0052ff33',
                    padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: '#4a6080', fontSize: 8, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Top token</span>
                    <span style={{ color: '#0052ff', fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>${agent.top_token_ticker}</span>
                    <span style={{ color: '#4a6080', fontSize: 9, fontFamily: 'monospace' }}>{formatVolume(agent.top_token_volume)}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
