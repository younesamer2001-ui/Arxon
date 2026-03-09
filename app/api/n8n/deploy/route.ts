import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://saiai.app.n8n.cloud'
const N8N_API_KEY = process.env.N8N_API_KEY || ''

interface WorkflowTemplate {
  name: string
  nodes: any[]
  connections: Record<string, any>
  settings?: Record<string, any>
}

const WORKFLOW_TEMPLATES: Record<string, WorkflowTemplate> = {
  'ai-kundeservice': {
    name: 'AI Kundeservice',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'kundeservice-webhook', responseMode: 'responseNode' },
        id: 'webhook-1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [250, 300]
      },
      {
        parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json) }}' },
        id: 'respond-1',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1,
        position: [650, 300]
      }
    ],
    connections: {
      'Webhook': { main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]] }
    }
  },
  'lead-kvalifisering': {
    name: 'Lead Kvalifisering',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'lead-webhook', responseMode: 'responseNode' },
        id: 'webhook-1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [250, 300]
      },
      {
        parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json) }}' },
        id: 'respond-1',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1,
        position: [650, 300]
      }
    ],
    connections: {
      'Webhook': { main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]] }
    }
  },
  'avtale-booking': {
    name: 'Avtale Booking',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'booking-webhook', responseMode: 'responseNode' },
        id: 'webhook-1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [250, 300]
      },
      {
        parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json) }}' },
        id: 'respond-1',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1,
        position: [650, 300]
      }
    ],
    connections: {
      'Webhook': { main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }]] }
    }
  }
}

async function createN8nWorkflow(template: WorkflowTemplate, customerEmail: string) {
  const workflowData = {
    name: `${template.name} - ${customerEmail}`,
    nodes: template.nodes,
    connections: template.connections,
    settings: { executionOrder: 'v1', ...(template.settings || {}) },
    active: false
  }

  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': N8N_API_KEY
    },
    body: JSON.stringify(workflowData)
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`n8n API error: ${res.status} - ${errorText}`)
  }

  return res.json()
}

async function activateN8nWorkflow(workflowId: string) {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': N8N_API_KEY
    }
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`n8n activate error: ${res.status} - ${errorText}`)
  }

  return res.json()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, customer_email, automation_key } = body

    if (!order_id || !customer_email || !automation_key) {
      return NextResponse.json(
        { error: 'Mangler order_id, customer_email eller automation_key' },
        { status: 400 }
      )
    }

    if (!N8N_API_KEY) {
      return NextResponse.json(
        { error: 'N8N_API_KEY er ikke konfigurert' },
        { status: 500 }
      )
    }

    const template = WORKFLOW_TEMPLATES[automation_key]
    if (!template) {
      return NextResponse.json(
        { error: `Ingen mal funnet for automatisering: ${automation_key}` },
        { status: 404 }
      )
    }

    const n8nWorkflow = await createN8nWorkflow(template, customer_email)

    await activateN8nWorkflow(n8nWorkflow.id)

    const { error: updateError } = await supabase
      .from('customer_workflows')
      .update({
        workflow_status: 'active',
        health_status: 'healthy',
        n8n_workflow_id: n8nWorkflow.id.toString(),
        n8n_workflow_url: `${N8N_BASE_URL}/workflow/${n8nWorkflow.id}`,
        error_message: null
      })
      .eq('order_id', order_id)
      .eq('automation_key', automation_key)

    if (updateError) {
      console.error('Supabase update error:', updateError)
    }

    return NextResponse.json({
      success: true,
      workflow: {
        id: n8nWorkflow.id,
        name: n8nWorkflow.name,
        url: `${N8N_BASE_URL}/workflow/${n8nWorkflow.id}`,
        active: true
      }
    })
  } catch (err: any) {
    console.error('n8n deploy error:', err)

    return NextResponse.json(
      { error: err.message || 'Kunne ikke opprette arbeidsflyt i n8n' },
      { status: 500 }
    )
  }
}
