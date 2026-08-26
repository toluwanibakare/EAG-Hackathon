import { Router } from 'express'

const router = Router()

let currentPools = [
  { id: 'pool-needs', name: 'Needs', type: 'needs', balance: 0, allocationPercentage: 40, icon: 'home', color: '#4F6DA8', restriction: 'available', requiresReason: false, requiresProof: false },
  { id: 'pool-savings', name: 'Savings', type: 'savings', balance: 0, allocationPercentage: 15, icon: 'piggy-bank', color: '#10B981', restriction: 'available', requiresReason: false, requiresProof: false },
  { id: 'pool-emergency', name: 'Emergency', type: 'emergency', balance: 0, allocationPercentage: 10, icon: 'shield', color: '#F59E0B', restriction: 'reason_required', restrictionMessage: 'Withdrawals require an emergency reason.', requiresReason: true, requiresProof: false },
  { id: 'pool-learning', name: 'Learning', type: 'learning', balance: 0, allocationPercentage: 7, icon: 'book-open', color: '#8B5CF6', restriction: 'proof_required', restrictionMessage: 'Proof of purchase required.', requiresReason: true, requiresProof: true },
  { id: 'pool-investment', name: 'Investment', type: 'investment', balance: 0, allocationPercentage: 10, icon: 'trending-up', color: '#06B6D4', restriction: 'restricted', restrictionMessage: 'Locked until minimum threshold reached.', requiresReason: false, requiresProof: false },
  { id: 'pool-fun', name: 'Fun', type: 'fun', balance: 0, allocationPercentage: 8, icon: 'smile', color: '#EC4899', restriction: 'available', requiresReason: false, requiresProof: false },
  { id: 'pool-giving', name: 'Giving', type: 'giving', balance: 0, allocationPercentage: 5, icon: 'heart', color: '#EF4444', restriction: 'available', requiresReason: false, requiresProof: false },
  { id: 'pool-flexible', name: 'Flexible', type: 'custom', balance: 0, allocationPercentage: 5, icon: 'shuffle', color: '#64748B', restriction: 'available', requiresReason: false, requiresProof: false },
]

router.get('/', (_req, res) => {
  res.json({ pools: currentPools })
})

router.post('/allocate', (req, res) => {
  try {
    const { amount, policyId } = req.body
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Positive amount is required' })
    }

    const allocations = currentPools.map(pool => {
      const allocated = Math.round((pool.allocationPercentage / 100) * amount * 100) / 100
      pool.balance += allocated
      return {
        poolId: pool.id,
        poolName: pool.name,
        percentage: pool.allocationPercentage,
        amount: allocated,
      }
    })

    res.json({
      income: amount,
      policyId: policyId || 'default',
      allocations,
      pools: currentPools,
    })
  } catch (err) {
    console.error('Allocate error:', err.message)
    res.status(500).json({ error: 'Failed to allocate' })
  }
})

router.post('/withdraw', (req, res) => {
  try {
    const { poolId, amount, reason } = req.body
    if (!poolId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'poolId and positive amount are required' })
    }

    const pool = currentPools.find(p => p.id === poolId)
    if (!pool) return res.status(404).json({ error: 'Pool not found' })

    if (pool.balance < amount) {
      return res.status(400).json({ error: `Insufficient balance. Pool "${pool.name}" has ${pool.balance} USDT.` })
    }

    if (pool.restriction === 'reason_required' && !reason) {
      return res.status(400).json({ error: 'This pool requires a reason for withdrawal.', restriction: pool.restriction })
    }

    if (pool.restriction === 'proof_required') {
      return res.status(400).json({ error: 'This pool requires proof of purchase for withdrawal.', restriction: pool.restriction })
    }

    if (pool.restriction === 'restricted' || pool.restriction === 'goal_locked') {
      return res.status(400).json({ error: pool.restrictionMessage || 'This pool is currently locked.', restriction: pool.restriction })
    }

    pool.balance -= amount

    res.json({
      success: true,
      poolId,
      poolName: pool.name,
      amount,
      remaining: pool.balance,
      reason,
    })
  } catch (err) {
    console.error('Withdraw error:', err.message)
    res.status(500).json({ error: 'Failed to process withdrawal' })
  }
})

export default router
