import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// GET: Fetch integrations for an order
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')
    const email = searchParams.get('email')

    if (!orderId && !email) {
      return NextResponse.json({ error: 'order_id or email required' }, { status: 400 })
    }

    let query = supabaseAdmin.from('customer_integrations').select('*')
    if (orderId) query = query.eq('order_id', orderId)
    if (email) query = query.eq('customer_email', email)

    const { data, error } = await query.order('created_at', { ascending: true })
    if (error) throw error

    // Mask credentials in response (only show last 4 chars)
    const masked = data?.map(row => ({
      ...row,
      credentials: Object.fromEntries(
        Object.entries(row.credentials as Record<string, string>).map(([key, val]) => [
          key,
          val ? `${'\u2022'.repeat(Math.max(0, val.length - 4))}${val.slice(-4)}` : ''
        ])
      )
    }))

    return NextResponse.json({ integrations: masked })
  } catch (err: any) {
    console.error('GET /api/integrations error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Save/update integration credentials
export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  try {
    const body = await request.json()
    const { order_id, customer_email, service, credentials } = body

    if (!order_id || !customer_email || !service || !credentials) {
      return NextResponse.json(
        { error: 'order_id, customer_email, service, and credentials are required' },
        { status: 400 }
      )
    }

    // Validate order exists
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Upsert integration (insert or update if exists)
    const { data, error } = await supabaseAdmin
      .from('customer_integrations')
      .upsert(
        {
          order_id,
          customer_email,
          service,
          credentials,
          status: 'connected',
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'order_id,service' }
      )
      .select()
      .single()

    if (error) throw error

    // After saving, check if any workflows now have all integrations connected
    await updateWorkflowStatuses(order_id, customer_email)

    return NextResponse.json({
      integration: data,
      message: 'Integration saved successfully'
    })
  } catch (err: any) {
    console.error('POST /api/integrations error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Disconnect an integration
export async function DELETE(request: NextRequest) {
  const supabase = createServerClient();
  try {
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get('id')
    const orderId = searchParams.get('order_id')

    if (!integrationId) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('customer_integrations')
      .update({
        status: 'pending',
        credentials: {},
        connected_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', integrationId)

    if (error) throw error

    // Update workflow statuses
    if (orderId) await updateWorkflowStatuses(orderId)

    return NextResponse.json({ message: 'Integration disconnected' })
  } catch (err: any) {
    console.error('DELETE /api/integrations error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Helper: Trigger n8n workflow deployment
async function triggerN8nDeploy(orderId: string, customerEmail: string, automationKey: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/n8n/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderId,
        customer_email: customerEmail,
        automation_key: automationKey,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error('n8n deploy failed:', result.error)
      // Update workflow with error
      await supabaseAdmin
        .from('customer_workflows')
        .update({
          workflow_status: 'deploy_failed',
          health_status: 'error',
          error_message: result.error || 'Deployment feilet',
        })
        .eq('order_id', orderId)
        .eq('automation_key', automationKey)
      return false
    }

    console.log('n8n workflow deployed:', result.workflow?.name)

    // Create notification for successful deployment
    await supabaseAdmin.from('notifications').insert({
      order_id: orderId,
      customer_email: customerEmail,
      type: 'workflow_deployed',
      title: 'Arbeidsflyt aktivert!',
      message: `Arbeidsflyten "${result.workflow?.name}" er nå aktiv og kjører automatisk.`,
      metadata: {
        workflow_id: result.workflow?.id,
        workflow_url: result.workflow?.url,
      },
    })

    return true
  } catch (err) {
    console.error('triggerN8nDeploy error:', err)
    return false
  }
}

// Helper: Update workflow statuses based on connected integrations
async function updateWorkflowStatuses(orderId: string, customerEmail?: string) {
  try {
    // Get all connected integrations for this order
    const { data: integrations } = await supabaseAdmin
      .from('customer_integrations')
      .select('service, status')
      .eq('order_id', orderId)
      .eq('status', 'connected')

    const connectedServices = integrations?.map(i => i.service) || []

    // Get all workflows for this order
    const { data: workflows } = await supabaseAdmin
      .from('customer_workflows')
      .select('id, automation_name, automation_key, required_integrations, workflow_status')
      .eq('order_id', orderId)

    if (!workflows) return

    // Get order details for notification
    const { data: orderData } = await supabaseAdmin
      .from('orders')
      .select('customer_email, customer_name')
      .eq('id', orderId)
      .single()

    const email = customerEmail || orderData?.customer_email

    // Update each workflow's connected_integrations and status
    for (const wf of workflows) {
      const required = (wf.required_integrations as string[]) || []
      const connected = required.filter(svc => connectedServices.includes(svc))
      const allConnected = required.length > 0 && required.every(svc => connectedServices.includes(svc))

      let newStatus = wf.workflow_status

      if (allConnected && ['pending_setup', 'awaiting_integrations'].includes(wf.workflow_status)) {
        newStatus = 'deploying'

        // Create notification when all integrations connected
        if (email) {
          await supabaseAdmin.from('notifications').insert({
            order_id: orderId,
            customer_email: email,
            type: 'all_integrations_connected',
            title: 'Alle integrasjoner er koblet til!',
            message: `Alle integrasjoner for ${wf.automation_name || 'automatiseringen'} er koblet til. Starter automatisk oppsett av arbeidsflyt...`,
            metadata: { workflow_id: wf.id, automation_name: wf.automation_name }
          })
        }

        // Auto-deploy to n8n
        if (email && wf.automation_key) {
          // Don't await — let it run in background
          triggerN8nDeploy(orderId, email, wf.automation_key)
        }
      } else if (!allConnected && ['ready', 'deploying'].includes(wf.workflow_status)) {
        newStatus = 'awaiting_integrations'
      }

      await supabaseAdmin
        .from('customer_workflows')
        .update({
          connected_integrations: connected,
          workflow_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wf.id)
    }
  } catch (err) {
    console.error('updateWorkflowStatuses error:', err)
  }
}
