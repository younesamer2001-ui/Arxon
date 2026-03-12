import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Hent alle stats på én gang
    const [
      customersRes,
      ordersRes,
      workflowsRes,
      onboardingRes,
      activitiesRes
    ] = await Promise.all([
      // Totalt antall kunder
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      
      // Ordrer og omsetning
      supabase.from('orders').select('setup_total, monthly_total, status'),
      
      // Workflows status
      supabase.from('customer_workflows').select('workflow_status, health_status'),
      
      // Onboarding status
      supabase.from('onboarding_tracking').select('step_key, status'),
      
      // AI Activities (samtaler)
      supabase.from('ai_activities').select('duration_seconds, cost_saved')
    ])

    // Kalkuler omsetning
    const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + (o.setup_total || 0), 0) || 0
    const monthlyRecurring = ordersRes.data?.reduce((sum, o) => sum + (o.monthly_total || 0), 0) || 0
    
    // Tell workflow status
    const activeWorkflows = workflowsRes.data?.filter(w => w.workflow_status === 'active').length || 0
    const failedWorkflows = workflowsRes.data?.filter(w => w.health_status === 'error').length || 0
    
    // Onboarding pipeline
    const onboardingPending = onboardingRes.data?.filter(o => o.status === 'pending').length || 0
    const onboardingInProgress = onboardingRes.data?.filter(o => o.status === 'in_progress').length || 0
    const onboardingCompleted = onboardingRes.data?.filter(o => o.status === 'completed').length || 0
    
    // Samtale stats
    const totalCalls = activitiesRes.data?.length || 0
    const totalDuration = activitiesRes.data?.reduce((sum, a) => sum + (a.duration_seconds || 0), 0) || 0
    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0
    const totalSaved = activitiesRes.data?.reduce((sum, a) => sum + (a.cost_saved || 0), 0) || 0

    return NextResponse.json({
      success: true,
      stats: {
        // Kunder
        total_customers: customersRes.count || 0,
        
        // Økonomi (i NOK)
        total_revenue_nok: Math.round(totalRevenue / 100),
        monthly_recurring_nok: Math.round(monthlyRecurring / 100),
        total_cost_saved_nok: Math.round(totalSaved),
        
        // Workflows
        total_workflows: workflowsRes.data?.length || 0,
        active_workflows: activeWorkflows,
        failed_workflows: failedWorkflows,
        
        // Onboarding
        onboarding_pending: onboardingPending,
        onboarding_in_progress: onboardingInProgress,
        onboarding_completed: onboardingCompleted,
        
        // Samtaler
        total_calls: totalCalls,
        total_duration_seconds: totalDuration,
        avg_call_duration_seconds: avgDuration,
        
        // Ordrer
        total_orders: ordersRes.data?.length || 0,
        pending_orders: ordersRes.data?.filter(o => o.status === 'pending').length || 0,
        active_orders: ordersRes.data?.filter(o => o.status === 'active').length || 0,
      }
    })
  } catch (err) {
    console.error('Stats API error:', err)
    return NextResponse.json({ 
      success: false,
      error: 'Intern serverfeil',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
