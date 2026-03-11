'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, getLeads } from '@/lib/dashboard'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { Search, Star, Phone, Mail, Building2, MapPin, ChevronDown, ChevronUp } from 'lucide-react'

interface LeadRecord {
  id: string
  name: string | null
  company: string | null
  phone: string | null
  email: string | null
  industry: string | null
  location: string | null
  score: number | null
  status: string | null
  source: string | null
  notes: string | null
  created_at: string
}

const statusConfig: Record<string, { label: string, bg: string, color: string }> = {
  hot: { label: 'Varm', bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  warm: { label: 'Lun', bg: 'rgba(250,204,21,0.12)', color: '#facc15' },
  cold: { label: 'Kald', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function LeadsPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const customer = await getCustomer()
        if (!customer || cancelled) { setLoading(false); return }
        const { data } = await getLeads(customer.id)
        if (!cancelled) setLeads(data as LeadRecord[] || [])
      } catch (err) {
        console.error('Failed to load leads:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user])

  const filtered = leads.filter(l => {
    const st = l.status || 'cold'
    if (filterStatus !== 'all' && st !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        (l.name || '').toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q) ||
        (l.industry || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div style={{ maxWidth: 900, fontFamily: fonts.body }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>
        Leads fanget og kvalifisert av AI
      </p>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Søk leads..."
            style={{
              width: '100%', padding: '10px 16px 10px 38px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)', color: '#f0f0f0',
              fontSize: 14, outline: 'none', fontFamily: fonts.body, boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3 }}>
          {([['all', 'Alle'], ['hot', 'Varme'], ['warm', 'Lune'], ['cold', 'Kalde']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none',
              background: filterStatus === val ? `rgba(${goldRgb},0.15)` : 'transparent',
              color: filterStatus === val ? gold : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads list */}
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
              <div style={{ height: 22, width: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 && leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👥</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500, margin: '0 0 8px' }}>
            Ingen leads ennå
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
            Leads vil vises her når AI-en fanger og kvalifiserer nye potensielle kunder.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(lead => {
            const expanded = expandedId === lead.id
            const st = statusConfig[lead.status || 'cold'] || statusConfig.cold
            return (
              <div key={lead.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${expanded ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 10, overflow: 'hidden',
              }}>
                <button
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
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
                    <div style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 500 }}>{lead.name || 'Ukjent'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                      {[lead.company, lead.industry].filter(Boolean).join(' · ') || 'Ingen detaljer'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {lead.score != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={14} color="#facc15" fill="#facc15" />
                        <span style={{ color: '#f0f0f0', fontSize: 13, fontWeight: 600 }}>{lead.score}</span>
                      </div>
                    )}
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
                  </div>
                </button>

                {expanded && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ padding: '14px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {lead.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Phone size={14} color="rgba(255,255,255,0.3)" />
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{lead.phone}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Mail size={14} color="rgba(255,255,255,0.3)" />
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{lead.email}</span>
                        </div>
                      )}
                      {lead.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <MapPin size={14} color="rgba(255,255,255,0.3)" />
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{lead.location}</span>
                        </div>
                      )}
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                        {lead.source ? `Kilde: ${lead.source} · ` : ''}{formatDate(lead.created_at)}
                      </div>
                    </div>
                    {lead.notes && (
                      <div style={{
                        background: 'rgba(255,255,255,0.02)', borderRadius: 8,
                        padding: '12px 14px', marginTop: 4,
                      }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                          AI-notater
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                          {lead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && leads.length > 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              Ingen leads funnet for dette søket
            </div>
          )}
        </div>
      )}
    </div>
  )
}
