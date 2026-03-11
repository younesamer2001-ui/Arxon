import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // If user denied consent or error occurred
  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url))
    }
  }

  // Successful auth — go to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
