import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { incompleteReminderEmail } from '@/lib/email-templates'

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

    // Calculate time window: 4-48 hours ago
    const now = new Date()
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000)
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

    // Query leads where:
    // - status = 'new'
    // - all_answers IS NULL (didn't complete full kartlegging)
    // - email IS NOT NULL
    // - created_at between 4 and 48 hours ago
    // - reminder_sent IS NULL or FALSE
    const { data: leads, error: queryError } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'new')
      .is('all_answers', null)
      .not('email', 'is', null)
      .gte('created_at', fortyEightHoursAgo.toISOString())
      .lte('created_at', fourHoursAgo.toISOString())
      .or('reminder_sent.is.null,reminder_sent.eq.false')

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
      const { subject, html } = incompleteReminderEmail(lead as Lead)
      const emailResult = await sendEmail(lead.email, subject, html)

      if (emailResult.success) {
        // Update reminder_sent flag
        const { error: updateError } = await supabase
          .from('leads')
          .update({ reminder_sent: true })
          .eq('id', lead.id)

        if (updateError) {
          console.error(`Failed to update lead ${lead.id}:`, updateError)
          failureCount++
          failedLeads.push({
            id: lead.id,
            email: lead.email,
            reason: 'Failed to update reminder flag in database',
          })
        } else {
          successCount++
          console.log(`Successfully sent reminder to: ${lead.email}`)
        }
      } else {
        failureCount++
        failedLeads.push({
          id: lead.id,
          email: lead.email,
          reason: emailResult.error,
        })
        console.error(`Failed to send reminder to ${lead.email}:`, emailResult.error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Incomplete reminder cron job completed',
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
