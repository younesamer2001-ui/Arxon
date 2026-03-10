'use client'

import { useState, useEffect, useCallback } from 'react'
import { gold, goldRgb, fonts } from '@/lib/constants'
import {
  Activity, CheckCircle2, AlertTriangle, XCircle, Clock, TrendingUp,
  Zap, DollarSign, BarChart3, RefreshCw, Pause, Play, Settings,
  ChevronRight, ArrowUpRight, Timer, Server, Wifi, WifiOff,
  Shield, Eye, Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type HealthStatus = 'healthy' | 'warning' | 'error' | 'inactive'
type WorkflowStatus = 'pending_setup' | 'awaiting_integrations' | 'ready' | 'active' | 'paused' | 'error'

interface WorkflowCard {
  id: string
  name: string
  automationKey: string
  status: WorkflowStatus
  health: HealthStatus
  lastRun: string | null
  n8nWorkflowUrl: string | null
  requiredIntegrations: string[]
  connectedIntegrations: string[]
  errorMessage: string | null
  createdAt: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const healthConfig: Record<HealthStatus, { color: string; icon: typeof CheckCircle2; label: string }> = {
  healthy: { color: '#10b981', icon: CheckCircle2, label: 'Frisk' },
  warning: { color: '#f59e0b', icon: AlertTriangle, label: 'Advarsel' },
  error: { color: '#ef4444', icon: XCircle, label: 'Feil' },
  inactive: { color: '#64748b', icon: Clock, label: 'Inaktiv' },
}

const statusConfig: Record<WorkflowStatus, { color: string; label: string; description: string }> = {
  pending_setup: { color: '#64748b', label: 'Venter oppsett', description: 'Workflowen venter på at integrasjoner settes opp' },
  awaiting_integrations: { color: '#f59e0b', label: 'Mangler tilkoblinger', description: 'Noen integrasjoner må kobles til først' },
  ready: { color: '#3b82f6', label: 'Klar', description: 'Alle integrasjoner er tilkoblet â klar til aktivering' },
  active: { color: '#10b981', label: 'Aktiv', description: 'Workflowen kjører normalt' },
  paused: { color: '#64748b', label: 'Pauset', description: 'Workflowen er midlertidig stoppet' },
  error: { color: '#ef4444', label: 'Feil', description: 'Det oppstod en feil â vi ser på det' },
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Aldri'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Akkurat nå'
  if (mins < 60) return `${mins}m siden`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}t siden`
  const days = Math.floor(hours / 24)
  return `${days}d siden`
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AutomatiseringerPage() {
  const [workflows, setWorkflows] = useState<WorkflowCard[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Fetch real workflow data from Supabase
  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const params = new URLSearchParams(window.location.search)
        let oid = params.get('order_id')

        if (!oid) {
          oid = localStorage.getItem('arxon_order_id')
        }

        if (!oid) {
          // Fallback: find most recent paid order
          const { data: orders, error } = await supabase
            .from('orders')
            .select('id')
            .in('status', ['setup_paid', 'active', 'trialing'])
            .order('created_at', { ascending: false })
            .limit(1)

          if (error) throw error
          if (orders && orders.length > 0) {
            oid = orders[0].id
          }
        }

        if (!oid) {
          setLoading(false)
          return
        }

        setOrderId(oid)
        localStorage.setItem('arxon_order_id', oid)

        // Fetch workflows from API
        const res = await fetch(`/api/workflows?order_id=${oid}`)
        const { workflows: wfData } = await res.json()

        if (wfData && wfData.length > 0) {
          const cards: WorkflowCard[] = wfData.map((wf: any) => ({
            id: wf.id,
            name: formatAutomationName(wf.automation_name),
            automationKey: wf.automation_name,
            status: wf.workflow_status as WorkflowStatus,
            health: wf.health_status as HealthStatus,
            lastRun: wf.last_run_at,
            n8nWorkflowUrl: wf.n8n_workflow_url,
            requiredIntegrations: wf.required_integrations || [],
            connectedIntegrations: wf.connected_integrations || [],
            errorMessage: wf.error_message,
            createdAt: wf.created_at,
          }))
          setWorkflows(cards)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching workflows:', err)
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  // Format automation name nicely
  function formatAutomationName(name: string): string {
    return name
      .split('-').join(' ')
      .split('_').join(' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  }

  const selectedWf = workflows.find(w => w.id === selected)

  // Aggregated stats
  const activeCount = workflows.filter(w => w.status === 'active').length
  const readyCount = workflows.filter(w => w.status === 'ready').length
  const awaitingCount = workflows.filter(w => w.status === 'awaiting_integrations' || w.status === 'pending_setup').length
  const errorCount = workflows.filter(w => w.status === 'error').length

  const handleRefresh = useCallback(async () => {
    if (!orderId) return
    setRefreshing(true)
    try {
      const res = await fetch(`/api/workflows?order_id=${orderId}`)
      const { workflows: wfData } = await res.json()
      if (wfData) {
        const cards: WorkflowCard[] = wfData.map((wf: any) => ({
          id: wf.id,
          name: formatAutomationName(wf.automation_name),
          automationKey: wf.automation_name,
          status: wf.workflow_status as WorkflowStatus,
          health: wf.health_status as HealthStatus,
          lastRun: wf.last_run_at,
          n8nWorkflowUrl: wf.n8n_workflow_url,
          requiredIntegrations: wf.required_integrations || [],
          connectedIntegrations: wf.connected_integrations || [],
          errorMessage: wf.error_message,
          createdAt: wf.created_at,
        }))
        setWorkflows(cards)
      }
    } catch (err) {
      console.error('Refresh error:', err)
    } finally {
      setRefreshing(false)
    }
  }, [orderId])

  // Loading state
  if (loading) {
    return (
      <div style={{ fontFamily: fonts.body, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} style={{ color: gold, animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 14 }}>Laster automatiseringer...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // Empty state
  if (workflows.length === 0) {
    return (
      <div style={{ fontFamily: fonts.body, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <Zap size={48} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Ingen automatiseringer ennå</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.6 }}>
            Når du kjøper automatiseringer via pakkebyggeren, vil de dukke opp her med status og oppfølging.
          </p>
          <a
            href="/pakkebygger"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 20, padding: '12px 24px', borderRadius: 10,
              background: gold, color: '#000', fontWeight: 600, fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Gå til pakkebygger <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: fonts.body, color: '#e2e8f0', minHeight: '100vh' }}>
      <style>{`
        .wf-card { background: rgba(${goldRgb},0.03); border: 1px solid rgba(${goldRgb},0.08); border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.3s; }
        .wf-card:hover { border-color: rgba(${goldRgb},0.2); transform: translateY(-2px); }
        .wf-card.sel { border-color: ${gold}; box-shadow: 0 0 24px rgba(${goldRgb},0.08); }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px 24px; }
        .btn-sm { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .btn-sm:hover { transform: translateY(-1px); }
        .progress-bar { height: 6px; border-radius: 3px; overflow: hidden; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={28} style={{ color: gold }} />
            Mine Automatiseringer
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 6, fontSize: 14 }}>
            Overvåk status og fremdrift for dine kjøpte automatiseringer.
          </p>
        </div>
        <button
          className="btn-sm"
          onClick={handleRefresh}
          style={{ background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          {refreshing ? 'Oppdaterer...' : 'Oppdater status'}
        </button>
      </div>

      {/* Status overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Zap size={18} style={{ color: gold }} />
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Totalt</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{workflows.length}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>automatiseringer kjøpt</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Aktive</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{activeCount}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>kjører nå</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Clock size={18} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Klare</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>{readyCount}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>venter på aktivering</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={18} style={{ color: awaitingCount > 0 ? '#f59e0b' : '#64748b' }} />
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Uferdige</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: awaitingCount > 0 ? '#f59e0b' : '#64748b' }}>{awaitingCount}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            {awaitingCount > 0 ? 'mangler integrasjoner' : 'alt er koblet til'}
          </div>
        </div>
      </div>

      {/* Workflow grid + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Workflow cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {workflows.map(wf => {
            const hc = healthConfig[wf.health] || healthConfig.inactive
            const sc = statusConfig[wf.status] || statusConfig.pending_setup
            const HealthIcon = hc.icon
            const progress = wf.requiredIntegrations.length > 0
              ? Math.round((wf.connectedIntegrations.length / wf.requiredIntegrations.length) * 100)
              : 0

            return (
              <div
                key={wf.id}
                className={`wf-card ${selected === wf.id ? 'sel' : ''}`}
                onClick={() => setSelected(selected === wf.id ? null : wf.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HealthIcon size={16} style={{ color: hc.color }} />
                      {wf.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      Opprettet: {timeAgo(wf.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                      background: `${sc.color}15`, color: sc.color,
                    }}>
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Integration progress */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                    <span>Integrasjoner tilkoblet</span>
                    <span style={{ color: progress === 100 ? '#10b981' : '#f59e0b' }}>
                      {wf.connectedIntegrations.length}/{wf.requiredIntegrations.length}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      borderRadius: 3,
                      background: progress === 100 ? '#10b981' : progress > 0 ? '#f59e0b' : '#64748b',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                {/* Integration chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {wf.requiredIntegrations.map(svc => {
                    const isConnected = wf.connectedIntegrations.includes(svc)
                    return (
                      <span key={svc} style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 500,
                        background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                        color: isConnected ? '#10b981' : '#64748b',
                        border: `1px solid ${isConnected ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                        {isConnected ? 'â' : 'â'} {svc.replace(/_/g, ' ')}
                      </span>
                    )
                  })}
                </div>

                {/* Error alert */}
                {wf.errorMessage && (
                  <div style={{
                    marginTop: 12, padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    fontSize: 12, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0, color: '#ef4444' }} />
                    {wf.errorMessage}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        {selectedWf && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 28,
            position: 'sticky',
            top: 20,
            alignSelf: 'start',
          }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>{selectedWf.name}</h2>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                {selectedWf.automationKey}
              </div>
            </div>

            {/* Status info */}
            {(() => {
              const sc = statusConfig[selectedWf.status] || statusConfig.pending_setup
              const hc = healthConfig[selectedWf.health] || healthConfig.inactive
              const HealthIcon = hc.icon
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                  borderRadius: 10, marginBottom: 20,
                  background: `${sc.color}08`, border: `1px solid ${sc.color}25`,
                }}>
                  <HealthIcon size={20} style={{ color: sc.color }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: sc.color }}>{sc.label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{sc.description}</div>
                  </div>
                </div>
              )
            })()}

            {/* Required integrations detail */}
            <div style={{
              padding: '14px 16px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Nødvendige integrasjoner</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedWf.requiredIntegrations.map(svc => {
                  const isConnected = selectedWf.connectedIntegrations.includes(svc)
                  return (
                    <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                      <span style={{ color: '#e2e8f0', textTransform: 'capitalize' }}>{svc.replace(/_/g, ' ')}</span>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                        background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: isConnected ? '#10b981' : '#f59e0b',
                      }}>
                        {isConnected ? 'Tilkoblet' : 'Mangler'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {selectedWf.status === 'awaiting_integrations' && (
                <a
                  href={`/dashboard/integrasjoner${orderId ? `?order_id=${orderId}` : ''}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    marginTop: 12, padding: '8px 16px', borderRadius: 8,
                    background: `rgba(${goldRgb},0.12)`, color: gold,
                    fontWeight: 600, fontSize: 12, textDecoration: 'none',
                    border: `1px solid rgba(${goldRgb},0.2)`,
                  }}
                >
                  Gå til integrasjoner <ChevronRight size={14} />
                </a>
              )}
            </div>

            {/* n8n workflow link */}
            {selectedWf.n8nWorkflowUrl && (
              <div style={{
                padding: '14px 16px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Workflow</div>
                <a
                  href={selectedWf.n8nWorkflowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: '#3b82f6', fontSize: 13, textDecoration: 'none',
                  }}
                >
                  Åpne i n8n <ArrowUpRight size={14} />
                </a>
              </div>
            )}

            {/* Timing info */}
            <div style={{
              padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Info</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#94a3b8' }}>Opprettet</span>
                  <span style={{ color: '#e2e8f0' }}>{timeAgo(selectedWf.createdAt)}</span>
                </div>
                {selectedWf.lastRun && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Sist kjørt</span>
                    <span style={{ color: '#e2e8f0' }}>{timeAgo(selectedWf.lastRun)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error info */}
            {selectedWf.errorMessage && (
              <div style={{
                padding: '14px 16px', borderRadius: 10, marginTop: 16,
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>Feilmelding</div>
                <div style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.5 }}>{selectedWf.errorMessage}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

