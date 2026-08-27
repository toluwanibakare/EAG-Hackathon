import { Router } from 'express'
import { chatCompletion } from '../lib/groq.js'
import { SYSTEM_PROMPT, parseAllocationsFromResponse } from '../lib/personality.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { message, history = [], language = 'Pidgin English' } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    const systemPromptWithLang = `${SYSTEM_PROMPT}\n\nIMPORTANT: You must respond entirely in ${language}.`

    const messages = [
      { role: 'system', content: systemPromptWithLang },
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const reply = await chatCompletion(messages, { temperature: 0.7, maxTokens: 1024 })
    const allocations = parseAllocationsFromResponse(reply)

    res.json({ reply, allocations })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ error: 'Something went wrong. No wahala, try again.' })
  }
})

export default router
