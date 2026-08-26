import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const DEFAULT_MODEL = 'qwen/qwen3.6-27b'
const FALLBACK_MODEL = 'llama-3.3-70b-versatile'

export async function chatCompletion(messages, options = {}) {
  const { model = DEFAULT_MODEL, temperature = 0.7, maxTokens = 1024 } = options
  try {
    const response = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    })
    return response.choices[0].message.content
  } catch (err) {
    if (model !== FALLBACK_MODEL) {
      const response = await groq.chat.completions.create({
        model: FALLBACK_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      })
      return response.choices[0].message.content
    }
    throw err
  }
}

export async function visionCompletion(imageBase64, prompt, options = {}) {
  const { model = DEFAULT_MODEL, temperature = 0.3, maxTokens = 1024 } = options
  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      temperature,
      max_tokens: maxTokens,
    })
    return response.choices[0].message.content
  } catch (err) {
    if (model !== FALLBACK_MODEL) {
      const response = await groq.chat.completions.create({
        model: FALLBACK_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        temperature,
        max_tokens: maxTokens,
      })
      return response.choices[0].message.content
    }
    throw err
  }
}

export async function jsonCompletion(messages, options = {}) {
  const { model = DEFAULT_MODEL, temperature = 0.2, maxTokens = 1024 } = options
  try {
    const response = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    })
    return response.choices[0].message.content
  } catch (err) {
    if (model !== FALLBACK_MODEL) {
      const response = await groq.chat.completions.create({
        model: FALLBACK_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      })
      return response.choices[0].message.content
    }
    throw err
  }
}
