import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

function verifySecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-webhook-secret') || req.headers.get('authorization')?.replace('Bearer ', '')
  return secret === process.env.WEBHOOK_SECRET
}

/**
 * POST /api/webhooks/n8
 * General n8n callback endpoint for workflow status updates.
 * n8n calls this to report progress on automation setup, deployment, etc.
 *
 * Expected body:
 * {
 *   event: 'workflow_deployed' | 'workflow_error' | 'workflow_activated' |
 *          'onboarding_step_update' | 'automation_status_update' | 'customer_status_update',
 *   data: { ... }  // event-specific payload
 * }
 */
export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { event, data } = body

    if (!event || !data) {
      return NextResponse.json({ error: 'Mangler event eller data' }, { status: 400 })
    }

    switch (event) {
      // n8n has deployed a workflow for a customer automation
      case 'workflow_deployed': {
        const { customer_id, automation_key, n8n_workflow_id } = data
        if (!customer_id || !automation_key) {
          return NextResponse.json({ error: 'Mangler customer_id eller automation_key' }, { status: 400 })
        }

        await supabaseAdmin
          .from('customer_automations')
          .update({
            n8n_workflow_id: n8n_workflow_id || null,
            status: 'configuring',
            updated_at: new Date().toISOString(),
          })
          .eq('customer_id', customer_id)
          .eq('automation_key', automation_key)

        break
      }

      // n8n reports that a workflow is now active/live
      case 'workflow_activated': {
        const { customer_id, automation_key, n8n_workflow_id } = data
        if (!customer_id || !automation_key) {
          return NextResponse.json({ error: 'Mangler customer_id eller automation_key' }, { status: 400 })
        }

        await supabaseAdmin
          .from('customer_automations')
          .update({
            n8n_workflow_id: n8n_workflow_id || undefined,
            status: 'active',
            activated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('customer_id', customer_id)
          .eq('automation_key', automation_key)

        break
      }

      // n8n reports a workflow error
      case 'workflow_error': {
        const { customer_id, automation_key, error_message } = data
        if (!customer_id || !automation_key) {
          return NextResponse.json({ error: 'Mangler customer_id eller automation_key' }, { status: 400 })
        }

        await supabaseAdmin
          .from('customer_automations')
          .update({
            status: 'error',
            updated_at: new Date().toISOString(),
          })
          .eq('customer_id', customer_id)
          .eq('automation_key', automation_key)

        // Also log as ai_activity for the dashboard
        await supabaseAdmin
          .from('ai_activities')
          .insert({
            customer_id,
            type: 'workflow_error',
            description: `Feil i automatisering: ${automation_key} — ${error_message || 'Ukjent feil'}`,
            metadata: { automation_key, error_message },
            created_at: new Date().toISOString(),
          })

        break
      }

      // Generic onboarding step update from n8n
      case 'onboarding_step_update': {
        const { customer_id, step_key, status, metadata } = data
        if (!customer_id || !step_key || !status) {
          return NextResponse.json({ error: 'Mangler customer_id, step_key eller status' }, { status: 400 })
        }

        const updateData: Record<string, any> = { status }
        if (status === 'in_progress') updateData.started_at = new Date().toISOString()
        if (status === 'completed') updateData.completed_at = new Date().toISOString()
        if (metadata) updateData.metadata = metadata

        await supabaseAdmin
          .from('onboarding_tracking')
          .update(updateData)
          .eq('customer_id', customer_id)
          .eq('step_key', step_key)

        break
      }

      // Direct automation status update
      case 'automation_status_update': {
        const { customer_id, automation_key, status } = data
        if (!customer_id || !automation_key || !status) {
          return NextResponse.json({ error: 'Mangler customer_id, automation_key eller status' }, { status: 400 })
        }

        const updateData: Record<string, any> = {
          status,
          updated_at: new Date().toISOString(),
        }
        if (status === 'active') updateData.activated_at = new Date().toISOString()

        await supabaseAdmin
          .from('customer_automations')
          .update(updateData)
          .eq('customer_id', customer_id)
          .eq('automation_key', automation_key)

        break
      }

      // Update customer-level onboarding status
      case 'customer_status_update': {
        const { customer_id, onboarding_status } = data
        if (!customer_id || !onboarding_status) {
          return NextResponse.json({ error: 'Mangler customer_id eller onboarding_status' }, { status: 400 })
        }

        await supabaseAdmin
          .from('customers')
          .update({
            onboarding_status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customer_id)

        break
      }

      default:
        return NextResponse.json({ error: `Ukjent event: ${event}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, event })
  } catch (err: any) {
    console.error('n8n webhook error:', err)
    return NextResponse.json({ error: err.message || 'Intern feil' }, { status: 500 })
  }
}
