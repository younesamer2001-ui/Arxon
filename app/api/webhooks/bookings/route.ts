import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

function verifySecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  return secret === process.env.WEBHOOK_SECRET
}

/**
 * POST /api/webhooks/bookings
 * Receives new booking data from Cal.com / n8n / AI booking agent
 * Writes directly to the `bookings` table so the dashboard shows live data.
 *
 * Expected body:
 * {
 *   customer_id: string,
 *   client_name: string,
 *   client_email?: string,
 *   client_phone?: string,
 *   booking_type?: string,        // e.g. 'consultation', 'demo', 'service'
 *   meeting_date: string,         // YYYY-MM-DD
 *   start_time?: string,          // HH:MM
 *   end_time?: string,            // HH:MM
 *   location?: string,            // 'online', 'office', address
 *   notes?: string,
 *   status?: 'confirmed' | 'pending' | 'cancelled' | 'completed',
 *   source?: string,              // 'cal.com', 'vapi', 'website'
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
      client_name,
      client_email,
      client_phone,
      booking_type,
      meeting_date,
      start_time,
      end_time,
      location,
      notes,
      status,
      source,
      metadata,
    } = body

    if (!customer_id || !client_name || !meeting_date) {
      return NextResponse.json(
        { error: 'Mangler customer_id, client_name eller meeting_date' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_id,
        client_name,
        client_email: client_email || null,
        client_phone: client_phone || null,
        booking_type: booking_type || 'consultation',
        meeting_date,
        start_time: start_time || null,
        end_time: end_time || null,
        location: location || null,
        notes: notes || null,
        status: status || 'confirmed',
        source: source || 'unknown',
        metadata: metadata || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Webhook bookings insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, booking: data })
  } catch (err: any) {
    console.error('Webhook bookings error:', err)
    return NextResponse.json({ error: err.message || 'Intern feil' }, { status: 500 })
  }
}
