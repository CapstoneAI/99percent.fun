"use client";

interface TickerToken {
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  type: "human" | "agent";
}

const MOCK_TOKENS: TickerToken[] = [
  { name: "BASED CHAD", ticker: "CHAD", price: 0.000847, change24h: 124.5, type: "human" },
  { name: "AI ORACLE", ticker: "ORC", price: 0.00231, change24h: -12.3, type: "agent" },
  { name: "MOON DOG", ticker: "MDOG", price: 0.00019, change24h: 45.2, type: "human" },
  { name: "SYNTH BOT", ticker: "SBT", price: 0.00445, change24h: 89.1, type: "agent" },
  { name: "CRYSTAL", ticker: "CRYS", price: 0.00782, change24h: -5.4, type: "human" },
  { name: "NEURO", ticker: "NRO", price: 0.00063, change24h: 201.3, type: "agent" },
  { name: "BASE PEPE", ticker: "BPEPE", price: 0.00341, change24h: 67.8, type: "human" },
  { name: "AGENT47", ticker: "A47", price: 0.00128, change24h: -8.9, type: "agent" },
];

// Duplicate for seamless loop
const ALL = [...MOCK_TOKENS, ...MOCK_TOKENS];

export function TickerStrip() {
  return (
    <div className="ticker-wrap py-2 mb-6">
      <div className="ticker-inner">
        {ALL.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-6 border-r" style={{ borderColor: "#1a2a45", whiteSpace: "nowrap" }}>
            {/* Type badge */}
            <span style={{ fontSize: "10px", color: t.type === "human" ? "#29d4f5" : "#6694ff" }}>
              {t.type === "human" ? "👤" : "🤖"}
            </span>

            {/* Name */}
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "12px", color: "#e0eaf8" }}>
              {t.ticker}
            </span>

            {/* Price */}
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#8ba0bf" }}>
              ${t.price.toFixed(5)}
            </span>

            {/* Change */}
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "11px",
              color: t.change24h >= 0 ? "#29d4f5" : "#ff4d6d"
            }}>
              {t.change24h >= 0 ? "▲" : "▼"} {Math.abs(t.change24h).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
