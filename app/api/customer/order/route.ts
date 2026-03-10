import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get the most recent order (will be replaced with auth-based lookup later)
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'No order found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
