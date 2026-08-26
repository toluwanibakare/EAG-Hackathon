import { jsonCompletion, visionCompletion } from './groq.js'

const RULES_SYSTEM_PROMPT = `You are a financial rule parser. Extract allocation policies and pool definitions from the given input.
Return valid JSON with this structure:
{
  "policies": [
    {
      "name": "policy name",
      "isDefault": true/false,
      "incomeSource": "salary|freelance|business|investment|gift|other",
      "allocations": [
        {
          "poolName": "Needs",
          "percentage": 40,
          "poolType": "needs",
          "icon": "home",
          "color": "#4F6DA8",
          "restriction": "available|restricted|goal_locked|reason_required|proof_required|cooldown_required"
        }
      ]
    }
  ],
  "pools": [
    {
      "name": "Pool Name",
      "type": "needs|savings|emergency|learning|investment|fun|giving|flexible|custom",
      "allocationPercentage": 40,
      "icon": "lucide-icon-name",
      "color": "#hex",
      "restriction": "available|restricted|goal_locked|reason_required|proof_required|cooldown_required",
      "restrictionMessage": "optional message"
    }
  ]
}

Pool type to icon mapping:
- needs: home
- savings: piggy-bank
- emergency: shield
- learning: book-open
- investment: trending-up
- fun: smile
- giving: heart
- flexible: shuffle

Pool type to default color:
- needs: #4F6DA8
- savings: #10B981
- emergency: #F59E0B
- learning: #8B5CF6
- investment: #06B6D4
- fun: #EC4899
- giving: #EF4444
- flexible/custom: #64748B

All amounts are in USD (USDT), never naira.`

export async function parseTextRules(text) {
  const messages = [
    { role: 'system', content: RULES_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Parse the following text into allocation policies and pool definitions:\n\n${text}`,
    },
  ]
  const raw = await jsonCompletion(messages)
  try {
    return JSON.parse(raw)
  } catch {
    return { policies: [], pools: [] }
  }
}

export async function parseImageRules(base64Image) {
  const prompt = `Analyze this image and extract any budget allocation rules, pool definitions, or financial policies.
Return a JSON object with "policies" and "pools" arrays.
Each policy has: name, isDefault, incomeSource, allocations (array of poolName, percentage, poolType, icon, color, restriction).
Each pool has: name, type, allocationPercentage, icon, color, restriction, restrictionMessage.
Use lucide icon names. Use hex colors. All amounts in USD.`
  const raw = await visionCompletion(base64Image, prompt)
  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { policies: [], pools: [] }
  }
}

export async function parsePdfRules(pdfText) {
  const messages = [
    { role: 'system', content: RULES_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Extract allocation policies and pools from this PDF text:\n\n${pdfText.slice(0, 4000)}`,
    },
  ]
  const raw = await jsonCompletion(messages)
  try {
    return JSON.parse(raw)
  } catch {
    return { policies: [], pools: [] }
  }
}

export async function parseSpreadsheetRules(sheetData) {
  const messages = [
    { role: 'system', content: RULES_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Extract allocation policies and pools from this spreadsheet data:\n\n${JSON.stringify(sheetData).slice(0, 4000)}`,
    },
  ]
  const raw = await jsonCompletion(messages)
  try {
    return JSON.parse(raw)
  } catch {
    return { policies: [], pools: [] }
  }
}
