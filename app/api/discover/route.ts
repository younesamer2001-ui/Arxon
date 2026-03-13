import { createServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  try {
    const body = await request.json()
    const { session, previousAnswers, action, language } = body

    // Validate action
    if (!action || typeof action !== 'string' || !['next_question', 'generate_summary', 'final_recommendation'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action parameter', code: 'INVALID_ACTION' },
        { status: 400 }
      )
    }

    // Validate session object exists
    if (!session || typeof session !== 'object') {
      return NextResponse.json(
        { error: 'Session object is required', code: 'INVALID_SESSION' },
        { status: 400 }
      )
    }

    // Validate previousAnswers is array
    if (!Array.isArray(previousAnswers)) {
      return NextResponse.json(
        { error: 'Previous answers must be an array', code: 'INVALID_SESSION' },
        { status: 400 }
      )
    }

    const lang = language === 'en' ? 'English' : 'Norwegian'

    if (action === 'next_question') {
      // Generate next adaptive question
      const systemPrompt = `You are an AI business consultant for Arxon, a company that helps businesses integrate AI into their operations.

Your role is to conduct a discovery interview with a business representative. You must:
1. Ask ONE question at a time
2. Provide 3-6 relevant options plus make the last option "Annet (skriv selv)" in Norwegian or "Other (specify)" in English
3. Tailor each question based on ALL previous answers
4. Keep questions conversational but professional
5. Detect when you have enough information (usually 8-12 questions after the initial profile)

Respond ONLY in ${lang}.

Company profile:
- Industry: ${session.industry}
- Size: ${session.company_size}
- Primary challenge: ${session.primary_challenge}
- Budget: ${session.budget}
- AI experience: ${session.ai_experience}

Previous Q&A in this session:
${previousAnswers.map((a: any, i: number) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n')}

Rules:
- Don't ask about things already answered in the profile
- Focus questions on narrowing down the SPECIFIC AI solution they need
- Ask about their current workflows, pain points, team structure, tech stack
- Consider their budget and AI experience level
- If you have enough information (8+ questions answered), set is_final to true

Respond in this exact JSON format:
{
  "question": "Your question here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "question_type": "single_choice",
  "is_final": false,
  "ai_note": "Brief note about what this answer tells us"
}`

      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: previousAnswers.length === 0
              ? 'Generate the first discovery question for this business.'
              : `The user answered the last question with: "${previousAnswers[previousAnswers.length - 1]?.answer}". Generate the next question.`,
          },
        ],
        system: systemPrompt,
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response')
      }

      let questionData
      try {
        questionData = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error('Failed to parse JSON from AI response:', parseError)
        throw new Error('Invalid JSON format in AI response')
      }
      return NextResponse.json(questionData)
    }

    if (action === 'generate_summary') {
      // Generate running summary
      const systemPrompt = `You are an AI business consultant. Based on the discovery session data, generate a concise running summary.

Respond ONLY in ${lang}.

Company: ${session.company_name || 'Unknown'}
Industry: ${session.industry}
Size: ${session.company_size}
Challenge: ${session.primary_challenge}
Budget: ${session.budget}

All answers so far:
${previousAnswers.map((a: any, i: number) => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Respond in this exact JSON format:
{
  "findings": ["Finding 1", "Finding 2", "Finding 3"],
  "direction": ["Possible direction 1", "Possible direction 2"]
}`

      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: 'Generate the summary based on all answers so far.' }],
        system: systemPrompt,
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Failed to parse summary')

      let summaryData
      try {
        summaryData = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error('Failed to parse summary JSON:', parseError)
        throw new Error('Invalid JSON format in summary response')
      }
      return NextResponse.json(summaryData)
    }

    if (action === 'final_recommendation') {
      // Generate the full recommendation
      const systemPrompt = `You are a senior AI integration consultant at Arxon Generate a comprehensive, professional AI integration recommendation report.

Respond ONLY in ${lang}.

Company profile:
- Industry: ${session.industry}
- Size: ${session.company_size}
- Primary challenge: ${session.primary_challenge}
- Budget: ${session.budget}
- AI experience: ${session.ai_experience}

All discovery answers:
${previousAnswers.map((a: any, i: number) => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')}

Generate a detailed recommendation that includes:
1. Executive summary (2-3 sentences)
2. Primary recommended AI solution (what it does, how it works)
3. Expected impact (specific metrics where possible)
4. Implementation timeline
5. Estimated investment range
6. Optional add-on solutions (2-3 ideas)
7. Next steps
8. Priority score (1-10) based on readiness, budget, and potential impact

Respond in this exact JSON format:
{
  "executive_summary": "...",
  "primary_solution": {
    "name": "...",
    "description": "...",
    "how_it_works": "..."
  },
  "expected_impact": ["Impact 1", "Impact 2", "Impact 3"],
  "timeline": "...",
  "investment": "...",
  "add_ons": [
    { "name": "...", "description": "..." }
  ],
  "next_steps": "...",
  "priority_score": 8,
  "full_text": "A complete, formatted text version of the entire recommendation suitable for email"
}`

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{ role: 'user', content: 'Generate the final recommendation report.' }],
        system: systemPrompt,
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Failed to parse recommendation')

      let recommendationData
      try {
        recommendationData = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error('Failed to parse recommendation JSON:', parseError)
        throw new Error('Invalid JSON format in recommendation response')
      }
      return NextResponse.json(recommendationData)
    }

    return NextResponse.json({ error: 'Invalid action', code: 'INVALID_ACTION' }, { status: 400 })
  } catch (error: any) {
    console.error('Discovery API error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request', code: 'AI_ERROR' },
      { status: 500 }
    )
  }
}
