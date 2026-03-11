'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, getCalls } from '@/lib/dashboard'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { PhoneIncoming, PhoneMissed, Clock, Search, ChevronDown, ChevronUp, Bot, User, Tag, Calendar } from 'lucide-react'

interface TranscriptLine {
  speaker: 'ai' | 'caller'
  text: string
  time: string
}

interface CallRecord {
  id: string
  caller_name: string | null
  caller_number: string | null
  status: string
  duration_seconds: number | null
  summary: string | null
  sentiment: string | null
  outcome: string | null
  transcript: TranscriptLine[] | null
  created_at: string
}

const outcomeConfig: Record<string, { label: string; bg: string; color: string }> = {
  lead: { label: 'Lead', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  booking: { label: 'Booking', bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  info: { label: 'Info', bg: 'rgba(250,204,21,0.12)', color: '#facc15' },
  missed: { label: 'Tapt', bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  spam: { label: 'Irrelevant', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' },
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CallLogsPage() {
  const { user } = useAuth()
  const [calls, setCalls] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'missed'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const customer = await getCustomer()
        if (!customer || cancelled) { setLoading(false); return }
        const { data } = await getCalls(customer.id)
        if (!cancelled) setCalls(data as CallRecord[] || [])
      } catch (err) {
        console.error('Failed to load calls:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user])

  const filtered = calls.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const nameMatch = c.caller_name?.toLowerCase().includes(q)
      const numMatch = c.caller_number?.includes(searchQuery)
      if (!nameMatch && !numMatch) return false
    }
    return true
  })

  const stats = {
    total: calls.length,
    answered: calls.filter(c => c.status === 'answered').length,
    leads: calls.filter(c => c.outcome === 'lead').length,
    bookings: calls.filter(c => c.outcome === 'booking').length,
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 900, fontFamily: fonts.body }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>
          Alle innkommende anrop håndtert av AI-telefonsvareren
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ height: 28, background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 6 }} />
              <div style={{ height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 4, width: '60%', margin: '0 auto' }} />
            </div>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '14px 16px', marginBottom: 8,
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 4, width: '30%', marginBottom: 6 }} />
                <div style={{ height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          </div>
        ))}
        <style>{`@media (max-width: 640px) { div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, fontFamily: fonts.body }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>
        Alle innkommende anrop håndtert av AI-telefonsvareren
      </p>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Totalt', value: stats.total, color: gold },
          { label: 'Besvart', value: stats.answered, color: '#4ade80' },
          { label: 'Leads', value: stats.leads, color: '#60a5fa' },
          { label: 'Bookinger', value: stats.bookings, color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Søk på navn eller nummer..."
            style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: fonts.body, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3 }}>
          {([['all', 'Alle'], ['answered', 'Besvart'], ['missed', 'Tapte']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)}
              style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: filterStatus === val ? `rgba(${goldRgb},0.15)` : 'transparent', color: filterStatus === val ? gold : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Call list */}
      {calls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📞</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 4 }}>Ingen anrop ennå</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Anrop vil vises her når AI-telefonsvareren begynner å ta imot samtaler.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(call => {
            const expanded = expandedId === call.id
            const oc = outcomeConfig[call.outcome || (call.status === 'missed' ? 'missed' : 'info')] || outcomeConfig.info
            const transcript: TranscriptLine[] = Array.isArray(call.transcript) ? call.transcript : []
            const displayName = call.caller_name || 'Ukjent'
            const displayNumber = call.caller_number || ''
            const duration = formatDuration(call.duration_seconds)

            return (
              <div key={call.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${expanded ? `rgba(${goldRgb},0.2)` : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                <button onClick={() => setExpandedId(expanded ? null : call.id)}
                  style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, textAlign: 'left' }}>
                  {call.status === 'missed'
                    ? <PhoneMissed size={16} color="#f87171" />
                    : <PhoneIncoming size={16} color="#4ade80" />
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 500 }}>{displayName}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{displayNumber}</span>
                    </div>
                    {call.summary && (
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {call.summary}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: oc.bg, color: oc.color }}>{oc.label}</span>
                    {duration !== '—' && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {duration}
                      </span>
                    )}
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{formatTime(call.created_at)}</span>
                    {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
                  </div>
                </button>

                {expanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Summary bar */}
                    <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Tag size={13} color={gold} />
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Utfall:</span>
                        <span style={{ color: oc.color, fontSize: 12, fontWeight: 600 }}>{oc.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} color="rgba(255,255,255,0.4)" />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{formatDate(call.created_at)}</span>
                      </div>
                      {call.sentiment && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: call.sentiment === 'positive' ? '#4ade80' : call.sentiment === 'negative' ? '#f87171' : 'rgba(255,255,255,0.3)' }} />
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                            {call.sentiment === 'positive' ? 'Positiv' : call.sentiment === 'negative' ? 'Negativ' : 'Nøytral'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* AI Summary */}
                    {call.summary && (
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Bot size={13} /> AI-oppsummering
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{call.summary}</p>
                      </div>
                    )}

                    {/* Transcript */}
                    {transcript.length > 0 && (
                      <div style={{ padding: '16px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                          Transkripsjon
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {transcript.map((line, i) => (
                            <div key={i} style={{
                              display: 'flex',
                              flexDirection: line.speaker === 'ai' ? 'row' : 'row-reverse',
                              gap: 10, alignItems: 'flex-start',
                            }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: line.speaker === 'ai' ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.08)',
                              }}>
                                {line.speaker === 'ai'
                                  ? <Bot size={14} color={gold} />
                                  : <User size={14} color="rgba(255,255,255,0.5)" />
                                }
                              </div>
                              <div style={{
                                maxWidth: '75%',
                                background: line.speaker === 'ai' ? `rgba(${goldRgb},0.06)` : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${line.speaker === 'ai' ? `rgba(${goldRgb},0.1)` : 'rgba(255,255,255,0.06)'}`,
                                borderRadius: line.speaker === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                                padding: '10px 14px',
                              }}>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{line.text}</p>
                                {line.time && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 4, display: 'block' }}>{line.time}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {transcript.length === 0 && (
                      <div style={{ padding: '30px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                        Ingen transkripsjon tilgjengelig for dette anropet
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              Ingen anrop funnet
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
