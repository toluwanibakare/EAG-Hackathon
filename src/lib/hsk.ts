export const HSK_MAINNET_CHAIN_ID = 177
export const HSK_TESTNET_CHAIN_ID = 133

export const HSK_MAINNET_RPC = 'https://mainnet.hsk.xyz'
export const HSK_TESTNET_RPC = 'https://testnet.hsk.xyz'

export const HSK_BLOCK_EXPLORER = 'https://hashkey.blockscout.com'

export const USDT_ADDRESS = '0x0000000000000000000000000000000000000000'

export const POOL_VAULT_ABI = [
  {
    type: 'function',
    name: 'deposit',
    inputs: [{ name: 'poolId', type: 'bytes32' }, { name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [{ name: 'poolId', type: 'bytes32' }, { name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPoolBalance',
    inputs: [{ name: 'poolId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export const POLICY_MODULE_ABI = [
  {
    type: 'function',
    name: 'allocate',
    inputs: [{ name: 'amount', type: 'uint256' }, { name: 'policyId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPolicy',
    inputs: [{ name: 'policyId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'poolIds', type: 'bytes32[]' },
          { name: 'percentages', type: 'uint256[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const

export const ALLOCATION_ENGINE_ABI = [
  {
    type: 'function',
    name: 'executeAllocation',
    inputs: [
      { name: 'income', type: 'uint256' },
      { name: 'policyId', type: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkRestriction',
    inputs: [{ name: 'poolId', type: 'bytes32' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: 'allowed', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

export function formatUsdt(amount: bigint, decimals = 6): string {
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const frac = amount % divisor
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, 2)
  return '$' + Number(whole).toLocaleString('en-US') + '.' + fracStr
}

export function parseUsdt(value: string, decimals = 6): bigint {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const [whole = '0', frac = ''] = cleaned.split('.')
  const fracPadded = frac.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded)
}

export function blockExplorerUrl(path: string): string {
  return `${HSK_BLOCK_EXPLORER}${path}`
}
