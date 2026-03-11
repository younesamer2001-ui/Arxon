import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

// Verify webhook secret
function verifySecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  return secret === process.env.WEBHOOK_SECRET
}

/**
 * POST /api/webhooks/calls
 * Receives inbound call data from Vapi / n8n / external telephony
 * Writes directly to the `calls` table so the dashboard shows live data.
 *
 * Expected body:
 * {
 *   customer_id: string,          // UUID of the customer
 *   caller_name?: string,
 *   caller_number: string,
 *   status: 'answered' | 'missed' | 'voicemail',
 *   duration_seconds?: number,
 *   summary?: string,             // AI-generated call summary
 *   sentiment?: string,           // positive | neutral | negative
 *   recording_url?: string,
 *   metadata?: Record<string, any>
 * }
 */
export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      customer_id,
      caller_name,
      caller_number,
      status,
      duration_seconds,
      summary,
      sentiment,
      recording_url,
      metadata,
    } = body

    if (!customer_id || !caller_number || !status) {
      return NextResponse.json(
        { error: 'Mangler customer_id, caller_number eller status' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('calls')
      .insert({
        customer_id,
        caller_name: caller_name || null,
        caller_number,
        status,
        duration_seconds: duration_seconds || 0,
        summary: summary || null,
        sentiment: sentiment || null,
        recording_url: recording_url || null,
        metadata: metadata || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Webhook calls insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, call: data })
  } catch (err: any) {
    console.error('Webhook calls error:', err)
    return NextResponse.json({ error: err.message || 'Intern feil' }, { status: 500 })
  }
}
