import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []

  // Remove timestamps older than the window
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  )

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  // Add current timestamp
  recentTimestamps.push(now)
  rateLimitMap.set(ip, recentTimestamps)

  // Clean up old IPs periodically
  if (Math.random() < 0.01) {
    for (const [key, times] of rateLimitMap.entries()) {
      const valid = times.filter((t) => now - t < RATE_LIMIT_WINDOW)
      if (valid.length === 0) {
        rateLimitMap.delete(key)
      } else {
        rateLimitMap.set(key, valid)
      }
    }
  }

  return false
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── API routes: rate limiting + CORS ──
  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(request)

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://arxon.no').split(',').map(o => o.trim())
    const origin = request.headers.get('origin') || ''
    const response = NextResponse.next()

    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else if (allowedOrigins.includes('*')) {
      response.headers.set('Access-Control-Allow-Origin', '*')
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,DELETE,PATCH,POST,PUT'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization'
    )

    return response
  }

  // ── Create response for potential cookie updates ──
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ── Protected routes: use Supabase SSR to check session ──
  const protectedPaths = ['/dashboard']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            // Update request cookies for downstream handlers
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
            // Create new response with updated request
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            // Set cookies on the response
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options as any)
            })
          },
        },
      }
    )

    // This will refresh the session if needed and update cookies
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Page routes: geo detection via Vercel headers ──
  // Vercel automatically injects these headers on their edge network
  const city = request.headers.get('x-vercel-ip-city')
  const country = request.headers.get('x-vercel-ip-country')
  const region = request.headers.get('x-vercel-ip-country-region')

  // Set lightweight cookies so client components can read geo data
  if (city) {
    response.cookies.set('arxon-geo-city', decodeURIComponent(city), {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      httpOnly: false, // client needs to read it
    })
  }
  if (country) {
    response.cookies.set('arxon-geo-country', country, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      httpOnly: false,
    })
  }
  if (region) {
    response.cookies.set('arxon-geo-region', region, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      httpOnly: false,
    })
  }

  return response
}

// Match both API routes (rate limiting) and page routes (geo detection)
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)).*)',
  ],
}
