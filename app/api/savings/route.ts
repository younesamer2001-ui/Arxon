import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customer_id')
    if (!customerId) {
      return NextResponse.json({ error: 'customer_id required' }, { status: 400 })
    }

    const { data: order } = await supabase
      .from('orders').select('*').eq('id', customerId).single()

    if (!order) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const { data: activities } = await supabase
      .from('ai_activities').select('*').eq('customer_id', customerId)
      .order('created_at', { ascending: false }).limit(100)

    const allActivities = activities || []
    const totalCalls = allActivities.filter((a: any) => a.type === 'phone_call').length
    const totalLeads = allActivities.filter((a: any) => a.type === 'lead_qualified').length
    const totalBookings = allActivities.filter((a: any) => a.type === 'booking_created').length

    const totalDurationSeconds = allActivities.reduce(
      (sum: number, a: any) => sum + (a.duration_seconds || 0), 0
    )

    const recentActivities = allActivities.slice(0, 20).map((a: any) => ({
      id: a.id,
      type: a.type,
      duration_seconds: a.duration_seconds || 0,
      created_at: a.created_at,
      summary: a.metadata?.summary || null,
      name: a.metadata?.name || null,
      phone: a.metadata?.phone || null,
    }))

    return NextResponse.json({
      totalCalls,
      totalLeads,
      totalBookings,
      totalActivities: allActivities.length,
      totalDurationSeconds,
      avgDurationSeconds: totalCalls > 0 ? Math.round(totalDurationSeconds / totalCalls) : 0,
      customerSince: order.created_at,
      customerName: order.customer_name || order.customer_email,
      recentActivities,
    })
  } catch (error: any) {
    console.error('Activity API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
