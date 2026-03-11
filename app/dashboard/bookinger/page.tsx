'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, getBookings } from '@/lib/dashboard'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { Clock, Video, Phone as PhoneIcon } from 'lucide-react'

interface BookingRecord {
  id: string
  client_name: string | null
  client_company: string | null
  booking_type: string | null
  meeting_date: string | null
  start_time: string | null
  end_time: string | null
  method: string | null
  status: string | null
  booked_via: string | null
  notes: string | null
  created_at: string
}

const typeColors: Record<string, { bg: string, color: string }> = {
  Demo: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  Kartlegging: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  Oppfølging: { bg: `rgba(${goldRgb},0.12)`, color: gold },
  Implementering: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
}

function formatDateBlock(dateStr: string | null) {
  if (!dateStr) return { day: '—', month: '' }
  const d = new Date(dateStr)
  const day = d.getDate().toString()
  const month = d.toLocaleDateString('nb-NO', { month: 'short' }).replace('.', '')
  return { day, month }
}

function formatTimeRange(start: string | null, end: string | null) {
  if (!start) return '—'
  const s = start.slice(0, 5)
  if (!end) return s
  return `${s} – ${end.slice(0, 5)}`
}

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const customer = await getCustomer()
        if (!customer || cancelled) { setLoading(false); return }
        const { data } = await getBookings(customer.id)
        if (!cancelled) setBookings(data as BookingRecord[] || [])
      } catch (err) {
        console.error('Failed to load bookings:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user])

  const filtered = bookings.filter(b => filterType === 'all' || b.booking_type === filterType)

  // Compute stats from live data
  const now = new Date()
  const weekFromNow = new Date(now)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    thisWeek: bookings.filter(b => {
      if (!b.meeting_date) return false
      const d = new Date(b.meeting_date)
      return d >= now && d <= weekFromNow
    }).length,
    aiBooked: bookings.filter(b => b.booked_via === 'AI-telefonsvarer').length,
  }

  // Collect unique booking types for filter buttons
  const bookingTypes = Array.from(new Set(bookings.map(b => b.booking_type).filter(Boolean))) as string[]

  return (
    <div style={{ maxWidth: 900, fontFamily: fonts.body }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>
        Kommende møter booket av AI og manuelt
      </p>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Totalt', value: loading ? '—' : stats.total },
          { label: 'Bekreftet', value: loading ? '—' : stats.confirmed },
          { label: 'Denne uken', value: loading ? '—' : stats.thisWeek },
          { label: 'AI-booket', value: loading ? '—' : stats.aiBooked },
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

      {/* Filter */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilterType('all')} style={{
          padding: '8px 14px', borderRadius: 6, border: 'none',
          background: filterType === 'all' ? `rgba(${goldRgb},0.15)` : 'transparent',
          color: filterType === 'all' ? gold : 'rgba(255,255,255,0.4)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
        }}>
          Alle
        </button>
        {bookingTypes.map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={{
            padding: '8px 14px', borderRadius: 6, border: 'none',
            background: filterType === t ? `rgba(${goldRgb},0.15)` : 'transparent',
            color: filterType === t ? gold : 'rgba(255,255,255,0.4)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: 16,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 11, width: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📅</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500, margin: '0 0 8px' }}>
            Ingen bookinger ennå
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
            Bookinger vil vises her når AI-en begynner å avtale møter for deg.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(booking => {
            const tc = typeColors[booking.booking_type || 'Demo'] || { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
            const dateBlock = formatDateBlock(booking.meeting_date)
            return (
              <div key={booking.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                {/* Date block */}
                <div style={{
                  width: 56, height: 56, borderRadius: 10,
                  background: `rgba(${goldRgb},0.06)`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ color: gold, fontSize: 16, fontWeight: 700 }}>
                    {dateBlock.day}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textTransform: 'uppercase' }}>
                    {dateBlock.month}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 500 }}>{booking.client_name || 'Ukjent'}</span>
                    {booking.client_company && (
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>— {booking.client_company}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      <Clock size={12} /> {formatTimeRange(booking.start_time, booking.end_time)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      {booking.method === 'video' ? <Video size={12} /> : <PhoneIcon size={12} />}
                      {booking.method === 'video' ? 'Videomøte' : 'Telefonmøte'}
                    </span>
                    {booking.booked_via && (
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
                        via {booking.booked_via}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {booking.booking_type && (
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color }}>
                      {booking.booking_type}
                    </span>
                  )}
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: booking.status === 'confirmed' ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)',
                    color: booking.status === 'confirmed' ? '#4ade80' : '#facc15',
                  }}>
                    {booking.status === 'confirmed' ? 'Bekreftet' : 'Venter'}
                  </span>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && bookings.length > 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              Ingen bookinger funnet for denne typen
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          div[style*="display: flex"][style*="gap: 16"] { flex-direction: column !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  )
}
