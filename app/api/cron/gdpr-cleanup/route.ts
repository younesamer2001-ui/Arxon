import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { gdprCleanupEmail } from '@/lib/email-templates'

export const dynamic = 'force-dynamic'

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
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured')
      return NextResponse.json(
        { error: 'ADMIN_EMAIL not configured' },
        { status: 500 }
      )
    }

    // Calculate cutoff date: 12 months ago
    const now = new Date()
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

    console.log(`GDPR Cleanup: Deleting leads older than ${twelveMonthsAgo.toISOString()}`)

    // First, count how many records will be deleted
    const { data: leadsToDelete, error: countError } = await supabase
      .from('leads')
      .select('id', { count: 'exact' })
      .lt('created_at', twelveMonthsAgo.toISOString())

    if (countError) {
      console.error('Failed to count leads for deletion:', countError)
      return NextResponse.json(
        { error: 'Failed to count leads', details: countError.message },
        { status: 500 }
      )
    }

    const countToDelete = leadsToDelete?.length || 0

    if (countToDelete > 0) {
      // Delete records older than 12 months
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .lt('created_at', twelveMonthsAgo.toISOString())

      if (deleteError) {
        console.error('Failed to delete leads:', deleteError)
        return NextResponse.json(
          { error: 'Failed to delete leads', details: deleteError.message },
          { status: 500 }
        )
      }

      console.log(`GDPR Cleanup: Successfully deleted ${countToDelete} leads`)
    } else {
      console.log('GDPR Cleanup: No leads to delete')
    }

    // Send confirmation email to admin
    const { subject, html } = gdprCleanupEmail(countToDelete)
    const emailResult = await sendEmail(adminEmail, subject, html)

    if (!emailResult.success) {
      console.error('Failed to send GDPR cleanup email:', emailResult.error)
      // Don't fail the entire job just because email failed
    } else {
      console.log('GDPR cleanup email sent successfully')
    }

    return NextResponse.json({
      success: true,
      message: 'GDPR cleanup cron job completed',
      stats: {
        deletedCount: countToDelete,
        cutoffDate: twelveMonthsAgo.toISOString(),
        emailSent: emailResult.success,
      },
    })
  } catch (error: any) {
    console.error('GDPR cleanup cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    )
  }
}
