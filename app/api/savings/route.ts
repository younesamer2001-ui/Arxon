import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Cost assumptions per automation type (NOK per month)
const SAVINGS_CONFIG = {
  phone: {
    costPerCallBefore: 17.5,  // NOK per manual call handling
    costPerCallAfter: 2.0,    // NOK per AI call
    avgCallsPerMonth: 500,
    timeSavedPerCall: 5,      // minutes
    label: 'Telefonhåndtering',
  },
  leads: {
    costPerLeadBefore: 85,
    costPerLeadAfter: 12,
    avgLeadsPerMonth: 120,
    timeSavedPerLead: 15,
    label: 'Lead-kvalifisering',
  },
  booking: {
    costPerBookingBefore: 45,
    costPerBookingAfter: 5,
    avgBookingsPerMonth: 80,
    timeSavedPerBooking: 10,
    label: 'Booking-automatisering',
  }
}

export async function GET(req: NextRequest) {
  try {
    const customerId = req.nextUrl.searchParams.get('customer_id')
    if (!customerId) {
      return NextResponse.json({ error: 'customer_id required' }, { status: 400 })
    }

    // Get customer order + integration status
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const { data: integrations } = await supabase
      .from('customer_integrations')
      .select('*')
      .eq('customer_id', customerId)
      .single()

    // Get AI activity logs if they exist
    const { data: activities } = await supabase
      .from('ai_activities')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(500)

    const orderDate = new Date(order.created_at)
    const now = new Date()
    const monthsActive = Math.max(1, Math.ceil(
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    ))

    // Determine which automations are active
    const activeAutomations: string[] = []
    if (integrations?.vapi_connected) activeAutomations.push('phone')
    if (integrations?.make_connected || integrations?.cal_connected) activeAutomations.push('leads')
    if (integrations?.cal_connected) activeAutomations.push('booking')

    // Calculate savings from real activities or estimates
    let totalMoneySaved = 0
    let totalTimeSavedMinutes = 0
    let totalCallsHandled = 0
    const categoryBreakdown: Array<{
      name: string
      amount: number
      percent: number
    }> = []

    if (activities && activities.length > 0) {
      // Use real activity data
      const phoneCalls = activities.filter(a => a.type === 'phone_call').length
      const leadsProcessed = activities.filter(a => a.type === 'lead_qualified').length
      const bookingsMade = activities.filter(a => a.type === 'booking_created').length

      const phoneSavings = phoneCalls * (SAVINGS_CONFIG.phone.costPerCallBefore - SAVINGS_CONFIG.phone.costPerCallAfter)
      const leadSavings = leadsProcessed * (SAVINGS_CONFIG.leads.costPerLeadBefore - SAVINGS_CONFIG.leads.costPerLeadAfter)
      const bookingSavings = bookingsMade * (SAVINGS_CONFIG.booking.costPerBookingBefore - SAVINGS_CONFIG.booking.costPerBookingAfter)

      totalMoneySaved = phoneSavings + leadSavings + bookingSavings
      totalTimeSavedMinutes = (phoneCalls * 5) + (leadsProcessed * 15) + (bookingsMade * 10)
      totalCallsHandled = phoneCalls + leadsProcessed + bookingsMade

      const total = totalMoneySaved || 1
      if (phoneSavings > 0) categoryBreakdown.push({ name: 'Telefonhåndtering', amount: Math.round(phoneSavings), percent: Math.round((phoneSavings / total) * 100) })
      if (leadSavings > 0) categoryBreakdown.push({ name: 'Lead-kvalifisering', amount: Math.round(leadSavings), percent: Math.round((leadSavings / total) * 100) })
      if (bookingSavings > 0) categoryBreakdown.push({ name: 'Booking-automatisering', amount: Math.round(bookingSavings), percent: Math.round((bookingSavings / total) * 100) })
    } else {
      // Estimate based on active automations and months
      for (const key of activeAutomations) {
        const config = SAVINGS_CONFIG[key as keyof typeof SAVINGS_CONFIG]
        const c = config as any
        const avgMonthly = key === 'phone'
          ? c.avgCallsPerMonth * (c.costPerCallBefore - c.costPerCallAfter)
          : key === 'leads'
            ? c.avgLeadsPerMonth * (c.costPerLeadBefore - c.costPerLeadAfter)
            : c.avgBookingsPerMonth * (c.costPerBookingBefore - c.costPerBookingAfter)

        const amount = Math.round(avgMonthly * monthsActive)
        totalMoneySaved += amount
        categoryBreakdown.push({ name: config.label, amount, percent: 0 })

        const volume = key === 'phone' ? c.avgCallsPerMonth
          : key === 'leads' ? c.avgLeadsPerMonth
          : c.avgBookingsPerMonth
        totalCallsHandled += volume * monthsActive
        totalTimeSavedMinutes += volume * monthsActive * c.timeSavedPerCall || c.timeSavedPerLead || c.timeSavedPerBooking || 5
      }

      // Calculate percentages
      const total = totalMoneySaved || 1
      categoryBreakdown.forEach(c => {
        c.percent = Math.round((c.amount / total) * 100)
      })
    }

    // Generate monthly data (last 6 months)
    const monthlyData = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthIdx = d.getMonth()
      const factor = Math.max(0.3, 1 - (i * 0.15)) + (Math.random() * 0.1)
      const monthlySaved = Math.round((totalMoneySaved / monthsActive) * factor)
      const monthlyCalls = Math.round((totalCallsHandled / monthsActive) * factor)

      monthlyData.push({
        month: monthNames[monthIdx],
        saved: monthlySaved,
        calls: monthlyCalls
      })
    }

    const timeSavedHours = Math.round(totalTimeSavedMinutes / 60)
    const investmentPerMonth = 2990 // Arxon subscription cost
    const totalInvestment = investmentPerMonth * monthsActive
    const roi = totalInvestment > 0 ? Math.round((totalMoneySaved / totalInvestment) * 100) : 0

    return NextResponse.json({
      totalMoneySaved: Math.round(totalMoneySaved),
      timeSavedHours,
      roi,
      totalCallsHandled,
      monthsActive,
      activeAutomations,
      categoryBreakdown,
      monthlyData,
      beforeAfter: [
        { label: 'Kostnad per samtale', before: '17,50 kr', after: '2,00 kr', savings: '89%' },
        { label: 'Tid per samtale', before: '5 min', after: '0 min', savings: '100%' },
        { label: 'Tapte anrop', before: '35%', after: '0%', savings: '100%' },
        { label: 'Responstid', before: '2-4 timer', after: 'Umiddelbart', savings: String.fromCharCode(8734) },
      ],
      isEstimate: !activities || activities.length === 0,
      orderDate: order.created_at,
    })
  } catch (error: any) {
    console.error('Savings API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
