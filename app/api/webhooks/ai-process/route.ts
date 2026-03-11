import { NextRequest, NextResponse } from 'next/server'
import { summarizeCall, analyzeSentiment, qualifyLead, extractContactInfo } from '@/lib/openai'

function verifySecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  return secret === process.env.WEBHOOK_SECRET
}

/**
 * POST /api/webhooks/ai-process
 * AI processing endpoint for n8n workflows.
 * Accepts different action types and returns AI-enriched data.
 *
 * Expected body:
 * {
 *   action: 'summarize_call' | 'analyze_sentiment' | 'qualify_lead' | 'extract_contact',
 *   data: { ... }  // action-specific payload
 * }
 */
export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action, data } = body

    if (!action || !data) {
      return NextResponse.json({ error: 'Mangler action eller data' }, { status: 400 })
    }

    let result: any

    switch (action) {
      case 'summarize_call':
        if (!data.transcript) {
          return NextResponse.json({ error: 'Mangler transcript' }, { status: 400 })
        }
        result = { summary: await summarizeCall(data.transcript) }
        break

      case 'analyze_sentiment':
        if (!data.text) {
          return NextResponse.json({ error: 'Mangler text' }, { status: 400 })
        }
        result = { sentiment: await analyzeSentiment(data.text) }
        break

      case 'qualify_lead':
        if (!data.name) {
          return NextResponse.json({ error: 'Mangler name' }, { status: 400 })
        }
        result = await qualifyLead(data)
        break

      case 'extract_contact':
        if (!data.text) {
          return NextResponse.json({ error: 'Mangler text' }, { status: 400 })
        }
        result = await extractContactInfo(data.text)
        break

      default:
        return NextResponse.json({ error: `Ukjent action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error('AI process error:', err)
    return NextResponse.json({ error: err.message || 'AI-prosessering feilet' }, { status: 500 })
  }
}
