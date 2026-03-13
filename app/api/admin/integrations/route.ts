import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'



export async function GET() {
  const supabase = createServerClient();
  try {
    const { data: integrations, error } = await supabase
      .from('customer_integrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ integrations })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const supabase = createServerClient();
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Mangler id' }, { status: 400 })
    }

    const allowedFields = ['status', 'credentials', 'connected_at']

    const filteredUpdates: Record<string, any> = {}
    for (const key of allowedFields) {
      if (key in updates) {
        filteredUpdates[key] = updates[key]
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'Ingen gyldige felt å oppdatere' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('customer_integrations')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ integration: data })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}
