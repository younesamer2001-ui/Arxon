import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * POST /api/onboarding/intake
 * Submits the customer's intake/kartlegging form.
 * Updates onboarding status and stores form data.
 *
 * Expected body:
 * {
 *   answers: Record<string, any>,  // key-value pairs from the intake form
 *   integrations?: string[],       // requested integrations (e.g. ['tripletex', 'vipps'])
 *   notes?: string,                // additional notes from customer
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 })
    }

    // Get customer record
    const { data: customer, error: custError } = await supabaseAdmin
      .from('customers')
      .select('id, order_id, onboarding_status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (custError || !customer) {
      return NextResponse.json({ error: 'Ingen kundepost funnet' }, { status: 404 })
    }

    const body = await req.json()
    const { answers, integrations, notes } = body

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Mangler answers-objekt' }, { status: 400 })
    }

    // Update the intake_form step to completed
    await supabaseAdmin
      .from('onboarding_tracking')
      .update({
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        metadata: {
          answers,
          integrations: integrations || [],
          notes: notes || null,
          submitted_at: new Date().toISOString(),
        },
      })
      .eq('customer_id', customer.id)
      .eq('step_key', 'intake_form')

    // Move integration_setup step to in_progress
    await supabaseAdmin
      .from('onboarding_tracking')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .eq('customer_id', customer.id)
      .eq('step_key', 'integration_setup')

    // Update customer onboarding status
    await supabaseAdmin
      .from('customers')
      .update({
        onboarding_status: 'intake_completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.id)

    // Store integrations on each automation's config
    if (integrations && integrations.length > 0) {
      const { data: automations } = await supabaseAdmin
        .from('customer_automations')
        .select('id, config')
        .eq('customer_id', customer.id)

      for (const auto of automations || []) {
        await supabaseAdmin
          .from('customer_automations')
          .update({
            status: 'setup_pending',
            config: { ...(auto.config as object), requested_integrations: integrations },
            updated_at: new Date().toISOString(),
          })
          .eq('id', auto.id)
      }
    }

    // Trigger n8n webhook for intake form submitted (fire-and-forget)
    const n8nBaseUrl = process.env.N8N_BASE_URL
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (n8nBaseUrl) {
      fetch(`${n8nBaseUrl}/webhook/arxon-intake-completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': webhookSecret || '',
        },
        body: JSON.stringify({
          customer_id: customer.id,
          order_id: customer.order_id,
          email: user.email,
          answers,
          integrations: integrations || [],
          notes: notes || null,
        }),
      }).catch(err => console.error('n8n intake webhook error:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Kartleggingsskjema mottatt',
      onboarding_status: 'intake_completed',
    })
  } catch (err: any) {
    console.error('Intake POST error:', err)
    return NextResponse.json({ error: err.message || 'Intern feil' }, { status: 500 })
  }
}
