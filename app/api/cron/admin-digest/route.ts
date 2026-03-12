import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { adminDigestEmail } from '@/lib/email-templates'

export const dynamic = 'force-dynamic'

interface Lead {
  id: string
  email: string
  contact_name: string
  company_name: string
  industry?: string
  company_size?: string
  budget?: string
  timeline?: string
  recommended_tier?: string
  roi_data?: Record<string, any>
  ai_summary?: Record<string, any>
  language: 'no' | 'en'
  created_at: string
  ref_number?: string
  all_answers?: Record<string, any>
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Arxon AI <noreply@arxon.no>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function GET(request: NextRequest) {
  // Security check
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured')
      return NextResponse.json(
        { error: 'ADMIN_EMAIL not configured' },
        { status: 500 }
      )
    }

    // Calculate time window: last 24 hours
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Query all leads from the last 24 hours
    const { data: leads, error: queryError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })

    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json(
        { error: 'Failed to query leads', details: queryError.message },
        { status: 500 }
      )
    }

    // Calculate stats
    const leadsList = (leads || []) as Lead[]
    const completed = leadsList.filter((lead) => lead.all_answers !== null).length
    const incomplete = leadsList.length - completed

    // Generate email
    const { subject, html } = adminDigestEmail(leadsList, {
      total: leadsList.length,
      completed,
      incomplete,
    })

    // Send email to admin
    const emailResult = await sendEmail(adminEmail, subject, html)

    if (!emailResult.success) {
      console.error('Failed to send admin digest:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send admin digest', details: emailResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin digest cron job completed',
      stats: {
        totalLeads: leadsList.length,
        completed,
        incomplete,
        emailSent: true,
        sentTo: adminEmail,
      },
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    )
  }
}
