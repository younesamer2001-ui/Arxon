/**
 * OpenAI helper for Arxon AI-powered features.
 * Used by n8n workflows and API routes for:
 * - Call summarization
 * - Lead qualification / scoring
 * - Email drafting
 * - Sentiment analysis
 *
 * Requires OPENAI_API_KEY env variable.
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIOptions {
  model?: string
  temperature?: number
  max_tokens?: number
}

async function chatCompletion(
  messages: ChatMessage[],
  options: OpenAIOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || 'gpt-4o-mini',
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.max_tokens || 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content?.trim() || ''
}

// ---- Specific AI features ----

/**
 * Summarize a phone call transcript.
 */
export async function summarizeCall(transcript: string): Promise<string> {
  return chatCompletion([
    {
      role: 'system',
      content:
        'Du er en AI-assistent for et norsk selskap. Oppsummer telefonsamtalen kort på norsk. Inkluder: hvem som ringte, hva de ville, og eventuelle neste steg. Maks 3 setninger.',
    },
    { role: 'user', content: transcript },
  ])
}

/**
 * Analyze sentiment of a call or message.
 * Returns: 'positive' | 'neutral' | 'negative'
 */
export async function analyzeSentiment(text: string): Promise<string> {
  const result = await chatCompletion([
    {
      role: 'system',
      content:
        'Analyze the sentiment of the following text. Respond with ONLY one word: positive, neutral, or negative.',
    },
    { role: 'user', content: text },
  ], { temperature: 0 })

  const lower = result.toLowerCase().trim()
  if (['positive', 'neutral', 'negative'].includes(lower)) return lower
  return 'neutral'
}

/**
 * Score and qualify a lead based on available information.
 * Returns a score 0-100 and a short reason.
 */
export async function qualifyLead(leadInfo: {
  name: string
  company?: string
  interest?: string
  source?: string
  notes?: string
}): Promise<{ score: number; reason: string; status: string }> {
  const prompt = `
Lead-informasjon:
- Navn: ${leadInfo.name}
- Firma: ${leadInfo.company || 'Ukjent'}
- Interesse: ${leadInfo.interest || 'Ukjent'}
- Kilde: ${leadInfo.source || 'Ukjent'}
- Notater: ${leadInfo.notes || 'Ingen'}

Gi en lead-score fra 0-100 og en kort begrunnelse på norsk.
Svar i JSON-format: {"score": number, "reason": "string", "status": "new|contacted|qualified|hot"}
`

  const result = await chatCompletion([
    {
      role: 'system',
      content: 'Du er en salgs-AI som kvalifiserer leads for norske bedrifter. Svar alltid i gyldig JSON.',
    },
    { role: 'user', content: prompt },
  ], { temperature: 0.2 })

  try {
    return JSON.parse(result)
  } catch {
    return { score: 50, reason: 'Kunne ikke analysere lead', status: 'new' }
  }
}

/**
 * Draft a follow-up email based on context.
 */
export async function draftFollowUpEmail(context: {
  recipientName: string
  company?: string
  topic: string
  tone?: 'formal' | 'friendly' | 'professional'
}): Promise<string> {
  return chatCompletion([
    {
      role: 'system',
      content: `Du er en profesjonell e-postforfatter for et norsk teknologiselskap (Arxon). Skriv en oppfølgings-epost på norsk. Tonen skal være ${context.tone || 'professional'}. Hold det kort og relevant.`,
    },
    {
      role: 'user',
      content: `Skriv en oppfølgings-epost til ${context.recipientName}${context.company ? ` fra ${context.company}` : ''} om: ${context.topic}`,
    },
  ])
}

/**
 * Extract structured data from unstructured text (e.g., voicemail transcription).
 */
export async function extractContactInfo(text: string): Promise<{
  name?: string
  phone?: string
  email?: string
  company?: string
  reason?: string
}> {
  const result = await chatCompletion([
    {
      role: 'system',
      content:
        'Extract contact information from the following text. Return valid JSON with fields: name, phone, email, company, reason. Use null for missing fields.',
    },
    { role: 'user', content: text },
  ], { temperature: 0 })

  try {
    return JSON.parse(result)
  } catch {
    return {}
  }
}

export { chatCompletion, type ChatMessage, type OpenAIOptions }
