import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Send magic link for passwordless login
 * POST /api/auth/magic-link
 */
export async function POST(request: Request) {
  try {
    const { email, redirectTo = '/dashboard' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-post er påkrevd' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Ugyldig e-postadresse' },
        { status: 400 }
      )
    }

    // Generate magic link
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${redirectTo}`,
      },
    })

    if (error) {
      console.error('Magic link error:', error)
      return NextResponse.json(
        { success: false, error: 'Kunne ikke sende innloggingslenke' },
        { status: 500 }
      )
    }

    // Log for analytics
    await supabase.from('auth_events').insert({
      event_type: 'magic_link_sent',
      email,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Innloggingslenke sendt',
    })
  } catch (err) {
    console.error('Magic link API error:', err)
    return NextResponse.json(
      { success: false, error: 'Serverfeil' },
      { status: 500 }
    )
  }
}
