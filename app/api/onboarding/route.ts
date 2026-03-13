import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * GET /api/onboarding
 * Returns the authenticated customer's onboarding status, steps, and automations.
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {}
        }
      }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 })
    }

    // Get customer record
    const { data: customer, error: custError } = await supabaseAdmin
      .from('customers')
      .select('id, company_name, email, onboarding_status, order_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (custError || !customer) {
      return NextResponse.json({ error: 'Ingen kundepost funnet' }, { status: 404 })
    }

    // Get onboarding steps
    const { data: steps } = await supabaseAdmin
      .from('onboarding_tracking')
      .select('*')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: true })

    // Get customer automations
    const { data: automations } = await supabaseAdmin
      .from('customer_automations')
      .select('*')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      customer: {
        id: customer.id,
        company_name: customer.company_name,
        email: customer.email,
        onboarding_status: customer.onboarding_status,
        order_id: customer.order_id,
      },
      steps: steps || [],
      automations: automations || [],
    })
  } catch (err: any) {
    console.error('Onboarding GET error:', err)
    return NextResponse.json({ error: err.message || 'Intern feil' }, { status: 500 })
  }
}
