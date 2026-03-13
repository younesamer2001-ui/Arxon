import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  try {
    const body = await request.json()
    const { action } = body

    // Validate action
    if (!action || typeof action !== 'string' || !['submit', 'analyze'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action parameter', code: 'INVALID_ACTION' },
        { status: 400 }
      )
    }

    // ── ACTION: SUBMIT LEAD ──
    if (action === 'submit') {
      const { contact, answers, aiSummary, roiData, recommendedTier, language } = body

      // Validate required fields
      if (!contact || typeof contact !== 'object') {
        return NextResponse.json(
          { error: 'Invalid contact object', code: 'INVALID_CONTACT' },
          { status: 400 }
        )
      }

      if (!contact.email || typeof contact.email !== 'string' || !isValidEmail(contact.email)) {
        return NextResponse.json(
          { error: 'Invalid email address', code: 'INVALID_EMAIL' },
          { status: 400 }
        )
      }

      if (!contact.name || typeof contact.name !== 'string') {
        return NextResponse.json(
          { error: 'Contact name is required', code: 'INVALID_CONTACT' },
          { status: 400 }
        )
      }

      if (!answers || typeof answers !== 'object') {
        return NextResponse.json(
          { error: 'Answers are required', code: 'INVALID_SESSION' },
          { status: 400 }
        )
      }

      const refNumber = 'YAI-' + Math.random().toString(36).substr(2, 8).toUpperCase()

      // Save to Supabase
      const { error: dbError } = await supabase.from('leads').insert({
        company_name: contact.company,
        contact_name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        language: language || 'no',
        industry: answers.industry,
        industry_other: answers.industry === 'annet' ? answers.industryOther : null,
        company_size: answers.size,
        pain_points: answers.pain || [],
        tech_stack: answers.tech || [],
        manual_tasks: answers.manual_tasks || null,
        contact_methods: answers.contact_methods || [],
        missed_inquiries: answers.missed,
        budget: answers.budget,
        timeline: answers.timeline,
        goals: answers.goals || null,
        additional_info: answers.additional || null,
        all_answers: answers,
        ai_summary: aiSummary || null,
        roi_data: roiData || {},
        recommended_tier: recommendedTier || null,
        ref_number: refNumber,
        status: 'new',
      })

      // Return error response if database insert fails
      if (dbError) {
        console.error('Supabase insert error:', dbError)
        return NextResponse.json(
          { error: 'Failed to save submission', code: 'DB_ERROR' },
          { status: 500 }
        )
      }

      // Send email notification
      const adminEmail = process.env.ADMIN_EMAIL
      const resendKey = process.env.RESEND_API_KEY

      if (!adminEmail) {
        console.warn('ADMIN_EMAIL environment variable not set')
      }

      if (resendKey && adminEmail) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
            body: JSON.stringify({
              from: 'AI Kartlegging <noreply@younesai.com>',
              to: [adminEmail!],
              subject: `Ny AI-kartlegging: ${contact.company} (${refNumber})`,
              html: `
                <h2>Ny lead fra AI Kartlegging</h2>
                <p><strong>Referanse:</strong> ${refNumber}</p>
                <p><strong>Bedrift:</strong> ${contact.company}</p>
                <p><strong>Kontakt:</strong> ${contact.name}</p>
                <p><strong>E-post:</strong> ${contact.email}</p>
                <p><strong>Telefon:</strong> ${contact.phone || 'Ikke oppgitt'}</p>
                <p><strong>Bransje:</strong> ${answers.industry}</p>
                <p><strong>Størrelse:</strong> ${answers.size}</p>
                <p><strong>Budsjett:</strong> ${answers.budget}</p>
                <p><strong>Tidslinje:</strong> ${answers.timeline}</p>
                <p><strong>Anbefalt pakke:</strong> ${recommendedTier}</p>
                <hr/>
                <p><strong>ROI-data:</strong></p>
                <p>Tapt omsetning/år: ${roiData?.lostYear?.toLocaleString('nb-NO') || 'N/A'} kr</p>
                <p>Anbefalt investering: ${roiData?.investment?.toLocaleString('nb-NO') || 'N/A'} kr/mnd</p>
                <p>ROI: ${roiData?.roi || 'N/A'}%</p>
                <hr/>
                <h3>AI-analyse:</h3>
                <pre style="white-space:pre-wrap;font-family:sans-serif;">${aiSummary || 'Ikke generert'}</pre>
              `,
            }),
          })
        } catch (emailErr) {
          console.error('Email send error:', emailErr)
        }
      } else {
        console.log('No RESEND_API_KEY set, skipping email. Lead saved with ref:', refNumber)
      }

      return NextResponse.json({ success: true, refNumber })
    }

    // ── ACTION: GENERATE AI ANALYSIS ──
    if (action === 'analyze') {
      // Validate prompt
      if (!body.prompt || typeof body.prompt !== 'string') {
        return NextResponse.json(
          { error: 'Prompt is required and must be a string', code: 'INVALID_SESSION' },
          { status: 400 }
        )
      }

      const { prompt } = body
      const anthropicKey = process.env.ANTHROPIC_API_KEY

      if (!anthropicKey) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable', code: 'AI_ERROR' },
          { status: 500 }
        )
      }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('Anthropic API error:', errText)
        return NextResponse.json(
          { error: 'AI analysis failed', code: 'AI_ERROR' },
          { status: 500 }
        )
      }

      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      return NextResponse.json({ summary: text })
    }

    return NextResponse.json({ error: 'Invalid action', code: 'INVALID_ACTION' }, { status: 400 })
  } catch (error: any) {
    console.error('Kartlegging API error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
