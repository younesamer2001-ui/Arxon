import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      automations,       // Array of { name, setupPrice, monthlyPrice, complexity, industry }
      billingMode,       // 'monthly' | 'annual'
      setupTotal,        // number in NOK (not øre)
      monthlyTotal,      // number in NOK (not øre)
      discountRate,      // e.g. 0.05 for 5%
      customerEmail,     // optional pre-fill
      customerName,      // optional
      companyName,       // optional
      industry,          // e.g. "Bygg & Håndverk"
    } = body

    if (!automations || automations.length === 0) {
      return NextResponse.json(
        { error: 'Velg minst én automatisering' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arxon.no'

    // Build line items for Stripe Checkout
    // 1) Setup fee (one-time)
    // 2) Monthly subscription
    const lineItems: any[] = []

    // --- Setup fee as one-time price ---
    if (setupTotal > 0) {
      const setupDescription = automations
        .map((a: any) => a.name)
        .join(', ')

      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: 'Oppsett & implementering',
            description: `Skreddersydd oppsett: ${setupDescription}`,
          },
          unit_amount: Math.round(setupTotal * 100), // Convert to øre
        },
        quantity: 1,
      })
    }

    // --- Monthly subscription ---
    if (monthlyTotal > 0) {
      const monthlyDescription = automations
        .map((a: any) => `${a.name} (${a.monthlyPrice} kr/mnd)`)
        .join(', ')

      const isAnnual = billingMode === 'annual'
      const effectiveMonthly = isAnnual
        ? Math.round(monthlyTotal * 0.8) // 20% annual discount
        : monthlyTotal

      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: `Arxon AI – ${automations.length} automatisering${automations.length > 1 ? 'er' : ''}`,
            description: monthlyDescription,
          },
          unit_amount: Math.round(effectiveMonthly * 100), // Convert to øre
          recurring: {
            interval: isAnnual ? 'year' : 'month',
            ...(isAnnual ? {} : {}),
          },
        },
        quantity: 1,
      })
    }

    // Create order in Supabase first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_email: customerEmail || 'pending@arxon.no',
        customer_name: customerName || null,
        company_name: companyName || null,
        industry: industry || null,
        automations: automations,
        setup_total: Math.round(setupTotal * 100),
        monthly_total: Math.round(monthlyTotal * 100),
        billing_mode: billingMode || 'monthly',
        discount_rate: discountRate || 0,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Supabase order error:', orderError)
      // Continue even if Supabase fails — Stripe is more critical
    }

    // Create Stripe Checkout Session
    const sessionParams: any = {
      mode: 'subscription', // subscription mode handles both one-time and recurring
      line_items: lineItems,
      success_url: `${appUrl}/bestilling/bekreftelse?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pakkebygger?cancelled=true`,
      locale: 'nb' as any, // Norwegian
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_creation: 'always',
      metadata: {
        order_id: order?.id || '',
        industry: industry || '',
        automation_count: String(automations.length),
        billing_mode: billingMode || 'monthly',
      },
      subscription_data: {
        metadata: {
          order_id: order?.id || '',
          industry: industry || '',
        },
      },
    }

    // Pre-fill customer email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    const session = await getStripe().checkout.sessions.create(sessionParams)

    // Update order with checkout session ID
    if (order?.id) {
      await supabaseAdmin
        .from('orders')
        .update({
          stripe_checkout_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Noe gikk galt' },
      { status: 500 }
    )
  }
}
