// Wagmi & RainbowKit setup
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

import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'Runda',
  projectId: 'b2d075ebf91b7d5fbe7c433104ab359b', // Replace with your actual WalletConnect Project ID
  chains: [hskMainnet, hskTestnet],
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
