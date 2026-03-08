import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BattleBar } from "@/components/BattleBar";
import { StatsRow } from "@/components/StatsRow";
import { TickerStrip } from "@/components/TickerStrip";
import { WeeklyLeaderboard } from "@/components/WeeklyLeaderboard";
import { TokenCard, Token } from "@/components/TokenCard";

// --- MOCK DATA (replace with API calls) ---
const MOCK_BATTLE = {
  humanVolume: 162891,
  agentVolume: 121500,
  humanTokens: 847,
  agentTokens: 400,
};

const MOCK_TOKENS: Token[] = [
  {
    id: "1", name: "BASED CHAD", ticker: "CHAD",
    description: "The most based token on Base. Pure culture.",
    price: 0.000847, marketCap: 84700, change24h: 124.5, volume24h: 42381,
    type: "human", createdAt: "2h ago", creator: "0x1234567890abcdef1234",
  },
  {
    id: "2", name: "MOON DOG", ticker: "MDOG",
    description: "To the moon with the boys.",
    price: 0.00019, marketCap: 19000, change24h: 45.2, volume24h: 28910,
    type: "human", createdAt: "5h ago", creator: "0xabcdef1234567890abcd",
  },
  {
    id: "3", name: "CRYSTAL", ticker: "CRYS",
    description: "99% pure. Always.",
    price: 0.00782, marketCap: 78200, change24h: -5.4, volume24h: 19204,
    type: "human", createdAt: "8h ago", creator: "0xdeadbeef12345678dead",
  },
  {
    id: "4", name: "BASE PEPE", ticker: "BPEPE",
    description: "Pepe found Base and never left.",
    price: 0.00341, marketCap: 34100, change24h: 67.8, volume24h: 12400,
    type: "human", createdAt: "12h ago", creator: "0xcafe1234abcd5678cafe",
  },
];

const MOCK_AGENT_TOKENS: Token[] = [
  {
    id: "5", name: "NEURO", ticker: "NRO",
    description: "Launched by NeuroBrain-3. Fully autonomous.",
    price: 0.00063, marketCap: 63000, change24h: 201.3, volume24h: 38120,
    type: "agent", createdAt: "1h ago", creator: "0x9999999999999999999a",
  },
  {
    id: "6", name: "SYNTH BOT", ticker: "SBT",
    description: "Synthetic intelligence, real gains.",
    price: 0.00445, marketCap: 44500, change24h: 89.1, volume24h: 22450,
    type: "agent", createdAt: "3h ago", creator: "0x8888888888888888888b",
  },
  {
    id: "7", name: "AI ORACLE", ticker: "ORC",
    description: "The oracle has spoken. Buy.",
    price: 0.00231, marketCap: 23100, change24h: -12.3, volume24h: 15670,
    type: "agent", createdAt: "6h ago", creator: "0x7777777777777777777c",
  },
  {
    id: "8", name: "AGENT47", ticker: "A47",
    description: "Precision. Efficiency. Profit.",
    price: 0.00128, marketCap: 12800, change24h: -8.9, volume24h: 8900,
    type: "agent", createdAt: "9h ago", creator: "0x6666666666666666666d",
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050d18" }}>
      <Navbar />

      {/* Ticker strip */}
      <div className="pt-14">
        <TickerStrip />
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* Battle bar */}
        <BattleBar stats={MOCK_BATTLE} />

        {/* Stats row */}
        <StatsRow />

        {/* Leaderboard */}
        <WeeklyLeaderboard />

        {/* Feed section */}
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "#e0eaf8" }}>
            Latest Tokens
          </h2>
          <Link href="/create"
            className="btn-primary px-4 py-2 text-sm"
            style={{ fontSize: "12px" }}>
            🚀 Cook a Token
          </Link>
        </div>

        {/* Two-column feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Human feed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: "10px", color: "#29d4f5", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
                👤 HUMAN TOKENS
              </span>
              <div style={{ flex: 1, height: "1px", background: "#1a2a45" }} />
            </div>
            <div className="flex flex-col gap-2">
              {MOCK_TOKENS.map((t) => (
                <TokenCard key={t.id} token={t} />
              ))}
            </div>
          </div>

          {/* Agent feed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: "10px", color: "#6694ff", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
                🤖 AGENT TOKENS
              </span>
              <div style={{ flex: 1, height: "1px", background: "#1a2a45" }} />
            </div>
            <div className="flex flex-col gap-2">
              {MOCK_AGENT_TOKENS.map((t) => (
                <TokenCard key={t.id} token={t} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
