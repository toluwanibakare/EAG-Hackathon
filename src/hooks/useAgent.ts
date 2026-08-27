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
      if (!res.ok) throw new Error(`Chat failed: ${res.status}`)
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
