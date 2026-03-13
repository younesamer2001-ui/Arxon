import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'



export async function GET() {
  const supabase = createServerClient();
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customers })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = createServerClient();
  try {
    const body = await req.json()
    const { company_name, contact_person, email, phone } = body

    if (!company_name || !email) {
      return NextResponse.json({ error: 'Mangler company_name eller email' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('customers')
      .insert({
        company_name,
        contact_person: contact_person || null,
        email,
        phone: phone || null,
        onboarding_status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer: data })
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
      return NextResponse.json({ error: 'Mangler kunde-id' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer: data })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = createServerClient();
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Mangler kunde-id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}
