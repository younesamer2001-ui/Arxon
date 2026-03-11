import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: workflows, error } = await supabase
      .from('customer_workflows')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflows })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer_id, workflow_name, automation_key, workflow_status, n8n_workflow_id, n8n_workflow_url } = body

    if (!customer_id || !workflow_name) {
      return NextResponse.json({ error: 'Mangler customer_id eller workflow_name' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('customer_workflows')
      .insert({
        customer_id,
        workflow_name,
        automation_key: automation_key || null,
        workflow_status: workflow_status || 'inactive',
        health_status: 'unknown',
        n8n_workflow_id: n8n_workflow_id || null,
        n8n_workflow_url: n8n_workflow_url || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflow: data })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Mangler id' }, { status: 400 })
    }

    const allowedFields = [
      'workflow_status',
      'health_status',
      'n8n_workflow_id',
      'n8n_workflow_url',
      'error_message'
    ]

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
      .from('customer_workflows')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflow: data })
  } catch (err) {
    return NextResponse.json({ error: 'Intern serverfeil' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Mangler workflow-id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('customer_workflows')
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
