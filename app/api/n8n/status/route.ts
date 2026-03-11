export const dynamic = 'force-dynamic'
  
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://saiai.app.n8n.cloud'
const N8N_API_KEY = process.env.N8N_API_KEY || ''

async function getN8nWorkflowStatus(workflowId: string) {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': N8N_API_KEY,
    },
  })

  if (!res.ok) {
    throw new Error(`n8n API error: ${res.status}`)
  }

  return res.json()
}

async function getN8nExecutions(workflowId: string, limit = 5) {
  const res = await fetch(
    `${N8N_BASE_URL}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    }
  )

  if (!res.ok) {
    throw new Error(`n8n executions error: ${res.status}`)
  }

  return res.json()
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('order_id')
    const workflowId = searchParams.get('workflow_id')

    if (!N8N_API_KEY) {
      return NextResponse.json(
        { error: 'N8N_API_KEY er ikke konfigurert' },
        { status: 500 }
      )
    }

    // Single workflow status check
    if (workflowId) {
      const n8nData = await getN8nWorkflowStatus(workflowId)
      const executions = await getN8nExecutions(workflowId)

      const recentErrors = executions.data?.filter(
        (e: any) => e.finished === false || e.stoppedAt === null
      )

      return NextResponse.json({
        workflow: {
          id: n8nData.id,
          name: n8nData.name,
          active: n8nData.active,
          updatedAt: n8nData.updatedAt,
        },
        executions: {
          total: executions.data?.length || 0,
          recent_errors: recentErrors?.length || 0,
        },
        health: recentErrors?.length > 0 ? 'warning' : 'healthy',
      })
    }

    // All workflows for an order
    if (orderId) {
      const { data: workflows, error } = await supabase
        .from('customer_workflows')
        .select('*')
        .eq('order_id', orderId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const statuses = await Promise.all(
        (workflows || []).map(async (wf: any) => {
          if (!wf.n8n_workflow_id) {
            return {
              ...wf,
              n8n_status: 'not_deployed',
              health: 'pending',
            }
          }

          try {
            const n8nData = await getN8nWorkflowStatus(wf.n8n_workflow_id)
            const executions = await getN8nExecutions(wf.n8n_workflow_id)
            const recentErrors = executions.data?.filter(
              (e: any) => e.finished === false
            )

            const health =
              !n8nData.active
                ? 'inactive'
                : recentErrors?.length > 0
                ? 'warning'
                : 'healthy'

            // Update Supabase with latest health
            await supabase
              .from('customer_workflows')
              .update({ health_status: health })
              .eq('id', wf.id)

            return {
              ...wf,
              n8n_status: n8nData.active ? 'active' : 'inactive',
              health,
              last_execution: executions.data?.[0]?.startedAt || null,
            }
          } catch (err: any) {
            await supabase
              .from('customer_workflows')
              .update({
                health_status: 'error',
                error_message: err.message,
              })
              .eq('id', wf.id)

            return {
              ...wf,
              n8n_status: 'error',
              health: 'error',
              error_message: err.message,
            }
          }
        })
      )

      return NextResponse.json({ workflows: statuses })
    }

    return NextResponse.json(
      { error: 'Mangler order_id eller workflow_id parameter' },
      { status: 400 }
    )
  } catch (err: any) {
    console.error('n8n status error:', err)
    return NextResponse.json(
      { error: err.message || 'Kunne ikke hente arbeidsflyt-status' },
      { status: 500 }
    )
  }
}
