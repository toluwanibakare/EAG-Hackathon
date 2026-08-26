import { Router } from 'express'
import multer from 'multer'
import pdfParse from 'pdf-parse'
import * as XLSX from 'xlsx'
import { visionCompletion, jsonCompletion } from '../lib/groq.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

const EXTRACT_PROMPT = `Analyze this image and extract any budget, financial, or allocation data.
Return a JSON object with a "pools" array. Each pool has: name, percentage, type, restriction, icon, color.
Pool types: needs, savings, emergency, learning, investment, fun, giving, flexible, custom.
Restrictions: available, restricted, goal_locked, reason_required, proof_required, cooldown_required.
Icons use lucide icon names. Colors are hex. All amounts are in USD (USDT).
If no financial data found, return {"pools": [], "raw": {"note": "No financial data found"}}.`

const STRUCTURE_PROMPT = `You are a financial data parser. Given the following text, extract budget or allocation data and return a JSON object with a "pools" array.
Each pool has: name, percentage, type, restriction, icon, color, restrictionMessage (optional).
Pool types: needs, savings, emergency, learning, investment, fun, giving, flexible, custom.
Restrictions: available, restricted, goal_locked, reason_required, proof_required, cooldown_required.
If percentages don't add to 100, normalize them. If no data found, return {"pools": []}.
All amounts are in USD (USDT), never naira.`

router.post('/image', async (req, res) => {
  try {
    const { image } = req.body
    if (!image) return res.status(400).json({ error: 'Base64 image is required' })

    const raw = await visionCompletion(image, EXTRACT_PROMPT, { temperature: 0.2 })
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)

    res.json({ pools: parsed.pools || [], raw: parsed.raw })
  } catch (err) {
    console.error('Image parse error:', err.message)
    res.status(500).json({ error: 'Failed to parse image' })
  }
})

router.post('/pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'PDF file is required' })

    const data = await pdfParse(req.file.buffer)
    const text = data.text

    if (!text.trim()) return res.json({ pools: [], raw: { note: 'PDF has no readable text' } })

    const messages = [
      { role: 'system', content: STRUCTURE_PROMPT },
      { role: 'user', content: `Extract budget/allocation data from this PDF text:\n\n${text.slice(0, 4000)}` },
    ]

    const raw = await jsonCompletion(messages)
    const parsed = JSON.parse(raw)

    res.json({ pools: parsed.pools || [], raw: { pageCount: data.numpages, textLength: text.length } })
  } catch (err) {
    console.error('PDF parse error:', err.message)
    res.status(500).json({ error: 'Failed to parse PDF' })
  }
})

router.post('/spreadsheet', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Spreadsheet file is required' })

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

    if (!sheetData.length) return res.json({ pools: [], raw: { note: 'Spreadsheet is empty' } })

    const messages = [
      { role: 'system', content: STRUCTURE_PROMPT },
      {
        role: 'user',
        content: `Extract budget/allocation data from this spreadsheet:\n\n${JSON.stringify(sheetData).slice(0, 4000)}`,
      },
    ]

    const raw = await jsonCompletion(messages)
    const parsed = JSON.parse(raw)

    res.json({ pools: parsed.pools || [], raw: { sheetName, rowCount: sheetData.length } })
  } catch (err) {
    console.error('Spreadsheet parse error:', err.message)
    res.status(500).json({ error: 'Failed to parse spreadsheet' })
  }
})

export default router
