'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { gold, goldRgb, fonts } from '@/lib/constants'
import {
  Users, Search, ChevronDown, ChevronUp, Mail, Phone,
  Globe, Building2, Calendar, Edit3, Save, X, Loader2, Shield
} from 'lucide-react'

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

const ADMIN_EMAILS = ['kontakt@arxon.no']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function AdminPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Customer>>({})
  const [saving, setSaving] = useState(false)

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email)

  useEffect(() => {
    if (!user || !isAdmin) return
    fetchCustomers()
  }, [user, isAdmin])

  async function fetchCustomers() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      if (res.ok) setCustomers(data.customers || [])
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    } finally {
      setLoading(false)
    }
  }

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
        setCustomers(prev =>
          prev.map(c => c.id === id ? { ...c, ...data.customer } : c)
        )
        setEditingId(null)
        setEditForm({})
      }
    } catch (err) {
      console.error('Failed to update customer:', err)
    } finally {
      setSaving(false)
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px',
    borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: '#f0f0f0',
    fontSize: 13, outline: 'none', fontFamily: fonts.body,
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
    display: 'block', marginBottom: 4, textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  return (
    <div style={{ maxWidth: 900, fontFamily: fonts.body }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>
        Administrer alle kunder og kontoer
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Totalt kunder', value: loading ? '—' : customers.length },
          { label: 'Aktive', value: loading ? '—' : customers.filter(c => c.status === 'active').length },
          { label: 'Onboardet', value: loading ? '—' : customers.filter(c => c.onboarding_complete).length },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ color: '#f0f0f0', fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Sok etter bedrift, kontakt, e-post..."
          style={{
            width: '100%', padding: '10px 16px 10px 38px',
            borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)', color: '#f0f0f0',
            fontSize: 14, outline: 'none', fontFamily: fonts.body, boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Customer list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
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
            {customers.length === 0 ? 'Ingen kunder ennaa' : 'Ingen treff'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(customer => {
            const expanded = expandedId === customer.id
            const isEditing = editingId === customer.id
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {customer.plan && (
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: `rgba(${goldRgb},0.1)`, color: gold,
                      }}>
                        {customer.plan}
                      </span>
                    )}
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
                      /* Edit mode */
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
                            <select
                              value={editForm.status || ''}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                              style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                              <option value="active">Aktiv</option>
                              <option value="inactive">Inaktiv</option>
                              <option value="trial">Trial</option>
                              <option value="churned">Churnet</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                          <button
                            onClick={() => handleSave(customer.id)}
                            disabled={saving}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 8, border: 'none',
                              background: `linear-gradient(135deg, ${gold}, #d4a85a)`,
                              color: '#0f1b27', fontWeight: 600, fontSize: 13,
                              cursor: saving ? 'not-allowed' : 'pointer',
                              opacity: saving ? 0.6 : 1, fontFamily: fonts.body,
                            }}
                          >
                            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                            {saving ? 'Lagrer...' : 'Lagre'}
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditForm({}) }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 8,
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'transparent', color: 'rgba(255,255,255,0.5)',
                              fontSize: 13, cursor: 'pointer', fontFamily: fonts.body,
                            }}
                          >
                            <X size={14} /> Avbryt
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div style={{ padding: '14px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          {customer.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Mail size={14} color="rgba(255,255,255,0.3)" />
                              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Phone size={14} color="rgba(255,255,255,0.3)" />
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
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                              Opprettet {formatDate(customer.created_at)}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 8, fontSize: 11,
                            background: customer.onboarding_complete ? 'rgba(74,222,128,0.08)' : 'rgba(250,204,21,0.08)',
                            color: customer.onboarding_complete ? '#4ade80' : '#facc15',
                          }}>
                            Onboarding: {customer.onboarding_complete ? 'Fullfort' : 'Ikke fullfort'}
                          </span>
                          <span style={{
                            padding: '4px 10px', borderRadius: 8, fontSize: 11,
                            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)',
                          }}>
                            ID: {customer.id.slice(0, 8)}...
                          </span>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(customer) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 14px', borderRadius: 8, marginTop: 14,
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'transparent', color: 'rgba(255,255,255,0.5)',
                            fontSize: 13, cursor: 'pointer', fontFamily: fonts.body,
                          }}
                        >
                          <Edit3 size={14} /> Rediger
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
