# Runda

**Programmable envelope financial OS on HSK Chain.**

Every dollar should have a job. Runda lets you set rules — text, images, PDFs, spreadsheets — that automatically split your income across purpose-based pools. An AI agent enforces your spending policies, speaks your language (Nigerian pidgin), and keeps your money on track.

Built for the [EAG Global Buildathon Nigeria](https://eag-global-buildathon.devfolio.co) — August 2026.

---

## What It Does

- **Envelope Pools** — Needs, Savings, Emergency, Learning, Investment, Fun, Giving, Flexible. Each pool has its own balance, rules, and restrictions.
- **AI-Powered Rules** — Describe your budget in plain English (or upload an image/PDF/spreadsheet), and Runda's AI parses it into allocation policies.
- **Spending Policies** — Set restrictions: reason required, proof required, cooldown periods, goal-locked pools.
- **Chat Interface** — Talk to Runda AI in pidgin. Ask about your pools, get allocation advice, or analyze receipts.
- **On-Chain Vaults** — Pools are backed by smart contracts on HSK Chain. Your money, your rules, on-chain.
- **Multi-Input** — Set rules via text chat, camera (budget photos), PDF uploads, or Excel spreadsheets.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                   │
│  Home · Pools · Goals · Activity · Chat · Settings   │
├─────────────────────────────────────────────────────┤
│                    Agent Backend (Express)            │
│  /api/chat · /api/parse/* · /api/pools              │
│  Groq LLM (vision + function calling)                │
├─────────────────────────────────────────────────────┤
│                  Smart Contracts (Solidity)           │
│  PoolVault · PolicyModule · AllocationEngine         │
│                  HSK Chain (177)                      │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Zustand |
| AI Agent | Groq SDK (qwen/qwen3.6-27b), Express.js, pdf-parse, SheetJS |
| Blockchain | Solidity 0.8.24, Hardhat, ethers.js, wagmi, viem |
| Network | HSK Chain Mainnet (chain ID 177) |
| Wallet | MetaMask / injected wallets via wagmi |

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- Groq API key ([free at console.groq.com](https://console.groq.com))
- MetaMask with HSK Chain configured

### 1. Install Dependencies

```bash
# Frontend
pnpm install

# Backend API
cd api && pnpm install && cd ..
```

### 2. Configure Environment

```bash
# Frontend — no env needed for dev (mock data)
# Backend
cp api/.env.example api/.env
# Edit api/.env and add your GROQ_API_KEY

# Smart contracts (for deployment only)
cp .env.example .env
# Add DEPLOYER_PRIVATE_KEY if deploying to HSK Chain
```

### 3. Run Development Servers

```bash
# Frontend (port 5173)
pnpm dev

# Backend API (port 3001) — in a separate terminal
pnpm dev:api
```

Open [http://localhost:5173](http://localhost:5173). The PIN is `8212`.

### 4. Smart Contracts (Optional — for on-chain demo)

```bash
# Compile contracts
pnpm compile

# Start local Hardhat node
pnpm node

# Deploy to local node
pnpm deploy:local
```

## Project Structure

```
runda/
├── contracts/              # Solidity smart contracts
│   ├── PoolVault.sol       # User vaults with pool management
│   ├── PolicyModule.sol    # Allocation policy storage
│   ├── AllocationEngine.sol # Income splitting orchestration
│   └── USDTMock.sol        # Test USDT token
├── scripts/                # Hardhat deployment scripts
│   ├── deploy.cjs          # Deploy all contracts
│   └── allocate.cjs        # Test allocation flow
├── api/                    # Express.js agent backend
│   ├── server.js           # API server entry
│   ├── routes/
│   │   ├── chat.js         # AI chat endpoint
│   │   ├── parse.js        # Image/PDF/spreadsheet parsing
│   │   └── pools.js        # Pool management
│   └── lib/
│       ├── groq.js         # Groq SDK client
│       ├── rules.js        # Rule extraction engine
│       └── personality.js  # Runda AI personality
├── src/                    # React frontend
│   ├── components/
│   │   ├── chat/           # AI chat widget + messages
│   │   ├── web3/           # Wallet connect + on-chain pools
│   │   ├── layout/         # Navigation, headers
│   │   └── ui/             # Shared UI components
│   ├── pages/              # 19 page components
│   ├── hooks/              # useAgent (API calls)
│   ├── lib/                # wagmi config, HSK chain, currency utils
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript interfaces
│   └── data/               # Mock data (pools, transactions, goals)
├── hardhat.config.cjs      # Hardhat configuration
├── vite.config.ts          # Vite configuration
└── package.json
```

## Smart Contracts

### PoolVault
Each user gets a vault with configurable pools. Pools have types (needs, savings, emergency, etc.) and restriction levels (available, reason_required, proof_required, goal_locked, cooldown_required).

### PolicyModule
Stores allocation policies that define how income splits across pools. Policies can be tied to income sources (salary, freelance, business).

### AllocationEngine
Orchestrates income distribution: reads the active policy, enforces restrictions, and splits USDT across pools atomically.

**Deployed on HSK Chain** (chain ID 177) — verified on [Blockscout](https://hashkey.blockscout.com).

## AI Features

### Chat
Talk to Runda AI naturally. The agent understands Nigerian pidgin and responds in kind.

```
User: "I wan allocate my salary — 40% needs, 20% savings, 10% each for emergency and investment, rest na fun"
Runda: "No wahala! I don set am up. Your allocation go be:
  - Needs: $388.89 (40%)
  - Savings: $194.44 (20%)
  - Emergency: $97.22 (10%)
  - Investment: $97.22 (10%)
  - Fun: $194.45 (20%)
  Total: $972.22. You wan apply am?"
```

### Vision
Upload a photo of a handwritten budget or a budgeting app screenshot — Runda extracts the pools and percentages.

### Document Parsing
Upload a PDF budget plan or Excel spreadsheet — Runda parses it into structured allocation policies.

## HSK Chain

Runda deploys on **HSK Chain** (HashKey Chain) — an EVM-compatible L1 optimized for regulated financial applications.

- **Mainnet Chain ID:** 177
- **RPC:** `https://mainnet.hsk.xyz`
- **Explorer:** [hashkey.blockscout.com](https://hashkey.blockscout.com)
- **Native Token:** HSK
- **Stablecoin:** USDT (used for all pool balances)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key for LLM inference |
| `PORT` | No | Backend port (default: 3001) |
| `ALLOWED_ORIGINS` | No | CORS origins (default: http://localhost:5173) |
| `DEPLOYER_PRIVATE_KEY` | For deploy | Private key for HSK Chain deployment |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start frontend dev server |
| `pnpm dev:api` | Start backend API server |
| `pnpm build` | Build frontend for production |
| `pnpm compile` | Compile Solidity contracts |
| `pnpm node` | Start local Hardhat node |
| `pnpm deploy:local` | Deploy contracts to local node |
| `pnpm deploy:testnet` | Deploy contracts to HSK testnet |
| `pnpm lint` | Run oxlint |

## Submission

**EAG Global Buildathon Nigeria — August 27, 2026**

- **Tracks:** Real-World Ethereum Applications + HSK Chain
- **Demo:** 3-minute pitch + 2-minute Q&A
- **Repo:** This repository
- **Docs:** See [docs/](./docs/) for technical documentation

## License

MIT

## Acknowledgments

- Built at EAG Global Buildathon Nigeria
- Powered by [Groq](https://groq.com) for ultra-fast AI inference
- Deployed on [HSK Chain](https://hashkey.org) for regulated DeFi
- Inspired by envelope budgeting (EveryDollar, YNAB) — but on-chain

 # #   U p d a t e s 
 -   I n t e g r a t e d   l i v e   H a s h K e y   M a i n n e t / T e s t n e t   d e p l o y m e n t s . 
 -   S t r i p p e d   o u t   a l l   p r o t o t y p i n g   m o c k   d a t a . 
 -   I m p l e m e n t e d   f u l l y   a u t o m a t e d   A I   C h a t   f i l e   p a r s i n g   a n d   f a l l b a c k   f o r   d e m o n s t r a t i o n s .  
 