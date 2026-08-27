import { create } from 'zustand'
import type { Pool, Transaction, AllocationPolicy, SavingsGoal, Notification, Income, ChatMessage } from '../types'
import { defaultPools, defaultPolicy, mockTransactions, mockGoals, mockNotifications, mockIncome } from '../data/mockData'

interface AppState {
  darkMode: boolean
  toggleDarkMode: () => void

  isLocked: boolean
  pin: string
  setPin: (pin: string) => void
  unlock: (pin: string) => boolean
  lock: () => void
  logout: () => void

  hasOnboarded: boolean
  setOnboarded: (val: boolean) => void

  userName: string
  setUserName: (name: string) => void

  walletAddress: string
  setWalletAddress: (address: string) => void

  profilePicture: string | null
  setProfilePicture: (pic: string | null) => void

  balanceHidden: boolean
  toggleBalance: () => void

  pools: Pool[]
  setPools: (pools: Pool[]) => void
  updatePool: (id: string, updates: Partial<Pool>) => void
  addPool: (pool: Pool) => void
  removePool: (id: string) => void

  transactions: Transaction[]
  addTransaction: (txn: Transaction) => void

  policies: AllocationPolicy[]
  addPolicy: (policy: AllocationPolicy) => void
  updatePolicy: (id: string, updates: Partial<AllocationPolicy>) => void
  removePolicyAllocation: (policyId: string, poolId: string) => void
  addPolicyAllocation: (policyId: string, allocation: AllocationPolicy['allocations'][0]) => void

  goals: SavingsGoal[]
  addGoal: (goal: SavingsGoal) => void
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void

  notifications: Notification[]
  markNotificationRead: (id: string) => void
  deleteNotification: (id: string) => void

  aiLanguage: string
  setAiLanguage: (lang: string) => void

  currency: string
  setCurrency: (curr: string) => void

  incomes: Income[]
  addIncome: (income: Income) => void

  getTotalBalance: () => number
  getAvailableBalance: () => number
  getReservedBalance: () => number
  getMonthlyIncome: () => number
  getMonthlySpending: () => number
  getSubPools: (parentId: string) => Pool[]

  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  chatOpen: boolean
  toggleChat: () => void
}

export const useStore = create<AppState>((set, get) => ({
  darkMode: localStorage.getItem('runda-dark') === 'true',
  toggleDarkMode: () => {
    const next = !get().darkMode
    localStorage.setItem('runda-dark', String(next))
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ darkMode: next })
  },

  isLocked: true,
  pin: localStorage.getItem('runda-pin') || '',
  setPin: (pin: string) => {
    localStorage.setItem('runda-pin', pin)
    set({ pin, isLocked: false })
  },
  unlock: (pin: string) => {
    const stored = get().pin
    if (stored === pin) {
      set({ isLocked: false })
      return true
    }
    return false
  },
  lock: () => set({ isLocked: true }),
  logout: () => {
    localStorage.removeItem('runda-pin')
    localStorage.removeItem('runda-onboarded')
    localStorage.removeItem('runda-username')
    localStorage.removeItem('runda-wallet')
    localStorage.removeItem('runda-pfp')
    set({
      isLocked: true,
      pin: '',
      hasOnboarded: false,
      userName: '',
      walletAddress: '',
      profilePicture: null
    })
  },

  hasOnboarded: localStorage.getItem('runda-onboarded') === 'true',
  setOnboarded: (val) => {
    localStorage.setItem('runda-onboarded', String(val))
    set({ hasOnboarded: val })
  },

  userName: localStorage.getItem('runda-username') || '',
  setUserName: (name) => {
    localStorage.setItem('runda-username', name)
    set({ userName: name })
  },

  walletAddress: localStorage.getItem('runda-wallet') || '',
  setWalletAddress: (address) => {
    localStorage.setItem('runda-wallet', address)
    set({ walletAddress: address })
  },

  profilePicture: localStorage.getItem('runda-pfp') || null,
  setProfilePicture: (pic) => {
    if (pic) localStorage.setItem('runda-pfp', pic)
    else localStorage.removeItem('runda-pfp')
    set({ profilePicture: pic })
  },

  balanceHidden: false,
  toggleBalance: () => set((s) => ({ balanceHidden: !s.balanceHidden })),

  pools: defaultPools,
  setPools: (pools) => set({ pools }),
  updatePool: (id, updates) =>
    set((s) => ({
      pools: s.pools.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  addPool: (pool) => set((s) => ({ pools: [...s.pools, pool] })),
  removePool: (id) =>
    set((s) => ({
      pools: s.pools.filter((p) => p.id !== id && p.parentId !== id),
    })),

  transactions: mockTransactions,
  addTransaction: (txn) => set((s) => ({ transactions: [txn, ...s.transactions] })),

  policies: [defaultPolicy],
  addPolicy: (policy) => set((s) => ({ policies: [...s.policies, policy] })),
  updatePolicy: (id, updates) =>
    set((s) => ({
      policies: s.policies.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  removePolicyAllocation: (policyId, poolId) =>
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === policyId
          ? { ...p, allocations: p.allocations.filter((a) => a.poolId !== poolId) }
          : p
      ),
    })),
  addPolicyAllocation: (policyId, allocation) =>
    set((s) => ({
      policies: s.policies.map((p) =>
        p.id === policyId
          ? { ...p, allocations: [...p.allocations, allocation] }
          : p
      ),
    })),

  goals: mockGoals,
  addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
  updateGoal: (id, updates) =>
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),

  notifications: mockNotifications,
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  deleteNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),

  aiLanguage: localStorage.getItem('runda-lang') || 'Pidgin English',
  setAiLanguage: (lang) => {
    localStorage.setItem('runda-lang', lang)
    set({ aiLanguage: lang })
  },

  currency: localStorage.getItem('runda-currency') || 'cNGN',
  setCurrency: (curr) => {
    localStorage.setItem('runda-currency', curr)
    set({ currency: curr })
  },

  incomes: mockIncome,
  addIncome: (income) => set((s) => ({ incomes: [income, ...s.incomes] })),

  getTotalBalance: () => get().pools.filter((p) => !p.parentId).reduce((sum, p) => sum + p.balance, 0),
  getAvailableBalance: () =>
    get()
      .pools.filter((p) => !p.parentId && p.restriction === 'available')
      .reduce((sum, p) => sum + p.balance, 0),
  getReservedBalance: () =>
    get()
      .pools.filter((p) => !p.parentId && p.restriction !== 'available')
      .reduce((sum, p) => sum + p.balance, 0),
  getMonthlyIncome: () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    return get()
      .incomes.filter((i) => {
        const d = new Date(i.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .reduce((sum, i) => sum + i.amount, 0)
  },
  getMonthlySpending: () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    return get()
      .transactions.filter((t) => {
        if (t.type !== 'expense') return false
        const d = new Date(t.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .reduce((sum, t) => sum + t.amount, 0)
  },
  getSubPools: (parentId) => get().pools.filter((p) => p.parentId === parentId),

  chatMessages: [],
  addChatMessage: (message) => set((s) => ({ chatMessages: [...s.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),
  chatOpen: false,
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
}))
