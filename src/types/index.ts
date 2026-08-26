export type PoolType =
  | 'needs'
  | 'savings'
  | 'emergency'
  | 'learning'
  | 'investment'
  | 'fun'
  | 'giving'
  | 'flexible'
  | 'custom'

export type PoolRestriction =
  | 'available'
  | 'restricted'
  | 'goal_locked'
  | 'reason_required'
  | 'proof_required'
  | 'cooldown_required'

export type TransactionType =
  | 'income'
  | 'expense'
  | 'allocation'
  | 'transfer'
  | 'withdrawal'

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type IncomeSource = 'salary' | 'freelance' | 'business' | 'investment' | 'gift' | 'other'

export type GoalState = 'active' | 'completed' | 'paused' | 'cancelled'

export interface Pool {
  id: string
  name: string
  type: PoolType
  balance: number
  allocationPercentage: number
  icon: string
  color: string
  restriction: PoolRestriction
  restrictionMessage?: string
  goalId?: string
  requiresReason: boolean
  requiresProof: boolean
  cooldownDays?: number
  parentId?: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  category?: string
  poolId?: string
  poolName?: string
  date: string
  time: string
  status: TransactionStatus
  reference: string
  reason?: string
  merchant?: string
  note?: string
  relatedIncomeId?: string
  relatedAllocationId?: string
  source?: IncomeSource
}

export interface Income {
  id: string
  amount: number
  source: IncomeSource
  date: string
  description: string
  reference: string
  policyId: string
  allocations: AllocationResult[]
  status: TransactionStatus
}

export interface AllocationResult {
  poolId: string
  poolName: string
  percentage: number
  amount: number
}

export interface AllocationPolicy {
  id: string
  name: string
  allocations: PolicyAllocation[]
  isDefault: boolean
  incomeSource?: IncomeSource
}

export interface PolicyAllocation {
  poolId: string
  poolName: string
  percentage: number
  poolType: PoolType
  icon: string
  color: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  contributionRate: number
  state: GoalState
  poolId: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  body: string
  date: string
  read: boolean
  type: 'income' | 'goal' | 'restriction' | 'withdrawal' | 'system'
}

export interface UserProfile {
  name: string
  greeting: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  allocations?: PoolAllocationResult[]
  attachment?: ChatAttachment
}

export interface ChatAttachment {
  type: 'image' | 'pdf' | 'spreadsheet'
  name: string
  data: string
}

export interface PoolAllocationResult {
  pools: {
    name: string
    percentage: number
    type: PoolType
    restriction: PoolRestriction
    icon: string
    color: string
    amount?: number
  }[]
}

export interface WalletInfo {
  address: string
  balance: string
  chainId: number
}
