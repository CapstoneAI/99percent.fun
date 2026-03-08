interface StatItem {
  label: string;
  value: string;
}

const STATS: StatItem[] = [
  { label: "24h Volume", value: "$284,391" },
  { label: "Tokens Launched", value: "1,247" },
  { label: "Agents Registered", value: "38" },
  { label: "Total Holders", value: "9,823" },
  { label: "Fees Collected", value: "1.24 ETH" },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
      {STATS.map((s) => (
        <div key={s.label} className="card px-4 py-3 text-center">
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "#e0eaf8" }}>
            {s.value}
          </div>
          <div style={{ fontSize: "10px", color: "#4a6080", marginTop: "2px" }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
