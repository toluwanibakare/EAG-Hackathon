import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import {
  HSK_MAINNET_CHAIN_ID,
  HSK_TESTNET_RPC,
  HSK_MAINNET_RPC,
  HSK_BLOCK_EXPLORER,
} from './hsk'

export const hskMainnet = {
  id: HSK_MAINNET_CHAIN_ID,
  name: 'HSK Chain',
  nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: [HSK_MAINNET_RPC] },
    public: { http: [HSK_MAINNET_RPC] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: HSK_BLOCK_EXPLORER },
  },
} as const

export const hskTestnet = {
  id: 133,
  name: 'HSK Testnet',
  nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: [HSK_TESTNET_RPC] },
    public: { http: [HSK_TESTNET_RPC] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://testnet-explorer.hsk.xyz' },
  },
} as const

export const config = createConfig({
  chains: [hskMainnet, hskTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [HSK_MAINNET_CHAIN_ID]: http(HSK_MAINNET_RPC),
    [133]: http(HSK_TESTNET_RPC),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
