import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Track auth events for analytics
 * POST /api/track
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, email, metadata = {} } = body

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event type required' },
        { status: 400 }
      )
    }

    // Insert event
    await supabase.from('auth_events').insert({
      event_type: event,
      email: email || null,
      metadata,
      created_at: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Track API error:', err)
    // Don't fail the request, just log
    return NextResponse.json({ success: true })
  }
}
