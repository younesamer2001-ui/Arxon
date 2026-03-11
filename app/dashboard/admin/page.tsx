'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { gold, goldRgb, fonts } from '@/lib/constants'
import {
  Users, Search, ChevronDown, ChevronUp, Mail, Phone as PhoneIcon,
  Globe, Building2, Calendar, Edit3, Save, X, Loader2, Shield,
  Zap, Trash2, Plus, Activity, BarChart3, RefreshCw
} from 'lucide-react'

// ---- Types ----
interface Customer {
  id: string
  user_id: string | null
  company_name: string | null
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  plan: string | null
  status: string | null
  onboarding_complete: boolean | null
  notify_email: boolean | null
  notify_sms: boolean | null
  notify_new_lead: boolean | null
  notify_missed_call: boolean | null
  notify_booking: boolean | null
  created_at: string
}

interface Workflow {
  id: string
  customer_id: string
  workflow_name: string
  automation_key: string | null
  workflow_status: string
  health_status: string
  n8n_workflow_id: string | null
  n8n_workflow_url: string | null
  error_message: string | null
  created_at: string
}

interface GlobalStats {
  total_customers: number
  total_calls: number
  total_leads: number
  total_bookings: number
  total_workflows: number
}

interface PerCustomerStats {
  calls: Record<string, number>
  leads: Record<string, number>
  bookings: Record<string, number>
  workflows: Record<string, number>
}

const ADMIN_EMAILS = ['kontakt@arxon.no']
type Tab = 'customers' | 'automations'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ---- Shared styles ----
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px',
  borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#f0f0f0',
  fontSize: 13, outline: 'none', fontFamily: fonts.body,
  boxSizing: 'border-box' as const,
}

const labelStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
  display: 'block', marginBottom: 4, textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10, padding: '14px 16px',
}

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', borderRadius: 8, border: 'none',
  background: `linear-gradient(135deg, ${gold}, #d4a85a)`,
  color: '#0f1b27', fontWeight: 600, fontSize: 13,
  cursor: 'pointer', fontFamily: fonts.body,
}

const btnSecondary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'transparent', color: 'rgba(255,255,255,0.5)',
  fontSize: 13, cursor: 'pointer', fontFamily: fonts.body,
}

const btnDanger: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 14px', borderRadius: 8, border: 'none',
  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
}

