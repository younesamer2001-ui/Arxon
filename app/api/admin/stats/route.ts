import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch all counts in parallel
    const [customersRes, callsRes, leadsRes, bookingsRes, workflowsRes] = await Promise.all([
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('calls').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('customer_workflows').select('id', { count: 'exact', head: true }),
    ])

    // Per-customer activity counts
    const [callsByCustomer, leadsByCustomer, bookingsByCustomer, workflowsByCustomer] = await Promise.all([
      supabase.from('calls').select('customer_id'),
      supabase.from('leads').select('customer_id'),
      supabase.from('bookings').select('customer_id'),
      supabase.from('customer_workflows').select('customer_id'),
    ])

    const countByCustomer = (rows: any[] | null) => {
      const map: Record<string, number> = {}
      for (const r of rows || []) {
        map[r.customer_id] = (map[r.customer_id] || 0) + 1
      }
      return map
    }

    return NextResponse.json({
      global: {
        total_customers: customersRes.count || 0,
        total_calls: callsRes.count || 0,
        total_leads: leadsRes.count || 0,
        total_bookings: bookingsRes.count || 0,
        total_workflows: workflowsRes.count || 0,
      },
      per_customer: {
        calls: countByCustomer(callsByCustomer.data),
        leads: countByCustomer(leadsByCustomer.data),
        bookings: countByCustomer(bookingsByCustomer.data),
        workflows: countByCustomer(workflowsByCustomer.data),
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}
