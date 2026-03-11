'use client'

import { useState, useEffect } from 'react'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, getCustomerAutomations, getOnboardingSteps } from '@/lib/dashboard'
import {
  CheckCircle2, Circle, ArrowRight, Link2, Shield, Zap, Loader2,
  AlertTriangle, ChevronRight, Package, Play, FileText, Clock,
  RefreshCw
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CustomerAutomation {
  id: string
  customer_id: string
  order_id: string
  automation_key: string
  automation_name: string
  status: string // purchased | setup_pending | configuring | active | error | paused
  n8n_workflow_id: string | null
  config: Record<string, any>
  activated_at: string | null
  created_at: string
  updated_at: string
}

interface OnboardingStep {
  id: string
  customer_id: string
  order_id: string
  step_key: string
  step_name: string
  status: string // pending | in_progress | completed | skipped
  started_at: string | null
  completed_at: string | null
  metadata: Record<string, any>
  created_at: string
}

interface CustomerData {
  id: string
  company_name: string
  email: string
  onboarding_status: string
  order_id: string
}

/* ------------------------------------------------------------------ */
/*  Step config                                                        */
/* ------------------------------------------------------------------ */

const stepKeys = ['payment', 'intake_form', 'integration_setup', 'workflow_deploy', 'testing', 'go_live']

const stepIcons: Record<string, any> = {
  payment: CheckCircle2,
  intake_form: FileText,
  integration_setup: Link2,
  workflow_deploy: Zap,
  testing: Shield,
  go_live: Play,
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  purchased: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  setup_pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  configuring: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  active: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  error: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  paused: { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
}

const statusLabels: Record<string, string> = {
  purchased: 'Kjøpt',
  setup_pending: 'Venter på oppsett',
  configuring: 'Konfigureres',
  active: 'Aktiv',
  error: 'Feil',
  paused: 'Pauset',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const { user } = useAuth()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [automations, setAutomations] = useState<CustomerAutomation[]>([])
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const cust = await getCustomer()
      if (!cust) {
        setLoading(false)
        return
      }
      setCustomer(cust as any)

      const [autoRes, stepsRes] = await Promise.all([
        getCustomerAutomations(cust.id),
        getOnboardingSteps(cust.id),
      ])

      setAutomations(autoRes.data as CustomerAutomation[])
      setSteps(stepsRes.data as OnboardingStep[])

      // Auto-select first pending automation
      const pending = (autoRes.data as CustomerAutomation[]).find(a => a.status !== 'active')
      if (pending && !selected) setSelected(pending.id)
    } catch (err) {
      console.error('Failed to load onboarding data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const selectedItem = automations.find(a => a.id === selected)
  const pendingAutomations = automations.filter(a => a.status !== 'active')
  const activeAutomations = automations.filter(a => a.status === 'active')

  // Calculate onboarding progress
  const completedSteps = steps.filter(s => s.status === 'completed').length
  const totalSteps = steps.length
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  // Current step (first non-completed)
  const currentStep = steps.find(s => s.status !== 'completed' && s.status !== 'skipped')

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} style={{ color: gold, animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (!customer) {
    return (
      <div style={{ fontFamily: fonts.body, color: '#e2e8f0', textAlign: 'center', padding: '60px 20px' }}>
        <Package size={48} style={{ color: '#64748b', marginBottom: 16 }} />
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Ingen kundedata funnet</h2>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>
          Kontakt oss på <a href="mailto:kontakt@arxon.no" style={{ color: gold }}>kontakt@arxon.no</a> hvis du trenger hjelp.
        </p>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: fonts.body, color: '#e2e8f0' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .onb-card { background: rgba(${goldRgb},0.03); border: 1px solid rgba(${goldRgb},0.1); border-radius: 16px; transition: all 0.3s; cursor: pointer; }
        .onb-card:hover { border-color: rgba(${goldRgb},0.25); transform: translateY(-2px); }
        .onb-card.active { border-color: ${gold}; box-shadow: 0 0 30px rgba(${goldRgb},0.1); }
        .btn-gold { background: ${gold}; color: #080c14; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; transition: all 0.3s; }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(${goldRgb},0.3); }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .service-badge { padding: 6px 12px; border-radius: 8px; font-size: 13px; display: flex; align-items: center; gap: 6px; }
        @media (max-width: 768px) {
          .onb-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>
            <Package size={28} style={{ display: 'inline', marginRight: 10, color: gold }} />
            Oppsett & Aktivering
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 15, margin: '8px 0 0' }}>
            Følg stegene for å aktivere dine automatiseringer.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '8px 16px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13,
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Oppdater
        </button>
      </div>

      {/* Onboarding Progress Bar */}
      {steps.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 32,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Onboarding-fremgang</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                {currentStep
                  ? `Neste steg: ${currentStep.step_name}`
                  : 'Alle steg fullført!'
                }
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: gold }}>{progressPct}%</div>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)',
            marginBottom: 20, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${gold}, #f59e0b)`,
              width: `${progressPct}%`, transition: 'width 0.5s ease',
            }} />
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {steps.map((step, i) => {
              const isCompleted = step.status === 'completed'
              const isCurrent = step.status === 'in_progress'
              const Icon = stepIcons[step.step_key] || Circle
              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: isCompleted ? gold : isCurrent ? 'rgba(' + goldRgb + ',0.2)' : 'rgba(255,255,255,0.06)',
                    color: isCompleted ? '#080c14' : isCurrent ? gold : '#64748b',
                    border: isCurrent ? `2px solid ${gold}` : 'none',
                    boxShadow: isCurrent ? `0 0 12px rgba(${goldRgb},0.3)` : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      height: 2, flex: 1, minWidth: 12,
                      background: isCompleted ? gold : 'rgba(255,255,255,0.08)',
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {steps.map(step => (
              <div key={step.id} style={{
                fontSize: 11, color: step.status === 'completed' ? gold : '#64748b',
                textAlign: 'center', flex: 1,
              }}>
                {step.step_name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intake Form CTA (show when intake_form step is pending) */}
      {currentStep?.step_key === 'intake_form' && (
        <div style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.08), rgba(${goldRgb},0.02))`,
          border: `1px solid rgba(${goldRgb},0.2)`,
          borderRadius: 16, padding: '24px 28px', marginBottom: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
              <FileText size={18} style={{ display: 'inline', marginRight: 8, color: gold }} />
              Fyll ut kartleggingsskjema
            </div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>
              Vi trenger litt informasjon om bedriften din for å sette opp automatiseringene.
            </div>
          </div>
          <a
            href="/dashboard/onboarding/kartlegging"
            className="btn-gold"
            style={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <FileText size={16} />
            Start kartlegging
            <ArrowRight size={16} />
          </a>
        </div>
      )}

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Venter på oppsett', value: pendingAutomations.length, color: '#f59e0b' },
          { label: 'Aktive', value: activeAutomations.length, color: '#10b981' },
          { label: 'Totalt kjøpt', value: automations.length, color: gold },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* No automations state */}
      {automations.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
        }}>
          <Zap size={40} style={{ color: '#64748b', marginBottom: 16 }} />
          <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Ingen automatiseringer ennå
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            Automatiseringene dine vil dukke opp her etter at du har fullført et kjøp.
          </p>
        </div>
      )}

      {/* Automations grid */}
      {automations.length > 0 && (
        <div className="onb-grid" style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: 24 }}>
          {/* Left: List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingAutomations.length > 0 && (
              <div style={{
                fontSize: 13, fontWeight: 600, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
              }}>
                Venter på oppsett ({pendingAutomations.length})
              </div>
            )}
            {pendingAutomations.map(item => {
              const colors = statusColors[item.status] || statusColors.purchased
              return (
                <div
                  key={item.id}
                  className={`onb-card ${selected === item.id ? 'active' : ''}`}
                  onClick={() => setSelected(item.id)}
                  style={{ padding: '20px 24px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{item.automation_name}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={12} />
                        {item.updated_at ? `Oppdatert ${new Date(item.updated_at).toLocaleDateString('nb-NO')}` : 'Nylig kjøpt'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 12, padding: '4px 10px', borderRadius: 6,
                        background: colors.bg, color: colors.text,
                        border: `1px solid ${colors.border}`, fontWeight: 600,
                      }}>
                        {statusLabels[item.status] || item.status}
                      </span>
                      <ChevronRight size={16} style={{ color: '#64748b' }} />
                    </div>
                  </div>
                </div>
              )
            })}

            {activeAutomations.length > 0 && (
              <>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 4,
                }}>
                  Aktive ({activeAutomations.length})
                </div>
                {activeAutomations.map(item => (
                  <div
                    key={item.id}
                    className={`onb-card ${selected === item.id ? 'active' : ''}`}
                    onClick={() => setSelected(item.id)}
                    style={{ padding: '20px 24px', opacity: 0.8 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                        <div>
                          <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{item.automation_name}</span>
                          {item.activated_at && (
                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                              Aktivert {new Date(item.activated_at).toLocaleDateString('nb-NO')}
                            </div>
                          )}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 12, padding: '4px 10px', borderRadius: 6,
                        background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600,
                      }}>
                        Aktiv
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right: Detail panel */}
          {selectedItem && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 32,
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 0, marginBottom: 8 }}>
                {selectedItem.automation_name}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
                {selectedItem.status === 'active'
                  ? 'Denne automatiseringen er aktiv og kjører.'
                  : selectedItem.status === 'error'
                  ? 'Det oppstod en feil. Vi jobber med å fikse det.'
                  : selectedItem.status === 'configuring'
                  ? 'Vi konfigurerer workflowen din nå.'
                  : 'Automatiseringen er klar for oppsett.'
                }
              </p>

              {/* Status badge */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Status</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 10,
                  background: (statusColors[selectedItem.status] || statusColors.purchased).bg,
                  border: `1px solid ${(statusColors[selectedItem.status] || statusColors.purchased).border}`,
                  color: (statusColors[selectedItem.status] || statusColors.purchased).text,
                  fontWeight: 600, fontSize: 14,
                }}>
                  {selectedItem.status === 'active' && <CheckCircle2 size={16} />}
                  {selectedItem.status === 'error' && <AlertTriangle size={16} />}
                  {selectedItem.status === 'configuring' && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  {selectedItem.status === 'purchased' && <Package size={16} />}
                  {selectedItem.status === 'setup_pending' && <Clock size={16} />}
                  {statusLabels[selectedItem.status] || selectedItem.status}
                </div>
              </div>

              {/* n8n workflow ID if available */}
              {selectedItem.n8n_workflow_id && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                    <Zap size={16} style={{ display: 'inline', marginRight: 8, color: gold }} />
                    Workflow
                  </div>
                  <div style={{
                    padding: '10px 16px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 13, color: '#94a3b8', fontFamily: 'monospace',
                  }}>
                    ID: {selectedItem.n8n_workflow_id}
                  </div>
                </div>
              )}

              {/* Config info */}
              {selectedItem.config && Object.keys(selectedItem.config).length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                    Konfigurasjon
                  </div>
                  {selectedItem.config.requested_integrations && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(selectedItem.config.requested_integrations as string[]).map(svc => (
                        <div key={svc} className="service-badge" style={{
                          background: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.3)',
                          color: '#3b82f6',
                        }}>
                          <Link2 size={14} />
                          {svc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action hints based on status */}
              {selectedItem.status === 'purchased' && (
                <div style={{
                  padding: '16px 20px', borderRadius: 12,
                  background: `rgba(${goldRgb},0.05)`, border: `1px solid rgba(${goldRgb},0.15)`,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <FileText size={18} style={{ color: gold, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                      Fyll ut kartleggingsskjema
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                      Vi trenger litt informasjon for å sette opp denne automatiseringen.
                      Fyll ut kartleggingsskjemaet for å komme i gang.
                    </div>
                    <a
                      href="/dashboard/onboarding/kartlegging"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        marginTop: 12, color: gold, fontSize: 14, fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Gå til kartlegging <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              )}

              {selectedItem.status === 'configuring' && (
                <div style={{
                  padding: '16px 20px', borderRadius: 12,
                  background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <Loader2 size={18} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: '#94a3b8' }}>
                    Workflowen konfigureres automatisk. Dette tar vanligvis noen minutter.
                  </span>
                </div>
              )}

              {selectedItem.status === 'error' && (
                <div style={{
                  padding: '16px 20px', borderRadius: 12,
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <AlertTriangle size={18} style={{ color: '#ef4444', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>
                      Noe gikk galt
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                      Vi har blitt varslet og jobber med å løse problemet.
                      Kontakt oss på <a href="mailto:kontakt@arxon.no" style={{ color: gold }}>kontakt@arxon.no</a> hvis du trenger hjelp.
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.status === 'active' && (
                <div style={{
                  padding: '16px 20px', borderRadius: 12,
                  background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>
                    Automatiseringen er aktiv og kjører!
                  </span>
                </div>
              )}

              {/* Security note */}
              <div style={{
                marginTop: 24, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Shield size={16} style={{ color: '#10b981', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                  Alt håndteres sikkert. Du kan når som helst pause eller stoppe automatiseringen fra denne siden.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