// ============================================================
// Main Admin Page
// ============================================================
export default function AdminPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('customers')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [perCustomer, setPerCustomer] = useState<PerCustomerStats | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email)

  useEffect(() => {
    if (!user || !isAdmin) return
    loadAll()
  }, [user, isAdmin])

  async function loadAll() {
    setLoading(true)
    try {
      const [custRes, wfRes, statsRes] = await Promise.all([
        fetch('/api/admin/customers'),
        fetch('/api/admin/workflows'),
        fetch('/api/admin/stats'),
      ])
      const [custData, wfData, statsData] = await Promise.all([
        custRes.json(), wfRes.json(), statsRes.json(),
      ])
      if (custRes.ok) setCustomers(custData.customers || [])
      if (wfRes.ok) setWorkflows(wfData.workflows || [])
      if (statsRes.ok) {
        setGlobalStats(statsData.global || null)
        setPerCustomer(statsData.per_customer || null)
      }
    } catch (err) {
      console.error('Admin load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: 600, fontFamily: fonts.body, textAlign: 'center', padding: '80px 20px' }}>
        <Shield size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>
          Ingen tilgang
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, margin: 0 }}>
          Denne siden er kun tilgjengelig for administratorer.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960, fontFamily: fonts.body }}>
      {/* Global stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Kunder', value: globalStats?.total_customers ?? '—', icon: Users },
          { label: 'Anrop', value: globalStats?.total_calls ?? '—', icon: PhoneIcon },
          { label: 'Leads', value: globalStats?.total_leads ?? '—', icon: Activity },
          { label: 'Bookinger', value: globalStats?.total_bookings ?? '—', icon: Calendar },
          { label: 'Automatiseringer', value: globalStats?.total_workflows ?? '—', icon: Zap },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon size={14} color={gold} style={{ opacity: 0.7 }} />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ color: '#f0f0f0', fontSize: 22, fontWeight: 700 }}>{loading ? '—' : s.value}</div>
            </div>
          )
        })}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4 }}>
        {([
          { key: 'customers' as Tab, label: 'Kunder', icon: Users },
          { key: 'automations' as Tab, label: 'Automatiseringer', icon: Zap },
        ]).map(t => {
          const active = tab === t.key
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 8, border: 'none',
                background: active ? `rgba(${goldRgb},0.1)` : 'transparent',
                color: active ? gold : 'rgba(255,255,255,0.45)',
                fontWeight: active ? 600 : 400, fontSize: 14,
                cursor: 'pointer', fontFamily: fonts.body,
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'customers' ? (
        <CustomersTab
          customers={customers}
          setCustomers={setCustomers}
          perCustomer={perCustomer}
          loading={loading}
          onRefresh={loadAll}
        />
      ) : (
        <AutomationsTab
          workflows={workflows}
          setWorkflows={setWorkflows}
          customers={customers}
          loading={loading}
          onRefresh={loadAll}
        />
      )}
    </div>
  )
}

// ============================================================
// Customers Tab
// ============================================================
function CustomersTab({
  customers, setCustomers, perCustomer, loading, onRefresh,
}: {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  perCustomer: PerCustomerStats | null
  loading: boolean
  onRefresh: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Customer>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ company_name: '', contact_name: '', email: '', phone: '' })
  const [creating, setCreating] = useState(false)

  async function handleSave(id: string) {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      })
      if (res.ok) {
        const data = await res.json()
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data.customer } : c))
        setEditingId(null)
        setEditForm({})
      }
    } catch (err) {
      console.error('Failed to update customer:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne kunden? Dette kan ikke angres.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/customers?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.id !== id))
        setExpandedId(null)
      }
    } catch (err) {
      console.error('Failed to delete customer:', err)
    } finally {
      setDeleting(null)
    }
  }

  async function handleCreate() {
    if (!createForm.company_name || !createForm.email) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: createForm.company_name,
          contact_person: createForm.contact_name || null,
          email: createForm.email,
          phone: createForm.phone || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to create')
      setShowCreate(false)
      setCreateForm({ company_name: '', contact_name: '', email: '', phone: '' })
      onRefresh()
    } catch (err) {
      console.error('Failed to create customer:', err)
    } finally {
      setCreating(false)
    }
  }

  function startEdit(customer: Customer) {
    setEditingId(customer.id)
    setEditForm({
      company_name: customer.company_name || '',
      contact_name: customer.contact_name || '',
      phone: customer.phone || '',
      website: customer.website || '',
      plan: customer.plan || '',
      status: customer.status || '',
    })
  }

  const filtered = customers.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (c.company_name || '').toLowerCase().includes(q) ||
      (c.contact_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    )
  })

  return (
    <>
      {/* Actions row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Søk etter bedrift, kontakt, e-post..."
            style={{
              width: '100%', padding: '10px 16px 10px 38px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)', color: '#f0f0f0',
              fontSize: 14, outline: 'none', fontFamily: fonts.body, boxSizing: 'border-box',
            }}
          />
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={btnPrimary}>
          <Plus size={14} /> Ny kunde
        </button>
        <button onClick={onRefresh} style={btnSecondary}>
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ ...cardStyle, marginBottom: 16, border: `1px solid rgba(${goldRgb},0.2)` }}>
          <div style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Opprett ny kunde</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Bedriftsnavn *</label>
              <input value={createForm.company_name} onChange={e => setCreateForm({ ...createForm, company_name: e.target.value })} style={inputStyle} placeholder="Bedrift AS" />
            </div>
            <div>
              <label style={labelStyle}>Kontaktperson</label>
              <input value={createForm.contact_name} onChange={e => setCreateForm({ ...createForm, contact_name: e.target.value })} style={inputStyle} placeholder="Ola Nordmann" />
            </div>
            <div>
              <label style={labelStyle}>E-post</label>
              <input value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} style={inputStyle} placeholder="ola@bedrift.no" />
            </div>
            <div>
              <label style={labelStyle}>Telefon</label>
              <input value={createForm.phone} onChange={e => setCreateForm({ ...createForm, phone: e.target.value })} style={inputStyle} placeholder="+47 xxx xx xxx" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={handleCreate} disabled={creating || !createForm.company_name || !createForm.email} style={{ ...btnPrimary, opacity: (creating || !createForm.company_name) ? 0.5 : 1 }}>
              {creating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
              {creating ? 'Oppretter...' : 'Opprett'}
            </button>
            <button onClick={() => setShowCreate(false)} style={btnSecondary}>
              <X size={14} /> Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Customer list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, width: '30%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 11, width: '50%', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500, margin: '0 0 8px' }}>
            {customers.length === 0 ? 'Ingen kunder ennå' : 'Ingen treff'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(customer => {
            const expanded = expandedId === customer.id
            const isEditing = editingId === customer.id
            const actCalls = perCustomer?.calls[customer.id] || 0
            const actLeads = perCustomer?.leads[customer.id] || 0
            const actBookings = perCustomer?.bookings[customer.id] || 0
            const actWf = perCustomer?.workflows[customer.id] || 0

            return (
              <div key={customer.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${expanded ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 10, overflow: 'hidden',
              }}>
                {/* Header row */}
                <button
                  onClick={() => { setExpandedId(expanded ? null : customer.id); if (!expanded) setEditingId(null) }}
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 14,
                    fontFamily: fonts.body, textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `rgba(${goldRgb},0.08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Building2 size={16} color={gold} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 500 }}>
                      {customer.company_name || 'Uten navn'}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                      {[customer.contact_name, customer.email].filter(Boolean).join(' — ') || 'Ingen detaljer'}
                    </div>
                  </div>
                  {/* Mini activity badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {actCalls > 0 && <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>{actCalls} anrop</span>}
                    {actLeads > 0 && <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>{actLeads} leads</span>}
                    {actWf > 0 && <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `rgba(${goldRgb},0.1)`, color: gold }}>{actWf} auto</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: customer.status === 'active' ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)',
                      color: customer.status === 'active' ? '#4ade80' : 'rgba(255,255,255,0.4)',
                    }}>
                      {customer.status === 'active' ? 'Aktiv' : customer.status || 'Ukjent'}
                    </span>
                    {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
                  </div>
                </button>

                {/* Expanded details */}
                {expanded && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    {isEditing ? (
                      <div style={{ padding: '14px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={labelStyle}>Bedriftsnavn</label>
                            <input value={editForm.company_name || ''} onChange={e => setEditForm({ ...editForm, company_name: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Kontaktperson</label>
                            <input value={editForm.contact_name || ''} onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Telefon</label>
                            <input value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Nettside</label>
                            <input value={editForm.website || ''} onChange={e => setEditForm({ ...editForm, website: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Plan</label>
                            <input value={editForm.plan || ''} onChange={e => setEditForm({ ...editForm, plan: e.target.value })} style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Status</label>
                            <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                              <option value="active">Aktiv</option>
                              <option value="inactive">Inaktiv</option>
                              <option value="trial">Trial</option>
                              <option value="churned">Churnet</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                          <button onClick={() => handleSave(customer.id)} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                            {saving ? 'Lagrer...' : 'Lagre'}
                          </button>
                          <button onClick={() => { setEditingId(null); setEditForm({}) }} style={btnSecondary}>
                            <X size={14} /> Avbryt
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '14px 0' }}>
                        {/* Activity summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                          {[
                            { label: 'Anrop', value: actCalls, color: '#60a5fa' },
                            { label: 'Leads', value: actLeads, color: '#4ade80' },
                            { label: 'Bookinger', value: actBookings, color: '#a78bfa' },
                            { label: 'Automatiseringer', value: actWf, color: gold },
                          ].map((s, i) => (
                            <div key={i} style={{
                              background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px',
                              border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center',
                            }}>
                              <div style={{ color: s.color, fontSize: 18, fontWeight: 700 }}>{s.value}</div>
                              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Contact details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          {customer.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Mail size={14} color="rgba(255,255,255,0.3)" />
                              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <PhoneIcon size={14} color="rgba(255,255,255,0.3)" />
                              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{customer.phone}</span>
                            </div>
                          )}
                          {customer.website && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Globe size={14} color="rgba(255,255,255,0.3)" />
                              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{customer.website}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={14} color="rgba(255,255,255,0.3)" />
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Opprettet {formatDate(customer.created_at)}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 8, fontSize: 11,
                            background: customer.onboarding_complete ? 'rgba(74,222,128,0.08)' : 'rgba(250,204,21,0.08)',
                            color: customer.onboarding_complete ? '#4ade80' : '#facc15',
                          }}>
                            Onboarding: {customer.onboarding_complete ? 'Fullført' : 'Ikke fullført'}
                          </span>
                          {customer.plan && (
                            <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: `rgba(${goldRgb},0.08)`, color: gold }}>
                              {customer.plan}
                            </span>
                          )}
                          <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>
                            ID: {customer.id.slice(0, 8)}...
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                          <button onClick={(e) => { e.stopPropagation(); startEdit(customer) }} style={btnSecondary}>
                            <Edit3 size={14} /> Rediger
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(customer.id) }}
                            disabled={deleting === customer.id}
                            style={{ ...btnDanger, opacity: deleting === customer.id ? 0.5 : 1 }}
                          >
                            {deleting === customer.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                            Slett
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

// ============================================================
// Automations Tab
// ============================================================
function AutomationsTab({
  workflows, setWorkflows, customers, loading, onRefresh,
}: {
  workflows: Workflow[]
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>
  customers: Customer[]
  loading: boolean
  onRefresh: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ customer_id: '', workflow_name: '', automation_key: '', n8n_workflow_url: '' })
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  function getCustomerName(customerId: string) {
    const c = customers.find(c => c.id === customerId)
    return c?.company_name || c?.email || customerId.slice(0, 8) + '...'
  }

  async function handleCreate() {
    if (!createForm.customer_id || !createForm.workflow_name) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      if (res.ok) {
        const data = await res.json()
        setWorkflows(prev => [data.workflow, ...prev])
        setShowCreate(false)
        setCreateForm({ customer_id: '', workflow_name: '', automation_key: '', n8n_workflow_url: '' })
      }
    } catch (err) {
      console.error('Failed to create workflow:', err)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne automatiseringen?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/workflows?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setWorkflows(prev => prev.filter(w => w.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete workflow:', err)
    } finally {
      setDeleting(null)
    }
  }

  async function toggleStatus(wf: Workflow) {
    const newStatus = wf.workflow_status === 'active' ? 'inactive' : 'active'
    setUpdatingId(wf.id)
    try {
      const res = await fetch('/api/admin/workflows', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wf.id, workflow_status: newStatus }),
      })
      if (res.ok) {
        setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, workflow_status: newStatus } : w))
      }
    } catch (err) {
      console.error('Failed to update workflow:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = workflows.filter(w => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (w.workflow_name || '').toLowerCase().includes(q) ||
      (w.automation_key || '').toLowerCase().includes(q) ||
      getCustomerName(w.customer_id).toLowerCase().includes(q)
    )
  })

  const statusColor = (s: string) => {
    if (s === 'active') return { bg: 'rgba(74,222,128,0.1)', color: '#4ade80' }
    if (s === 'error') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' }
    if (s === 'paused') return { bg: 'rgba(250,204,21,0.1)', color: '#facc15' }
    return { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
  }

  const healthColor = (h: string) => {
    if (h === 'healthy') return '#4ade80'
    if (h === 'degraded') return '#facc15'
    if (h === 'failing' || h === 'offline') return '#ef4444'
    return 'rgba(255,255,255,0.25)'
  }

  return (
    <>
      {/* Actions row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Søk etter automatisering, kunde..."
            style={{
              width: '100%', padding: '10px 16px 10px 38px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)', color: '#f0f0f0',
              fontSize: 14, outline: 'none', fontFamily: fonts.body, boxSizing: 'border-box',
            }}
          />
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={btnPrimary}>
          <Plus size={14} /> Ny automatisering
        </button>
        <button onClick={onRefresh} style={btnSecondary}>
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ ...cardStyle, marginBottom: 16, border: `1px solid rgba(${goldRgb},0.2)` }}>
          <div style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Opprett ny automatisering</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Kunde *</label>
              <select
                value={createForm.customer_id}
                onChange={e => setCreateForm({ ...createForm, customer_id: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Velg kunde...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name || c.email || c.id.slice(0, 8)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Navn *</label>
              <input value={createForm.workflow_name} onChange={e => setCreateForm({ ...createForm, workflow_name: e.target.value })} style={inputStyle} placeholder="f.eks. AI Telefonsvarer" />
            </div>
            <div>
              <label style={labelStyle}>Automation key</label>
              <input value={createForm.automation_key} onChange={e => setCreateForm({ ...createForm, automation_key: e.target.value })} style={inputStyle} placeholder="f.eks. ai-receptionist" />
            </div>
            <div>
              <label style={labelStyle}>n8n URL</label>
              <input value={createForm.n8n_workflow_url} onChange={e => setCreateForm({ ...createForm, n8n_workflow_url: e.target.value })} style={inputStyle} placeholder="https://n8n.arxon.no/..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={handleCreate}
              disabled={creating || !createForm.customer_id || !createForm.workflow_name}
              style={{ ...btnPrimary, opacity: (creating || !createForm.customer_id || !createForm.workflow_name) ? 0.5 : 1 }}
            >
              {creating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
              {creating ? 'Oppretter...' : 'Opprett'}
            </button>
            <button onClick={() => setShowCreate(false)} style={btnSecondary}>
              <X size={14} /> Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Workflow list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 11, width: '30%', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Zap size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500, margin: '0 0 8px' }}>
            {workflows.length === 0 ? 'Ingen automatiseringer ennå' : 'Ingen treff'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(wf => {
            const sc = statusColor(wf.workflow_status)
            const hc = healthColor(wf.health_status)
            return (
              <div key={wf.id} style={{
                ...cardStyle,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `rgba(${goldRgb},0.08)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Zap size={16} color={gold} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 500 }}>{wf.workflow_name}</span>
                    {wf.automation_key && (
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}>
                        {wf.automation_key}
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>
                    {getCustomerName(wf.customer_id)} — {formatDate(wf.created_at)}
                  </div>
                  {wf.error_message && (
                    <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>
                      Feil: {wf.error_message}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {/* Health dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: hc,
                  }} title={`Helse: ${wf.health_status}`} />
                  {/* Status badge */}
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: sc.bg, color: sc.color,
                  }}>
                    {wf.workflow_status}
                  </span>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleStatus(wf)}
                    disabled={updatingId === wf.id}
                    title={wf.workflow_status === 'active' ? 'Pause' : 'Aktiver'}
                    style={{
                      padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                      color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: fonts.body,
                      opacity: updatingId === wf.id ? 0.5 : 1,
                    }}
                  >
                    {updatingId === wf.id ? '...' : wf.workflow_status === 'active' ? 'Pause' : 'Start'}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(wf.id)}
                    disabled={deleting === wf.id}
                    style={{
                      padding: 5, borderRadius: 6, border: 'none',
                      background: 'rgba(239,68,68,0.08)', cursor: 'pointer',
                      opacity: deleting === wf.id ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="Slett automatisering"
                  >
                    {deleting === wf.id
                      ? <Loader2 size={14} color="#ef4444" style={{ animation: 'spin 1s linear infinite' }} />
                      : <Trash2 size={14} color="#ef4444" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
