import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Fetch workflows for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')
    const email = searchParams.get('email')

    if (!orderId && !email) {
      return NextResponse.json({ error: 'order_id or email required' }, { status: 400 })
    }

    let query = supabaseAdmin.from('customer_workflows').select('*')
    if (orderId) query = query.eq('order_id', orderId)
    if (email) query = query.eq('customer_email', email)

    const { data, error } = await query.order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ workflows: data })
  } catch (err: any) {
    console.error('GET /api/workflows error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Initialize workflows for an order (called after payment or manually)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json({ error: 'order_id required' }, { status: 400 })
    }

    // Fetch the order with automations
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const automations = (order.automations as any[]) || []

    if (automations.length === 0) {
      return NextResponse.json({ error: 'No automations found in order' }, { status: 400 })
    }

    // Import the automation-to-integrations mapping
    // We'll use a server-side version of this mapping
    const automationToIntegrations: Record<string, string[]> = {
      'fakturering': ['vipps', 'tripletex', 'fiken', 'sendgrid'],
      'booking': ['google_calendar', 'outlook', 'sendgrid', 'twilio'],
      'salongbooking': ['timely', 'fixit', 'sendgrid', 'twilio'],
      'kundeoppfølging': ['tripletex', 'fiken', 'mailchimp', 'hubspot'],
      'leadgenerering': ['hubspot', 'mailchimp', 'klaviyo'],
      'channel-manager': ['booking_com', 'airbnb', 'visbook'],
      'sosialmedie-publisering': ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'],
      'sosialmedie-analyse': ['facebook', 'instagram', 'twitter', 'linkedin'],
      'epost-markedsføring': ['mailchimp', 'hubspot', 'klaviyo', 'sendgrid'],
      'kundeservice-chat': ['twilio', 'slack', 'teams'],
      'prosjektstyring': ['asana', 'monday', 'notion', 'slack'],
      'dokumenthåndtering': ['notion', 'google_calendar', 'slack'],
      'rapportering': ['tripletex', 'fiken', 'google_maps'],
      'google-anmeldelser': ['google_business', 'sendgrid', 'twilio'],
      'eiendomssynkronisering': ['finn_eiendom', 'vitec_next', 'signicat'],
      'bilannonsering': ['finn_bil', 'autodata', 'infomedia'],
      'verkstedbestilling': ['autodata', 'twilio', 'sendgrid'],
      'lagerstyring': ['tripletex', 'fiken'],
      'lønn-og-timer': ['tripletex', 'fiken'],
      'tilbudsgenerator': ['tripletex', 'fiken', 'sendgrid'],
      'byggeprosjekt-oppfølging': ['bygglet', 'fonn', 'slack'],
      'kvalitetskontroll': ['bygglet', 'fonn', 'notion'],
      'gjestekommunikasjon': ['booking_com', 'airbnb', 'sendgrid', 'twilio'],
      'prisstyring': ['booking_com', 'airbnb', 'visbook'],
      'anmeldelseshåndtering': ['tripadvisor', 'google_business', 'booking_com'],
    }

    // Create workflow records for each purchased automation
    const workflowRecords = automations.map((auto: any) => {
      const autoName = typeof auto === 'string' ? auto : auto.name || auto.id || ''
      const normalizedName = autoName.toLowerCase().trim()
      const requiredIntegrations = automationToIntegrations[normalizedName] || []

      return {
        order_id: order.id,
        customer_email: order.customer_email,
        automation_name: autoName,
        workflow_status: 'awaiting_integrations',
        required_integrations: requiredIntegrations,
        connected_integrations: [],
        health_status: 'inactive',
      }
    })

    // Also create placeholder integration records for all required services
    const allRequiredServices = new Set<string>()
    workflowRecords.forEach(wf => {
      ;(wf.required_integrations as string[]).forEach(svc => allRequiredServices.add(svc))
    })

    // Upsert workflows (don't duplicate if already exist)
    const { data: workflows, error: wfError } = await supabaseAdmin
      .from('customer_workflows')
      .upsert(workflowRecords, { onConflict: 'order_id,automation_name' })
      .select()

    if (wfError) throw wfError

    // Create placeholder integration entries for services that don't exist yet
    const integrationRecords = Array.from(allRequiredServices).map(service => ({
      order_id: order.id,
      customer_email: order.customer_email,
      service,
      credentials: {},
      status: 'pending',
    }))

    // Use upsert to avoid duplicates
    const { error: intError } = await supabaseAdmin
      .from('customer_integrations')
      .upsert(integrationRecords, { onConflict: 'order_id,service', ignoreDuplicates: true })

    if (intError) {
      console.error('Integration placeholder creation error:', intError)
      // Non-fatal — workflows were still created
    }

    return NextResponse.json({
      message: `Created ${workflows?.length || 0} workflows and ${integrationRecords.length} integration placeholders`,
      workflows,
    })
  } catch (err: any) {
    console.error('POST /api/workflows error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
