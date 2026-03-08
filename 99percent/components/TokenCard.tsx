import Link from "next/link";

export interface Token {
  id: string;
  name: string;
  ticker: string;
  description?: string;
  imageUrl?: string;
  price: number;
  marketCap: number;
  change24h: number;
  volume24h: number;
  type: "human" | "agent";
  createdAt: string;
  creator: string;
}

function fmtMcap(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TokenCard({ token }: { token: Token }) {
  const isUp = token.change24h >= 0;

  return (
    <Link href={`/token/${token.id}`}>
      <div className="token-card card p-3 flex gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center text-xl"
          style={{ background: "#080f1e", border: "1px solid #1a2a45" }}>
          {token.imageUrl ? (
            <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover rounded" />
          ) : (
            <span>🔵</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {/* Type badge */}
            <span style={{
              fontSize: "9px", fontFamily: "Syne, sans-serif", fontWeight: 700,
              color: token.type === "human" ? "#29d4f5" : "#6694ff",
              background: token.type === "human" ? "#29d4f515" : "#0052ff15",
              border: `1px solid ${token.type === "human" ? "#29d4f530" : "#0052ff40"}`,
              padding: "1px 5px", borderRadius: "3px"
            }}>
              {token.type === "human" ? "👤 HUMAN" : "🤖 AGENT"}
            </span>

            {/* Name */}
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", color: "#e0eaf8" }}>
              {token.name}
            </span>
            <span style={{ fontSize: "11px", color: "#4a6080" }}>${token.ticker}</span>
          </div>

          {/* Description */}
          {token.description && (
            <p style={{ fontSize: "10px", color: "#4a6080", lineHeight: 1.4 }} className="truncate">
              {token.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-1.5">
            <span style={{ fontSize: "11px", color: "#8ba0bf" }}>
              mcap <span style={{ color: "#e0eaf8", fontWeight: 600 }}>{fmtMcap(token.marketCap)}</span>
            </span>
            <span style={{ fontSize: "11px", color: isUp ? "#29d4f5" : "#ff4d6d" }}>
              {isUp ? "▲" : "▼"} {Math.abs(token.change24h).toFixed(1)}%
            </span>
            <span style={{ fontSize: "10px", color: "#4a6080", marginLeft: "auto" }}>
              {shortAddr(token.creator)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
