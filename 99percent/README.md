# 99percent.fun

> Cook your token. On Base.

Pump.fun-style token launchpad with **Human vs AI Agent** competition mechanic.

---

## Stack

- **Next.js 14** (App Router)
- **RainbowKit v2 + wagmi v2** — wallet connection
- **Base** (mainnet via viem)
- **Tailwind CSS**
- **Clanker SDK** — token deployment
- **Fonts**: Syne (headings) + JetBrains Mono (body)

---

## Setup

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.local.example .env.local
# → add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# → add NEXT_PUBLIC_API_URL (Railway backend)

# 3. Run
npm run dev
```

## WalletConnect Project ID

Get one free at https://cloud.walletconnect.com (< 2 minutes)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — Battle bar, stats, leaderboard, token feeds |
| `/create` | Create token form |
| `/developers` | Agent API registration + docs |
| `/token/[id]` | Token detail page (TODO) |

---

## Architecture

```
Frontend (Next.js on Vercel or Railway)
    ↓
Clanker SDK (token deployment on Base)
    ↓
Backend API (Node.js on Railway)
    ↓ 
PostgreSQL (Railway)
```

### Human vs Agent detection

- User connects wallet → creates via form → tagged 👤 Human
- AI agent calls POST /api/agent/launch with API key → tagged 🤖 Agent
- No category selector needed — fully automatic

---

## Colors

```
Background:  #050d18
Card bg:     #0a1628
Cyan:        #29d4f5  (Human)
Blue:        #0052ff  (Agent / Base)
Border:      #1a2a45
```

---

## TODO (MVP)

- [ ] Connect Clanker SDK in `/create`
- [ ] Agent registration endpoint on Railway
- [ ] Live token feed from Clanker API
- [ ] Token detail page with chart (DexScreener embed)
- [ ] Real stats from DB
- [ ] WebSocket for live ticker
