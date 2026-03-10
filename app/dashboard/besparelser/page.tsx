'use client'

import { useState, useEffect } from 'react'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { Phone, Clock, Calendar, User, Activity, Loader2, PhoneCall, CalendarCheck, UserCheck } from 'lucide-react'

interface ActivityData {
  totalCalls: number
  totalLeads: number
  totalBookings: number
  totalActivities: number
  totalDurationSeconds: number
  avgDurationSeconds: number
  customerSince: string
  customerName: string
  recentActivities: {
    id: string
    type: string
    duration_seconds: number
    created_at: string
    summary: string | null
    name: string | null
    phone: string | null
  }[]
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return seconds + 's'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m < 60) return m + 'min ' + (s > 0 ? s + 's' : '')
  const h = Math.floor(m / 60)
  return h + 't ' + (m % 60) + 'min'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins + ' min siden'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + ' timer siden'
  const days = Math.floor(hrs / 24)
  if (days < 7) return days + (days === 1 ? ' dag' : ' dager') + ' siden'
  return formatDate(iso)
}

function typeLabel(type: string): string {
  switch (type) {
    case 'phone_call': return 'Telefonsamtale'
    case 'lead_qualified': return 'Lead kvalifisert'
    case 'booking_created': return 'Booking opprettet'
    default: return type
  }
}

function typeIcon(type: string) {
  switch (type) {
    case 'phone_call': return PhoneCall
    case 'lead_qualified': return UserCheck
    case 'booking_created': return CalendarCheck
    default: return Activity
  }
}

export default function BesparelserPage() {
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const orderRes = await fetch('/api/customer/order')
        if (!orderRes.ok) throw new Error('Kunne ikke hente kundedata')
        const { order } = await orderRes.json()

        const savingsRes = await fetch(`/api/savings?customer_id=${order.id}`)
        if (!savingsRes.ok) throw new Error('Kunne ikke hente aktivitetsdata')
        const result = await savingsRes.json()
        setData(result)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2
            size={40}
            style={{ color: gold, animation: 'spin 1s linear infinite' }}
          />
          <p style={{ color: '#999', marginTop: 16 }}>Henter aktivitetsdata...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts
      }}>
        <div style={{
          background: 'rgba(255,59,48,0.1)',
          border: '1px solid rgba(255,59,48,0.3)',
          borderRadius: 12,
          padding: '24px 32px',
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <p style={{ color: '#ff3b30', fontWeight: 600, marginBottom: 8 }}>
            Kunne ikke laste data
          </p>
          <p style={{ color: '#999', fontSize: 14 }}>{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const stats = [
    {
      label: 'Samtaler h\u00e5ndtert',
      value: data.totalCalls.toString(),
      icon: PhoneCall,
      sub: 'Totalt antall AI-samtaler'
    },
    {
      label: 'Total samtaletid',
      value: formatDuration(data.totalDurationSeconds),
      icon: Clock,
      sub: `Snitt ${formatDuration(data.avgDurationSeconds)} per samtale`
    },
    {
      label: 'Leads kvalifisert',
      value: data.totalLeads.toString(),
      icon: UserCheck,
      sub: 'Kvalifiserte leads fra AI'
    },
    {
      label: 'Kunde siden',
      value: formatDate(data.customerSince),
      icon: Calendar,
      sub: data.customerName
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: bg,
      padding: '32px 24px',
      fontFamily: fonts
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 4
          }}>
            Aktivitetsoversikt
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>
            Sanntidsdata fra dine AI-automatiseringer
          </p>
        </div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid rgba(${goldRgb}, 0.15)`,
                borderRadius: 12,
                padding: '20px 20px 16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12
                }}>
                  <Icon size={18} style={{ color: gold, opacity: 0.8 }} />
                  <span style={{ color: '#888', fontSize: 13 }}>{s.label}</span>
                </div>
                <div style={{
                  color: '#fff',
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 4
                }}>
                  {s.value}
                </div>
                <div style={{ color: '#666', fontSize: 12 }}>{s.sub}</div>
              </div>
            )
          })}
        </div>

        {/* Activity feed */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid rgba(${goldRgb}, 0.1)`,
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Activity size={16} style={{ color: gold }} />
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
              Siste aktiviteter
            </span>
            <span style={{ color: '#666', fontSize: 13, marginLeft: 'auto' }}>
              {data.totalActivities} totalt
            </span>
          </div>

          {data.recentActivities.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#666' }}>Ingen aktiviteter registrert enn\u00e5</p>
            </div>
          ) : (
            data.recentActivities.map((a, i) => {
              const Icon = typeIcon(a.type)
              return (
                <div key={a.id} style={{
                  padding: '14px 20px',
                  borderBottom: i < data.recentActivities.length - 1
                    ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `rgba(${goldRgb}, 0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    <Icon size={16} style={{ color: gold }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2
                    }}>
                      <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>
                        {typeLabel(a.type)}
                      </span>
                      {a.duration_seconds > 0 && (
                        <span style={{
                          color: '#666',
                          fontSize: 12,
                          background: 'rgba(255,255,255,0.05)',
                          padding: '1px 6px',
                          borderRadius: 4
                        }}>
                          {formatDuration(a.duration_seconds)}
                        </span>
                      )}
                    </div>
                    {(a.name || a.phone) && (
                      <div style={{ color: '#aaa', fontSize: 13, marginBottom: 2 }}>
                        {a.name}{a.name && a.phone ? ' \u00b7 ' : ''}{a.phone}
                      </div>
                    )}
                    {a.summary && (
                      <div style={{
                        color: '#777',
                        fontSize: 13,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {a.summary}
                      </div>
                    )}
                  </div>
                  <div style={{
                    color: '#555',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    {timeAgo(a.created_at)}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '24px 0 16px',
          color: '#555',
          fontSize: 12
        }}>
          Alle tall er basert p\u00e5 faktiske data fra dine automatiseringer
        </div>
      </div>
    </div>
  )
}
