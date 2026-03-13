import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'



export async function GET(request: Request) {
  const supabase = createServerClient();
  try {
    const { searchParams } = new URL(request.url)
    const customer_id = searchParams.get('customer_id')
    const status = searchParams.get('status')
    
    let query = supabase
      .from('onboarding_tracking')
      .select(`
        *,
        customers:customer_id (company_name, email),
        orders:order_id (setup_total, monthly_total)
      `)
      .order('created_at', { ascending: false })
    
    if (customer_id) {
      query = query.eq('customer_id', customer_id)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: tracking, error } = await query
    
    if (error) {
      console.error('Onboarding fetch error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // Finn "stuck" customers (pending i mer enn 24 timer)
    const stuckThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const stuckCustomers = tracking?.filter(t => 
      t.status === 'pending' && t.created_at < stuckThreshold
    ) || []

    // Grupper etter steg
    const byStep = tracking?.reduce((acc, item) => {
      acc[item.step_key] = (acc[item.step_key] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return NextResponse.json({
      success: true,
      onboarding: tracking || [],
      stuck_customers: stuckCustomers,
      summary: {
        total: tracking?.length || 0,
        pending: tracking?.filter(t => t.status === 'pending').length || 0,
        in_progress: tracking?.filter(t => t.status === 'in_progress').length || 0,
        completed: tracking?.filter(t => t.status === 'completed').length || 0,
        error: tracking?.filter(t => t.status === 'error').length || 0,
        by_step: byStep
      }
    })
  } catch (err) {
    console.error('Onboarding API error:', err)
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
    const { id, status, completed_at, metadata } = body
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mangler tracking ID' 
      }, { status: 400 })
    }
    
    const updates: any = {}
    if (status) updates.status = status
    if (completed_at) updates.completed_at = completed_at
    if (metadata) updates.metadata = metadata
    if (status === 'in_progress' && !updates.started_at) {
      updates.started_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('onboarding_tracking')
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
      tracking: data
    })
  } catch (err) {
    return NextResponse.json({ 
      success: false,
      error: 'Intern serverfeil'
    }, { status: 500 })
  }
}
