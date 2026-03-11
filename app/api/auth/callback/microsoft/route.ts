import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Microsoft OAuth callback handler
 * GET /api/auth/callback/microsoft
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      console.error('Microsoft OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=microsoft_auth_failed`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`
      )
    }

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !data.session) {
      console.error('Session exchange error:', exchangeError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=session_exchange_failed`
      )
    }

    // Check if user exists in customers table, if not create entry
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', data.user.email)
      .single()

    if (!existingCustomer) {
      // Create new customer record
      await supabase.from('customers').insert({
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email,
        company_name: data.user.user_metadata?.company || null,
        onboarding_status: 'pending',
        auth_provider: 'microsoft',
        created_at: new Date().toISOString(),
      })

      // Track new signup
      await supabase.from('auth_events').insert({
        event_type: 'microsoft_signup',
        email: data.user.email,
        created_at: new Date().toISOString(),
      })
    } else {
      // Track login
      await supabase.from('auth_events').insert({
        event_type: 'microsoft_login',
        email: data.user.email,
        created_at: new Date().toISOString(),
      })
    }

    // Set session cookie and redirect
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    )

    // Set auth cookies
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (err) {
    console.error('Microsoft callback error:', err)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=server_error`
    )
  }
}
