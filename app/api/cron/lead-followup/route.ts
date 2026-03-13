import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { leadFollowupEmail } from '@/lib/email-templates'

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
  const supabase = createServerClient();
  // Security check
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Calculate time window: 24-48 hours ago
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

    // Query leads with status 'new' created 24-48 hours ago
    const { data: leads, error: queryError } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'new')
      .gte('created_at', fortyEightHoursAgo.toISOString())
      .lte('created_at', twentyFourHoursAgo.toISOString())

    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json(
        { error: 'Failed to query leads', details: queryError.message },
        { status: 500 }
      )
    }

    let successCount = 0
    let failureCount = 0
    const failedLeads = []

    // Process each lead
    for (const lead of leads || []) {
      const { subject, html } = leadFollowupEmail(lead as Lead)
      const emailResult = await sendEmail(lead.email, subject, html)

      if (emailResult.success) {
        // Update status to 'followed_up'
        const { error: updateError } = await supabase
          .from('leads')
          .update({ status: 'followed_up' })
          .eq('id', lead.id)

        if (updateError) {
          console.error(`Failed to update lead ${lead.id}:`, updateError)
          failureCount++
          failedLeads.push({
            id: lead.id,
            email: lead.email,
            reason: 'Failed to update status in database',
          })
        } else {
          successCount++
          console.log(`Successfully processed lead: ${lead.email}`)
        }
      } else {
        failureCount++
        failedLeads.push({
          id: lead.id,
          email: lead.email,
          reason: emailResult.error,
        })
        console.error(`Failed to send email to ${lead.email}:`, emailResult.error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead follow-up cron job completed',
      stats: {
        totalProcessed: (leads || []).length,
        successCount,
        failureCount,
      },
      failedLeads: failureCount > 0 ? failedLeads : undefined,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    )
  }
}
