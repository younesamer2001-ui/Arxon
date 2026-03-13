import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'



export async function GET(request: Request) {
  const supabase = createServerClient();
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (company_name, contact_name, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: orders, error } = await query
    
    if (error) {
      console.error('Orders fetch error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // For hver ordre, hent onboarding status
    const ordersWithOnboarding = await Promise.all(
      orders.map(async (order) => {
        const { data: onboarding } = await supabase
          .from('onboarding_tracking')
          .select('step_key, status, completed_at')
          .eq('order_id', order.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        
        const { data: automations } = await supabase
          .from('customer_automations')
          .select('automation_name, status')
          .eq('order_id', order.id)
        
        return {
          ...order,
          onboarding_step: onboarding?.step_key || 'none',
          onboarding_status: onboarding?.status || 'unknown',
          automations: automations || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      orders: ordersWithOnboarding,
      count: ordersWithOnboarding.length
    })
  } catch (err) {
    console.error('Orders API error:', err)
    return NextResponse.json({ 
      success: false,
      error: 'Intern serverfeil',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = createServerClient();
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mangler order ID' 
      }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      order: data
    })
  } catch (err) {
    return NextResponse.json({ 
      success: false,
      error: 'Intern serverfeil'
    }, { status: 500 })
  }
}
