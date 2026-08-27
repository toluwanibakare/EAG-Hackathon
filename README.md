# Runda

**Programmable Envelope Financial OS on HSK Chain**

Every dollar should have a job.

Runda lets you create financial rules using text, images, PDFs, or spreadsheets, automatically splitting your income across purpose-based pools. An AI agent helps enforce your spending policies, speaks your language—including Nigerian Pidgin—and keeps your money on track.

Built for the **[EAG Global Buildathon Nigeria](https://eag-global-buildathon.devfolio.co)** in August 2026.

---

## What It Does

### Envelope Pools

Organize your money into purpose-based pools:

* Needs
* Savings
* Emergency
* Learning
* Investment
* Fun
* Giving
* Flexible

Each pool has its own balance, rules, and spending restrictions.

### AI-Powered Rules

Describe your budget in plain English or provide supporting documents.

Runda can process:

* Text instructions
* Images and screenshots
* PDF documents
* Excel spreadsheets

The AI automatically extracts allocation rules and converts them into structured financial policies.

### Spending Policies

Configure restrictions for each pool, including:

* Reason required
* Proof required
* Cooldown periods
* Goal-locked funds

### AI Chat Interface

Talk directly with Runda AI using natural language or Nigerian Pidgin.

You can:

* Ask about your pools
* Create or update allocation rules
* Get allocation advice
* Analyze receipts
* Review your spending policies

### On-Chain Vaults

Financial pools are backed by smart contracts on HSK Chain.

Your money. Your rules. On-chain.

### Multi-Input Support

Create financial rules through:

* Text chat
* Camera and budget photos
* PDF uploads
* Excel spreadsheets

---

## Architecture

```text
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                   │
│  Home · Pools · Goals · Activity · Chat · Settings │
├─────────────────────────────────────────────────────┤
│               Agent Backend (Express)               │
│  /api/chat · /api/parse/* · /api/pools             │
│  Groq LLM (Vision + Function Calling)              │
├─────────────────────────────────────────────────────┤
│             Smart Contracts (Solidity)              │
│  PoolVault · PolicyModule · AllocationEngine        │
│                 HSK Chain (177)                     │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React 19, TypeScript, Vite 8, Tailwind CSS 4, Zustand  |
| AI Agent   | Groq SDK, Qwen 3.6 27B, Express.js, pdf-parse, SheetJS |
| Blockchain | Solidity 0.8.24, Hardhat, ethers.js, wagmi, viem       |
| Network    | HSK Chain Mainnet (Chain ID 177)                       |
| Wallet     | MetaMask and injected wallets via wagmi                |

---

## Quick Start

### Prerequisites

Before running the project, make sure you have:

* Node.js 18 or later
* pnpm or npm
* A Groq API key
* MetaMask configured for HSK Chain

You can get a Groq API key from [console.groq.com](https://console.groq.com).

### 1. Install Dependencies

#### Frontend

```bash
pnpm install
```

#### Backend API

```bash
cd api
pnpm install
cd ..
```

### 2. Configure Environment Variables

#### Backend

```bash
cp api/.env.example api/.env
```

Then add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
```

#### Smart Contracts

For deployment:

```bash
cp .env.example .env
```

Add your deployment wallet private key:

```env
DEPLOYER_PRIVATE_KEY=your_private_key
```

Do not commit private keys or API keys to your repository.

### 3. Run the Development Servers

#### Start the Frontend

```bash
pnpm dev
```

The frontend runs at:

```text
http://localhost:5173
```

#### Start the Backend

Open another terminal and run:

```bash
pnpm dev:api
```

The backend runs on port `3001`.

For the demo environment, the application PIN is:

```text
8212
```

---

## Smart Contracts

Smart contracts are optional for local development but can be used for the complete on-chain experience.

### Compile Contracts

```bash
pnpm compile
```

### Start a Local Hardhat Node

```bash
pnpm node
```

### Deploy Contracts Locally

```bash
pnpm deploy:local
```

---

## Project Structure

```text
runda/
│
├── contracts/                     # Solidity smart contracts
│   ├── PoolVault.sol              # User vaults and pool management
│   ├── PolicyModule.sol           # Allocation policy storage
│   ├── AllocationEngine.sol       # Income allocation orchestration
│   └── USDTMock.sol               # Test USDT token
│
├── scripts/                       # Hardhat deployment scripts
│   ├── deploy.cjs                 # Deploy all contracts
│   └── allocate.cjs               # Test allocation flow
│
├── api/                           # Express.js AI agent backend
│   ├── server.js                  # API server entry point
│   │
│   ├── routes/
│   │   ├── chat.js                # AI chat endpoint
│   │   ├── parse.js               # Image, PDF, and spreadsheet parsing
│   │   └── pools.js               # Pool management
│   │
│   └── lib/
│       ├── groq.js                # Groq SDK client
│       ├── rules.js               # Rule extraction engine
│       └── personality.js         # Runda AI personality
│
├── src/                           # React frontend
│   ├── components/
│   │   ├── chat/                  # AI chat widget and messages
│   │   ├── web3/                  # Wallet connection and on-chain pools
│   │   ├── layout/                # Navigation and headers
│   │   └── ui/                    # Shared UI components
│   │
│   ├── pages/                     # Application pages
│   ├── hooks/                     # API hooks
│   ├── lib/                       # wagmi config, HSK Chain, and currency utilities
│   ├── store/                     # Zustand state management
│   ├── types/                     # TypeScript interfaces
│   └── data/                      # Application data
│
├── hardhat.config.cjs             # Hardhat configuration
├── vite.config.ts                 # Vite configuration
└── package.json
```

---

## Smart Contract Architecture

### PoolVault

Each user receives a vault containing configurable financial pools.

Supported pool types include:

* Needs
* Savings
* Emergency
* Learning
* Investment
* Fun
* Giving
* Flexible

Pools can also have different restriction levels:

```text
available
reason_required
proof_required
goal_locked
cooldown_required
```

### PolicyModule

The `PolicyModule` stores allocation policies that define how income should be distributed across different pools.

Policies can also be associated with specific income sources, such as:

* Salary
* Freelance income
* Business revenue
* Other income sources

### AllocationEngine

The `AllocationEngine` manages the income distribution process.

It:

1. Reads the user's active allocation policy.
2. Determines how income should be distributed.
3. Enforces applicable restrictions.
4. Splits funds across pools atomically.

---

## AI Features

### AI Chat

Runda AI allows users to manage their finances conversationally.

The AI understands Nigerian Pidgin and can respond naturally.

#### Example

```text
User:
"I wan allocate my salary — 40% needs, 20% savings,
10% each for emergency and investment, rest na fun"

Runda:
"No wahala! I don set am up. Your allocation go be:

- Needs: $388.89 (40%)
- Savings: $194.44 (20%)
- Emergency: $97.22 (10%)
- Investment: $97.22 (10%)
- Fun: $194.45 (20%)

Total: $972.22

You wan apply am?"
```

### Vision

Upload:

* Photos of handwritten budgets
* Screenshots from budgeting apps
* Images containing financial allocation information

Runda's AI extracts the relevant pools, percentages, and financial rules.

### Document Parsing

Upload documents such as:

* PDF budget plans
* Excel spreadsheets

Runda parses the information and converts it into structured allocation policies.

---

## HSK Chain

Runda is built on **HSK Chain (HashKey Chain)**, an EVM-compatible Layer 1 blockchain designed for regulated financial applications.

| Property         | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Mainnet Chain ID | `177`                                                    |
| RPC              | `https://mainnet.hsk.xyz`                                |
| Explorer         | [hashkey.blockscout.com](https://hashkey.blockscout.com) |
| Native Token     | HSK                                                      |
| Stablecoin       | USDT                                                     |

Pool balances use USDT for stable value management.

The smart contracts are deployed on HSK Chain and can be verified using [Blockscout](https://hashkey.blockscout.com).

---

## Environment Variables

| Variable               | Required       | Description                                           |
| ---------------------- | -------------- | ----------------------------------------------------- |
| `GROQ_API_KEY`         | Yes            | Groq API key used for LLM inference                   |
| `PORT`                 | No             | Backend port. Default: `3001`                         |
| `ALLOWED_ORIGINS`      | No             | Allowed CORS origins                                  |
| `DEPLOYER_PRIVATE_KEY` | For deployment | Wallet private key used for smart contract deployment |

Example:

```env
GROQ_API_KEY=your_groq_api_key
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173
DEPLOYER_PRIVATE_KEY=your_private_key
```

---

## Available Scripts

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `pnpm dev`            | Start the frontend development server |
| `pnpm dev:api`        | Start the backend API server          |
| `pnpm build`          | Build the frontend for production     |
| `pnpm compile`        | Compile Solidity contracts            |
| `pnpm node`           | Start a local Hardhat node            |
| `pnpm deploy:local`   | Deploy contracts to the local network |
| `pnpm deploy:testnet` | Deploy contracts to the HSK testnet   |
| `pnpm lint`           | Run Oxlint                            |

---

## Recent Updates

The latest version of Runda includes several major improvements:

* Integrated live HashKey Mainnet and Testnet deployments.
* Removed all prototyping and mock data.
* Implemented fully automated AI chat and file parsing.
* Added intelligent fallback handling for demonstrations.
* Improved the transition from AI-generated financial policies to live on-chain execution.

---

## Buildathon Submission

**EAG Global Buildathon Nigeria — August 27, 2026**

### Tracks

* Real-World Ethereum Applications
* HSK Chain

### Demo Format

* 3-minute project pitch
* 2-minute Q&A

### Repository

This repository contains the complete Runda application, including:

* Frontend application
* AI agent backend
* Smart contracts
* Deployment scripts
* On-chain integrations

Additional technical documentation is available in:

```text
docs/
```

---

## License

This project is licensed under the **MIT License**.

---

## Acknowledgments

* Built at EAG Global Buildathon Nigeria.
* Powered by [Groq](https://groq.com) for AI inference.
* Deployed on [HSK Chain](https://hashkey.org) for regulated DeFi infrastructure.
* Inspired by the envelope budgeting philosophy popularized by EveryDollar and YNAB, reimagined as an AI-powered, programmable, and on-chain financial system.
