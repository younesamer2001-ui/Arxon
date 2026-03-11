import { supabase } from './supabase'

// ---- Customer ----
export async function getCustomer() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .single()
  return data
}

export async function updateCustomer(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('customers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ---- Calls ----
export async function getCalls(customerId: string, opts?: { limit?: number, status?: string }) {
  let query = supabase
    .from('calls')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (opts?.status && opts.status !== 'all') {
    query = query.eq('status', opts.status)
  }
  if (opts?.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query
  return { data: data || [], error }
}

export async function getCallStats(customerId: string, days = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data } = await supabase
    .from('calls')
    .select('status, duration_seconds, created_at')
    .eq('customer_id', customerId)
    .gte('created_at', since.toISOString())

  const calls = data || []
  const answered = calls.filter(c => c.status === 'answered')
  const missed = calls.filter(c => c.status === 'missed')
  const totalDuration = answered.reduce((sum, c) => sum + (c.duration_seconds || 0), 0)
  const avgDuration = answered.length > 0 ? totalDuration / answered.length : 0

  return {
    total: calls.length,
    answered: answered.length,
    missed: missed.length,
    avgDurationSeconds: Math.round(avgDuration),
    answerRate: calls.length > 0 ? Math.round((answered.length / calls.length) * 100) : 0,
  }
}

// ---- Leads ----
export async function getLeads(customerId: string, opts?: { status?: string }) {
  let query = supabase
    .from('leads')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (opts?.status && opts.status !== 'all') {
    query = query.eq('status', opts.status)
  }

  const { data, error } = await query
  return { data: data || [], error }
}

// ---- Bookings ----
export async function getBookings(customerId: string, opts?: { type?: string }) {
  let query = supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('meeting_date', { ascending: true })

  if (opts?.type && opts.type !== 'all') {
    query = query.eq('booking_type', opts.type)
  }

  const { data, error } = await query
  return { data: data || [], error }
}

// ---- Automations ----
export async function getAutomations(customerId: string) {
  const { data, error } = await supabase
    .from('automations')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  return { data: data || [], error }
}

// ---- Customer Automations (Phase 1) ----
export async function getCustomerAutomations(customerId: string) {
  const { data, error } = await supabase
    .from('customer_automations')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  return { data: data || [], error }
}

export async function getOnboardingSteps(customerId: string) {
  const { data, error } = await supabase
    .from('onboarding_tracking')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  return { data: data || [], error }
}

export async function submitIntakeForm(answers: Record<string, any>, integrations?: string[], notes?: string) {
  const res = await fetch('/api/onboarding/intake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, integrations, notes }),
  })
  return res.json()
}

// ---- Recent Activity (combines calls, leads, bookings) ----
export async function getRecentActivity(customerId: string, limit = 10) {
  const [callsRes, leadsRes, bookingsRes] = await Promise.all([
    supabase.from('calls').select('id, caller_name, caller_number, status, created_at').eq('customer_id', customerId).order('created_at', { ascending: false }).limit(limit),
    supabase.from('leads').select('id, name, company, status, created_at').eq('customer_id', customerId).order('created_at', { ascending: false }).limit(limit),
    supabase.from('bookings').select('id, client_name, booking_type, meeting_date, start_time, created_at').eq('customer_id', customerId).order('created_at', { ascending: false }).limit(limit),
  ])

  const activity = [
    ...(callsRes.data || []).map(c => ({
      type: 'call' as const,
      text: `${c.status === 'missed' ? 'Ubesvart' : 'Innkommende'} anrop fra ${c.caller_name || c.caller_number}`,
      status: c.status === 'missed' ? 'missed' : 'answered',
      time: c.created_at,
    })),
    ...(leadsRes.data || []).map(l => ({
      type: 'lead' as const,
      text: `Ny lead: ${l.name}${l.company ? ` (${l.company})` : ''}`,
      status: l.status === 'hot' ? 'qualified' : 'new',
      time: l.created_at,
    })),
    ...(bookingsRes.data || []).map(b => ({
      type: 'booking' as const,
      text: `Møte booket: ${b.client_name} — ${b.meeting_date}`,
      status: 'confirmed',
      time: b.created_at,
    })),
  ]

  activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  return activity.slice(0, limit)
}
