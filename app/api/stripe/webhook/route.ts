import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'
import Stripe from 'stripe'

// Disable body parsing â Stripe needs raw body for signature verification
export const runtime = 'nodejs'

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const reader = req.body?.getReader()
  if (!reader) throw new Error('No body')
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks)
}

/* ------------------------------------------------------------------ */
/*  Initialize workflows for a paid order                             */
/* ------------------------------------------------------------------ */
const automationToIntegrations: Record<string, string[]> = {
  'fakturering': ['vipps', 'tripletex', 'fiken', 'sendgrid'],
  'booking': ['google_calendar', 'outlook', 'sendgrid', 'twilio'],
  'salongbooking': ['timely', 'fixit', 'sendgrid', 'twilio'],
  'kundeoppfÃ¸lging': ['tripletex', 'fiken', 'mailchimp', 'hubspot'],
  'leadgenerering': ['hubspot', 'mailchimp', 'klaviyo'],
  'channel-manager': ['booking_com', 'airbnb', 'visbook'],
  'sosialmedie-publisering': ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'],
  'sosialmedie-analyse': ['facebook', 'instagram', 'twitter', 'linkedin'],
  'epost-markedsfÃ¸ring': ['mailchimp', 'hubspot', 'klaviyo', 'sendgrid'],
  'kundeservice-chat': ['twilio', 'slack', 'teams'],
  'prosjektstyring': ['asana', 'monday', 'notion', 'slack'],
  'dokumenthÃ¥ndtering': ['notion', 'google_calendar', 'slack'],
  'rapportering': ['tripletex', 'fiken', 'google_maps'],
  'google-anmeldelser': ['google_business', 'sendgrid', 'twilio'],
  'eiendomssynkronisering': ['finn_eiendom', 'vitec_next', 'signicat'],
  'bilannonsering': ['finn_bil', 'autodata', 'infomedia'],
  'verkstedbestilling': ['autodata', 'twilio', 'sendgrid'],
  'lagerstyring': ['tripletex', 'fiken'],
  'lÃ¸nn-og-timer': ['tripletex', 'fiken'],
  'tilbudsgenerator': ['tripletex', 'fiken', 'sendgrid'],
  'byggeprosjekt-oppfÃ¸lging': ['bygglet', 'fonn', 'slack'],
  'kvalitetskontroll': ['bygglet', 'fonn', 'notion'],
  'gjestekommunikasjon': ['booking_com', 'airbnb', 'sendgrid', 'twilio'],
  'prisstyring': ['booking_com', 'airbnb', 'visbook'],
  'anmeldelseshÃ¥ndtering': ['tripadvisor', 'google_business', 'booking_com'],
}

async function initializeWorkflows(orderId: string, customerEmail: string) {
  try {
    // Fetch order to get automations
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('automations')
      .eq('id', orderId)
      .single()

    if (orderError || !order?.automations) {
      console.error('Failed to fetch order automations:', orderError)
      return
    }

    const automations = order.automations as Array<{ key: string; name: string }>

    // Create workflow + integration records for each automation
    for (const automation of automations) {
      const requiredIntegrations = automationToIntegrations[automation.key] || []

      // Create workflow record
      await supabaseAdmin
        .from('customer_workflows')
        .upsert({
          order_id: orderId,
          customer_email: customerEmail,
          automation_name: automation.name,
          automation_key: automation.key,
          workflow_status: 'pending_setup',
          health_status: 'inactive',
          required_integrations: requiredIntegrations,
          connected_integrations: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'order_id,automation_key' })

      // Create placeholder integration records
      for (const service of requiredIntegrations) {
        await supabaseAdmin
          .from('customer_integrations')
          .upsert({
            order_id: orderId,
            customer_email: customerEmail,
            service,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'order_id,service' })
      }
    }

    console.log(`Initialized ${automations.length} workflows for order ${orderId}`)
  } catch (err) {
    console.error('Failed to initialize workflows:', err)
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    const rawBody = await getRawBody(req)
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Log the event
  try {
    await supabaseAdmin.from('payment_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event.data.object as any,
    })
  } catch (err) {
    console.error('Failed to log event:', err)
  }

  try {
    switch (event.type) {
      // Checkout completed â setup fee paid, subscription started
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id

        if (orderId) {
          const customerEmail = session.customer_details?.email || ''

          await supabaseAdmin
            .from('orders')
            .update({
              stripe_checkout_session_id: session.id,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              customer_email: customerEmail || undefined,
              customer_name: session.customer_details?.name || undefined,
              status: 'setup_paid',
              setup_paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)

          // Update payment_events with order_id
          await supabaseAdmin
            .from('payment_events')
            .update({ order_id: orderId })
            .eq('stripe_event_id', event.id)

          // Auto-initialize workflows for this order
          if (customerEmail) {
            await initializeWorkflows(orderId, customerEmail)
          }
        }
        break
      }

      // Subscription becomes active (after first payment succeeds)
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const orderId = subscription.metadata?.order_id

        if (orderId) {
          const statusMap: Record<string, string> = {
            active: 'active',
            past_due: 'past_due',
            canceled: 'cancelled',
            unpaid: 'past_due',
            trialing: 'active',
          }

          await supabaseAdmin
            .from('orders')
            .update({
              stripe_subscription_id: subscription.id,
              status: statusMap[subscription.status] || 'active',
              subscription_started_at:
                subscription.status === 'active'
                  ? new Date(subscription.start_date * 1000).toISOString()
                  : undefined,
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
        }
        break
      }

      // Subscription cancelled
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const orderId = subscription.metadata?.order_id

        if (orderId) {
          await supabaseAdmin
            .from('orders')
            .update({
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
        }
        break
      }

      // Invoice payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string

        if (subscriptionId) {
          await supabaseAdmin
            .from('orders')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      default:
        // Unhandled event type â just log it
        break
    }
  } catch (err: any) {
    console.error(`Webhook handler error for ${event.type}:`, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
