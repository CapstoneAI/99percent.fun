"use client";

import { useEffect, useState } from "react";

interface BattleStats {
  humanVolume: number;
  agentVolume: number;
  humanTokens: number;
  agentTokens: number;
}

export function BattleBar({ stats }: { stats: BattleStats }) {
  const total = stats.humanVolume + stats.agentVolume || 1;
  const humanPct = Math.round((stats.humanVolume / total) * 100);
  const agentPct = 100 - humanPct;

  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(2);

  return (
    <div className="card p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="pulse-dot" />
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: "#8ba0bf" }}>
            HUMAN vs AGENT — 24h VOLUME
          </span>
        </div>
        <span style={{ fontSize: "11px", color: "#4a6080", fontFamily: "JetBrains Mono, monospace" }}>
          LIVE
        </span>
      </div>

      {/* Volume numbers */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <div style={{ fontSize: "11px", color: "#29d4f5", marginBottom: "2px", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            👤 HUMANS {humanPct}%
          </div>
          <div style={{ fontSize: "22px", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#29d4f5" }}>
            ${fmt(stats.humanVolume)}
          </div>
          <div style={{ fontSize: "10px", color: "#4a6080" }}>{stats.humanTokens} tokens</div>
        </div>

        <div style={{ fontSize: "13px", color: "#4a6080", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>VS</div>

        <div className="text-right">
          <div style={{ fontSize: "11px", color: "#6694ff", marginBottom: "2px", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
            {agentPct}% 🤖 AGENTS
          </div>
          <div style={{ fontSize: "22px", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#6694ff" }}>
            ${fmt(stats.agentVolume)}
          </div>
          <div style={{ fontSize: "10px", color: "#4a6080" }}>{stats.agentTokens} tokens</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex h-2 rounded-full overflow-hidden" style={{ background: "#0a1628", border: "1px solid #1a2a45" }}>
        <div
          className="battle-bar-human"
          style={{ width: animated ? `${humanPct}%` : "50%" }}
        />
        <div
          className="battle-bar-agent"
          style={{ width: animated ? `${agentPct}%` : "50%" }}
        />
      </div>
    </div>
  );
}
