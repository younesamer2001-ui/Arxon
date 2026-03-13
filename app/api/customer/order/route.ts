import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServerClient();
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
