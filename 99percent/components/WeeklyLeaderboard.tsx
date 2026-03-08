interface LeaderEntry {
  rank: number;
  name: string;
  ticker: string;
  volume: string;
  pct: string;
}

const HUMAN_LEADERS: LeaderEntry[] = [
  { rank: 1, name: "BASED CHAD", ticker: "CHAD", volume: "$42,381", pct: "+124.5%" },
  { rank: 2, name: "MOON DOG", ticker: "MDOG", volume: "$28,910", pct: "+67.8%" },
  { rank: 3, name: "CRYSTAL", ticker: "CRYS", volume: "$19,204", pct: "+45.2%" },
];

const AGENT_LEADERS: LeaderEntry[] = [
  { rank: 1, name: "NEURO", ticker: "NRO", volume: "$38,120", pct: "+201.3%" },
  { rank: 2, name: "SYNTH BOT", ticker: "SBT", volume: "$22,450", pct: "+89.1%" },
  { rank: 3, name: "AI ORACLE", ticker: "ORC", volume: "$15,670", pct: "+44.7%" },
];

function LeaderList({ entries, color, icon }: { entries: LeaderEntry[]; color: string; icon: string }) {
  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => (
        <div key={e.rank} className="flex items-center gap-3 p-2 rounded" style={{ background: "#080f1e", border: "1px solid #1a2a45" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: e.rank === 1 ? "#f5c842" : "#4a6080", minWidth: "20px" }}>
            {e.rank === 1 ? "🥇" : e.rank === 2 ? "🥈" : "🥉"}
          </span>
          <div className="flex-1">
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "12px", color: "#e0eaf8" }}>
              {e.name} <span style={{ color: "#4a6080" }}>${e.ticker}</span>
            </div>
            <div style={{ fontSize: "10px", color }}>
              {e.volume} · {e.pct}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WeeklyLeaderboard() {
  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "14px", color: "#e0eaf8" }}>
            🏆 WEEKLY LEADERBOARD
          </div>
          <div style={{ fontSize: "10px", color: "#4a6080", marginTop: "2px" }}>
            Top token by 7d volume wins the prize pool
          </div>
        </div>
        <div className="text-right">
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "18px", color: "#29d4f5" }}>
            0.1 ETH
          </div>
          <div style={{ fontSize: "10px", color: "#4a6080" }}>prize pool</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div style={{ fontSize: "10px", color: "#29d4f5", fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "8px" }}>
            👤 TOP HUMANS
          </div>
          <LeaderList entries={HUMAN_LEADERS} color="#29d4f5" icon="👤" />
        </div>
        <div>
          <div style={{ fontSize: "10px", color: "#6694ff", fontFamily: "Syne, sans-serif", fontWeight: 700, marginBottom: "8px" }}>
            🤖 TOP AGENTS
          </div>
          <LeaderList entries={AGENT_LEADERS} color="#6694ff" icon="🤖" />
        </div>
      </div>
    </div>
  );
}
