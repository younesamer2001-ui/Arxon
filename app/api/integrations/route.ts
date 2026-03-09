import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Fetch integrations for an order
export async function GET(request: NextRequest) {
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
    await updateWorkflowStatuses(order_id)

    return NextResponse.json({ integration: data, message: 'Integration saved successfully' })
  } catch (err: any) {
    console.error('POST /api/integrations error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Disconnect an integration
export async function DELETE(request: NextRequest) {
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

// Helper: Update workflow statuses based on connected integrations
async function updateWorkflowStatuses(orderId: string) {
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
      .select('id, required_integrations, workflow_status')
      .eq('order_id', orderId)

    if (!workflows) return

    // Update each workflow's connected_integrations and status
    for (const wf of workflows) {
      const required = (wf.required_integrations as string[]) || []
      const connected = required.filter(svc => connectedServices.includes(svc))
      const allConnected = required.length > 0 && required.every(svc => connectedServices.includes(svc))

      let newStatus = wf.workflow_status
      if (allConnected && ['pending_setup', 'awaiting_integrations'].includes(wf.workflow_status)) {
        newStatus = 'ready'
      } else if (!allConnected && wf.workflow_status === 'ready') {
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
