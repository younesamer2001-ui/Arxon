import { createServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  try {
    const body = await request.json()
    const { recommendation, session, answers, userEmail } = body

    // Validate required fields
    if (!recommendation || typeof recommendation !== 'object') {
      return NextResponse.json(
        { error: 'Recommendation is required', code: 'INVALID_SESSION' },
        { status: 400 }
      )
    }

    if (!session || typeof session !== 'object') {
      return NextResponse.json(
        { error: 'Session is required', code: 'INVALID_SESSION' },
        { status: 400 }
      )
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be an array', code: 'INVALID_SESSION' },
        { status: 400 }
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL environment variable not set')
    }

    // If RESEND_API_KEY and adminEmail are configured, send email
    if (process.env.RESEND_API_KEY && adminEmail) {
      const emailBody = `
        <h1>New AI Discovery Submission</h1>
        <h2>Company Profile</h2>
        <ul>
          <li><strong>Industry:</strong> ${session.industry}</li>
          <li><strong>Size:</strong> ${session.company_size}</li>
          <li><strong>Challenge:</strong> ${session.primary_challenge}</li>
          <li><strong>Budget:</strong> ${session.budget}</li>
          <li><strong>AI Experience:</strong> ${session.ai_experience}</li>
          <li><strong>User Email:</strong> ${userEmail}</li>
        </ul>

        <h2>Discovery Answers</h2>
        ${answers.map((a: any, i: number) => `
          <p><strong>Q${i + 1}:</strong> ${a.question}</p>
          <p><em>A:</em> ${a.answer}</p>
          <hr>
        `).join('')}

        <h2>AI Recommendation</h2>
        <p><strong>Priority Score:</strong> ${recommendation.priority_score}/10</p>
        <p><strong>Solution:</strong> ${recommendation.primary_solution?.name}</p>
        <p>${recommendation.executive_summary}</p>
        <p><strong>Timeline:</strong> ${recommendation.timeline}</p>
        <p><strong>Investment:</strong> ${recommendation.investment}</p>

        <h3>Full Report</h3>
        <p>${recommendation.full_text || 'See dashboard for full details.'}</p>
      `

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Arxon <noreply@arxon.no>',
          to: [adminEmail],
          subject: `[Priority ${recommendation.priority_score}/10] New AI Discovery: ${session.ai_summary?.company_name || 'Unknown Company'}`,
          html: emailBody,
        }),
      })

      if (!res.ok) {
        console.error('Email send failed:', await res.text())
      }
    } else {
      console.log('RESEND_API_KEY or ADMIN_EMAIL not configured — skipping email')
      if (recommendation.priority_score) {
        console.log('Priority:', recommendation.priority_score)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
