import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cost assumptions matching SAVINGS_CONFIG
const COST_PER_CALL_BEFORE = 17.5; // NOK manual
const COST_PER_CALL_AFTER = 2.0;   // NOK AI
const COST_SAVED_PER_CALL = COST_PER_CALL_BEFORE - COST_PER_CALL_AFTER;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      phone = '',
      duration_seconds = 0,
      summary = '',
      name = '',
      company = '',
      interest = 'Ukjent',
      type = 'phone_call',
      customer_email = '',
      notater = '',
      oppfolging = '',
    } = body;

    // Determine the email to use
    let finalEmail = customer_email;
    let customerId: string | null = null;

    // If customer_email provided, try to find matching order
    if (finalEmail) {
      const { data: order } = await supabase
        .from('orders')
        .select('id, customer_email')
        .eq('customer_email', finalEmail)
        .limit(1)
        .single();

      if (order) {
        customerId = order.id;
        finalEmail = order.customer_email;
      }
    }

    // Fallback: try to find by phone number in metadata
    if (!customerId && phone) {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_email')
        .order('created_at', { ascending: false })
        .limit(10);

      // For now, if we have orders, use the most recent one
      // In production, you'd match by phone number in a customers table
      if (orders && orders.length > 0) {
        const matchedOrder = orders[0];
        customerId = matchedOrder.id;
        if (!finalEmail) finalEmail = matchedOrder.customer_email;
      }
    }

    // Final fallback for email
    if (!finalEmail) {
      finalEmail = phone || 'system@arxon.no';
    }

    // Calculate cost saved based on type
    let costSaved = COST_SAVED_PER_CALL;
    if (type === 'lead_qualified') costSaved = 85 - 12; // 73 NOK
    if (type === 'booking_created') costSaved = 45 - 5; // 40 NOK

    // Insert into ai_activities
    const { data, error } = await supabase
      .from('ai_activities')
      .insert({
        customer_id: customerId,
        customer_email: finalEmail,
        type,
        duration_seconds: Math.round(duration_seconds),
        cost_saved: costSaved,
        metadata: {
          phone,
          name,
          company,
          summary,
          interest,
          notater,
          oppfolging,
          source: 'n8n_vapi_webhook',
          logged_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to log activity:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      activity_id: data.id,
      customer_email: finalEmail,
      cost_saved: costSaved,
    });
  } catch (err: unknown) {
    console.error('Activity log error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
