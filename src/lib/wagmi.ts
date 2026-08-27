// Wagmi & RainbowKit setup
import {
  HSK_MAINNET_CHAIN_ID,
  HSK_TESTNET_RPC,
  HSK_MAINNET_RPC,
  HSK_BLOCK_EXPLORER,
} from './hsk'

import { defineChain } from 'viem'

export const hskMainnet = defineChain({
  id: HSK_MAINNET_CHAIN_ID,
  name: 'HashKey Chain',
  nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: [HSK_MAINNET_RPC] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: HSK_BLOCK_EXPLORER },
  },
})

export const hskTestnet = defineChain({
  id: 133,
  name: 'HashKey Testnet',
  nativeCurrency: { name: 'HSK', symbol: 'HSK', decimals: 18 },
  rpcUrls: {
    default: { http: [HSK_TESTNET_RPC] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://testnet-explorer.hsk.xyz' },
  },
})

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Runda',
  projectId: 'deb868e4a51e3827e01fd18c9b2bc896', // User's project ID
  chains: [hskMainnet, hskTestnet, mainnet],
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
