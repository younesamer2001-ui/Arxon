import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

function verifySecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  return secret === process.env.WEBHOOK_SECRET
}

/**
 * POST /api/webhooks/leads
 * Receives new lead data from n8n / landing pages / AI agents
 * Writes directly to the `leads` table so the dashboard shows live data.
 *
 * Expected body:
 * {
 *   customer_id: string,
 *   name: string,
 *   email?: string,
 *   phone?: string,
 *   company?: string,
 *   source?: string,              // e.g. 'website', 'facebook', 'google', 'vapi'
 *   status?: 'new' | 'contacted' | 'qualified' | 'hot' | 'converted' | 'lost',
 *   interest?: string,            // what they're interested in
 *   notes?: string,
 *   score?: number,               // lead score 0-100
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
      name,
      email,
      phone,
      company,
      source,
      status,
      interest,
      notes,
      score,
      metadata,
    } = body

    if (!customer_id || !name) {
      return NextResponse.json(
        { error: 'Mangler customer_id eller name' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        customer_id,
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        source: source || 'unknown',
        status: status || 'new',
        interest: interest || null,
        notes: notes || null,
        score: score || null,
        metadata: metadata || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Webhook leads insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead: data })
  } catch (err: any) {
    console.error('Webhook leads error:', err)
    return NextResponse.json({ error: err.message || 'Intern feil' }, { status: 500 })
  }
}
