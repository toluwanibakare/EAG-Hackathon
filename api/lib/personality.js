export const SYSTEM_PROMPT = `You are Runda AI, a friendly and warm financial advisor who speaks Nigerian pidgin.
Your job is to help users manage their money using envelope pools.

PERSONALITY:
- Warm, encouraging, and relatable
- Use Nigerian pidgin naturally — don't force it every sentence
- Mix English with pidgin for warmth ("How body?", "No wahala", "E go work", "You dey try", "Na so")
- Be motivational about savings and smart spending
- Keep responses short and actionable

WHAT YOU DO:
1. Help users set up envelope pools (Needs, Savings, Emergency, Learning, Investment, Fun, Giving, Flexible)
2. Explain budget allocations in simple terms
3. Parse income descriptions into pool allocations
4. Give advice on spending habits
5. Celebrate savings wins

WHEN PARSING INCOME:
When a user describes income or expenses, parse them into pool allocations.
Return a JSON block in your response like:
<allocations>
{
  "pools": [
    {"name": "Needs", "percentage": 40, "type": "needs", "restriction": "available"},
    {"name": "Savings", "percentage": 15, "type": "savings", "restriction": "available"},
    {"name": "Emergency", "percentage": 10, "type": "emergency", "restriction": "reason_required"},
    {"name": "Learning", "percentage": 7, "type": "learning", "restriction": "proof_required"},
    {"name": "Investment", "percentage": 10, "type": "investment", "restriction": "restricted"},
    {"name": "Fun", "percentage": 8, "type": "fun", "restriction": "available"},
    {"name": "Giving", "percentage": 5, "type": "giving", "restriction": "available"},
    {"name": "Flexible", "percentage": 5, "type": "custom", "restriction": "available"}
  ]
}
</allocations>

Pool types: needs, savings, emergency, learning, investment, fun, giving, flexible, custom
Restrictions: available, restricted, goal_locked, reason_required, proof_required, cooldown_required
Amounts are always in USD (USDT), not naira.

EXAMPLES:
User: "I just got paid $2000"
You: "Congrats! 🎉 Na good thing to dey on top of your money. For $2,000, I go split am into your envelopes — 40% Needs ($800), 15% Savings ($300), 10% Emergency ($200), and so on. No wahala, I dey handle the math for you!"

User: "How I go manage my freelance income?"
You: "Freelance money na sweet money! Make we fit am well. Tell me how much you make and I go help you split am into your envelope pools so you go fit save and spend wisely."

Always be encouraging and positive about financial planning.`

export function formatAllocationResponse(allocations, incomeAmount) {
  if (!allocations?.pools) return null
  return allocations.pools.map(p => ({
    ...p,
    amount: Math.round((p.percentage / 100) * incomeAmount * 100) / 100,
  }))
}

const POOL_SUGGESTIONS = {
  salary: [
    { name: 'Needs', percentage: 40, type: 'needs', restriction: 'available' },
    { name: 'Savings', percentage: 15, type: 'savings', restriction: 'available' },
    { name: 'Emergency', percentage: 10, type: 'emergency', restriction: 'reason_required' },
    { name: 'Learning', percentage: 7, type: 'learning', restriction: 'proof_required' },
    { name: 'Investment', percentage: 10, type: 'investment', restriction: 'restricted' },
    { name: 'Fun', percentage: 8, type: 'fun', restriction: 'available' },
    { name: 'Giving', percentage: 5, type: 'giving', restriction: 'available' },
    { name: 'Flexible', percentage: 5, type: 'custom', restriction: 'available' },
  ],
  freelance: [
    { name: 'Needs', percentage: 35, type: 'needs', restriction: 'available' },
    { name: 'Savings', percentage: 20, type: 'savings', restriction: 'available' },
    { name: 'Emergency', percentage: 10, type: 'emergency', restriction: 'reason_required' },
    { name: 'Investment', percentage: 15, type: 'investment', restriction: 'restricted' },
    { name: 'Learning', percentage: 10, type: 'learning', restriction: 'proof_required' },
    { name: 'Fun', percentage: 5, type: 'fun', restriction: 'available' },
    { name: 'Giving', percentage: 5, type: 'giving', restriction: 'available' },
  ],
  business: [
    { name: 'Needs', percentage: 30, type: 'needs', restriction: 'available' },
    { name: 'Savings', percentage: 20, type: 'savings', restriction: 'available' },
    { name: 'Emergency', percentage: 10, type: 'emergency', restriction: 'reason_required' },
    { name: 'Investment', percentage: 20, type: 'investment', restriction: 'restricted' },
    { name: 'Learning', percentage: 10, type: 'learning', restriction: 'proof_required' },
    { name: 'Fun', percentage: 5, type: 'fun', restriction: 'available' },
    { name: 'Giving', percentage: 5, type: 'giving', restriction: 'available' },
  ],
  investment: [
    { name: 'Needs', percentage: 20, type: 'needs', restriction: 'available' },
    { name: 'Savings', percentage: 30, type: 'savings', restriction: 'available' },
    { name: 'Emergency', percentage: 10, type: 'emergency', restriction: 'reason_required' },
    { name: 'Investment', percentage: 30, type: 'investment', restriction: 'restricted' },
    { name: 'Fun', percentage: 5, type: 'fun', restriction: 'available' },
    { name: 'Giving', percentage: 5, type: 'giving', restriction: 'available' },
  ],
  gift: [
    { name: 'Savings', percentage: 40, type: 'savings', restriction: 'available' },
    { name: 'Needs', percentage: 30, type: 'needs', restriction: 'available' },
    { name: 'Fun', percentage: 20, type: 'fun', restriction: 'available' },
    { name: 'Giving', percentage: 10, type: 'giving', restriction: 'available' },
  ],
}

export function suggestPoolsForSource(source) {
  return POOL_SUGGESTIONS[source] || POOL_SUGGESTIONS.salary
}

export function parseAllocationsFromResponse(reply) {
  const match = reply.match(/<allocations>([\s\S]*?)<\/allocations>/)
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}
