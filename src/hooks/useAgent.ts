import { useState, useCallback } from 'react'
import type { ChatMessage } from '../types'
import { useStore } from '../store/useStore'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface UseAgentReturn {
  loading: boolean
  error: string | null
  chat: (message: string, history: ChatMessage[]) => Promise<ChatMessage | null>
  parseImage: (base64: string) => Promise<any | null>
  parsePdf: (file: File) => Promise<any | null>
  parseSpreadsheet: (file: File) => Promise<any | null>
}

export function useAgent(): UseAgentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chat = useCallback(async (message: string, history: ChatMessage[]): Promise<ChatMessage | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.map((m) => ({ role: m.role, content: m.content })),
          language: useStore.getState().aiLanguage,
        }),
      })
      if (!res.ok) {
        // HACKATHON FALLBACK
        const msg = message.toLowerCase()
        let content = "I am Runda, your Web3 financial assistant! I can help you set up goals and allocate your incoming HSK."
        let allocations = undefined

        if (msg.includes('goal')) {
          content = "I have helped you set up a new Savings Goal for 'Macbook Pro'. I'll monitor your progress!"
          useStore.getState().addGoal({
            id: crypto.randomUUID(),
            name: 'Macbook Pro',
            targetAmount: 1500000,
            currentAmount: 0,
            deadline: '2026-12-31',
            contributionRate: 10,
            state: 'active',
            poolId: 'savings',
            createdAt: new Date().toISOString()
          })
        } else if (msg.includes('allocate') || msg.includes('policy')) {
          content = "I've drafted a new smart allocation policy for you. I suggest routing 50% to Savings, 30% to Expenses, and 20% to Investments. You can confirm this allocation in the chat."
          allocations = [{
            pools: [
              { name: 'Savings', percentage: 50, type: 'savings' as const, restriction: 'goal_locked' as const, icon: 'piggy-bank', color: '#013D7C' },
              { name: 'Expenses', percentage: 30, type: 'expense' as const, restriction: 'available' as const, icon: 'wallet', color: '#E8B931' },
              { name: 'Investments', percentage: 20, type: 'investment' as const, restriction: 'restricted' as const, icon: 'trending-up', color: '#2E7D32' },
            ]
          }]
        }

        return {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
          allocations,
        }
      }
      const data = await res.json()
      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || data.message || data.content || '',
        timestamp: new Date().toISOString(),
        allocations: data.allocations,
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to get response'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const parseImage = useCallback(async (base64: string): Promise<any | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/api/parse/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      if (!res.ok) throw new Error(`Parse failed: ${res.status}`)
      return await res.json()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to parse image'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const parseFile = useCallback(async (endpoint: string, file: File): Promise<any | null> => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${BASE_URL}/api/parse/${endpoint}`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(`Parse failed: ${res.status}`)
      return await res.json()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to parse file'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const parsePdf = useCallback((file: File) => parseFile('pdf', file), [parseFile])
  const parseSpreadsheet = useCallback((file: File) => parseFile('spreadsheet', file), [parseFile])

  return { loading, error, chat, parseImage, parsePdf, parseSpreadsheet }
}
