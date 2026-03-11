'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, getCallStats, getRecentActivity, getAutomations, getLeads, getBookings } from '@/lib/dashboard'
import { gold, goldRgb, fonts } from '@/lib/constants'
import {
  Phone, PhoneIncoming, PhoneMissed, Users, CalendarCheck,
  TrendingUp, Clock, ArrowUpRight, ArrowDownRight, BarChart3,
  Activity, Zap, CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react'

interface CallStats {
  total: number
  answered: number
  missed: number
  avgDurationSeconds: number
  answerRate: number
}

interface ActivityItem {
  type: 'call' | 'lead' | 'booking'
  text: string
  status: string
  time: string
}

interface Automation {
  id: string
  name: string
  status: string
  type: string
  created_at: string
}

function StatCard({ icon: Icon, label, value, change, suffix = '', iconColor }: {
  icon: any, label: string, value: string | number, change?: number, suffix?: string, iconColor?: string
}) {
  const positive = change && change > 0
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: iconColor ? `${iconColor}15` : `rgba(${goldRgb},0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={iconColor || gold} />
        </div>
        {change !== undefined && change !== 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 600,
            color: positive ? '#4ade80' : '#f87171',
          }}>
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div style={{ color: '#f0f0f0', fontSize: 28, fontWeight: 700 }}>
        {value}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Akkurat nå'
  if (mins < 60) return `${mins} min siden`
  if (hours < 24) return `${hours} timer siden`
  if (days < 7) return `${days} dager siden`
  return date.toLocaleDateString('nb-NO')
}

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: 1100, fontFamily: fonts.body }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ height: 28, width: 200, background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 16, width: 300, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }} />
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 20, height: 120,
          }}>
            <div style={{ height: 36, width: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 12 }} />
            <div style={{ height: 28, width: 60, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: 6 }} />
            <div style={{ height: 14, width: 100, background: 'rgba(255,255,255,0.03)', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardOverview() {
  const { user } = useAuth()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [callStats, setCallStats] = useState<CallStats | null>(null)
  const [todayStats, setTodayStats] = useState<CallStats | null>(null)
  const [leadsCount, setLeadsCount] = useState(0)
  const [bookingsCount, setBookingsCount] = useState(0)
  const [todayLeads, setTodayLeads] = useState(0)
  const [todayBookings, setTodayBookings] = useState(0)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [automationsList, setAutomationsList] = useState<Automation[]>([])

  const [currentTime, setCurrentTime] = useState('')
  const [greeting, setGreeting] = useState('')

  // Clock + greeting
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours()
      setGreeting(h < 12 ? 'God morgen' : h < 17 ? 'God ettermiddag' : 'God kveld')
      setCurrentTime(now.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fetch all data
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function loadData() {
      setLoading(true)
      try {
        const customer = await getCustomer()
        if (!customer || cancelled) {
          setLoading(false)
          return
        }
        setCustomerId(customer.id)

        // Fetch everything in parallel
        const [stats7d, stats1d, leadsRes, bookingsRes, activity, autoRes] = await Promise.all([
          getCallStats(customer.id, 7),
          getCallStats(customer.id, 1),
          getLeads(customer.id),
          getBookings(customer.id),
          getRecentActivity(customer.id, 8),
          getAutomations(customer.id),
        ])

        if (cancelled) return

        setCallStats(stats7d)
        setTodayStats(stats1d)
        setLeadsCount(leadsRes.data?.length || 0)
        setBookingsCount(bookingsRes.data?.length || 0)

        // Today's leads and bookings
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const todayISO = todayStart.toISOString()
        setTodayLeads((leadsRes.data || []).filter((l: any) => l.created_at >= todayISO).length)
        setTodayBookings((bookingsRes.data || []).filter((b: any) => b.created_at >= todayISO).length)

        setRecentActivity(activity)
        setAutomationsList(autoRes.data || [])
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()
    return () => { cancelled = true }
  }, [user])

  if (loading) return <LoadingSkeleton />

  const hasData = callStats && callStats.total > 0

  return (
    <div style={{ maxWidth: 1100, fontFamily: fonts.body }}>

      {/* Hero greeting */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{
            color: '#f0f0f0', fontSize: 24, fontWeight: 700,
            margin: 0, fontFamily: fonts.heading,
          }}>
            {greeting} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>
            {hasData
              ? 'Her er en oppsummering av AI-assistenten din.'
              : 'Velkommen! Koble til integrasjoner for å komme i gang.'
            }
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 20,
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.2)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 8px rgba(74,222,128,0.6)',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>
            AI aktiv
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            {currentTime}
          </span>
        </div>
      </div>

      {/* Today summary card */}
      {todayStats && (
        <div style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.08) 0%, rgba(${goldRgb},0.02) 100%)`,
          border: `1px solid rgba(${goldRgb},0.15)`,
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          }}>
            <Zap size={16} color={gold} />
            <span style={{ color: gold, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              I dag
            </span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 16,
          }}>
            {[
              { label: 'Anrop', value: todayStats.total, icon: Phone },
              { label: 'Besvart', value: todayStats.answered, icon: PhoneIncoming },
              { label: 'Leads', value: todayLeads, icon: Users },
              { label: 'Bookinger', value: todayBookings, icon: CalendarCheck },
              { label: 'Svarprosent', value: todayStats.answerRate > 0 ? `${todayStats.answerRate}%` : '—', icon: TrendingUp },
              { label: 'Snitt varighet', value: todayStats.avgDurationSeconds > 0 ? `${todayStats.avgDurationSeconds}s` : '—', icon: Clock },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: '#f0f0f0', fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4,
                }}>
                  <s.icon size={12} />
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats cards */}
      <h2 style={{ color: '#f0f0f0', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
        Siste 7 dager
      </h2>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        <StatCard icon={PhoneIncoming} label="Besvarte anrop" value={callStats?.answered || 0} />
        <StatCard icon={PhoneMissed} label="Tapte anrop" value={callStats?.missed || 0} iconColor="#f87171" />
        <StatCard icon={Users} label="Leads fanget" value={leadsCount} iconColor="#60a5fa" />
        <StatCard icon={CalendarCheck} label="Bookinger" value={bookingsCount} iconColor="#a78bfa" />
        <StatCard icon={Clock} label="Snitt varighet" value={callStats?.avgDurationSeconds ? `${callStats.avgDurationSeconds}s` : '—'} />
        <StatCard icon={TrendingUp} label="Svarprosent" value={callStats?.answerRate || 0} suffix="%" iconColor="#4ade80" />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        {/* Recent activity */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '20px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
          }}>
            <h3 style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600, margin: 0 }}>
              Siste aktivitet
            </h3>
            <a href="/dashboard/anrop" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: gold, fontSize: 12, textDecoration: 'none', fontWeight: 500,
            }}>
              Se alle <ArrowRight size={12} />
            </a>
          </div>
          {recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Activity size={24} color="rgba(255,255,255,0.15)" style={{ marginBottom: 8 }} />
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
                Ingen aktivitet ennå
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: a.status === 'missed' ? '#f87171'
                      : a.status === 'new' ? '#60a5fa'
                      : a.status === 'qualified' ? '#a78bfa'
                      : '#4ade80',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: 'rgba(255,255,255,0.7)', fontSize: 13,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {a.text}
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatTimeAgo(a.time)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Automations status */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '20px',
        }}>
          <h3 style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>
            Dine automatiseringer
          </h3>
          {automationsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Zap size={24} color="rgba(255,255,255,0.15)" style={{ marginBottom: 8 }} />
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>
                Ingen automatiseringer ennå
              </p>
              <a href="/dashboard/automatiseringer" style={{
                display: 'inline-block', marginTop: 12,
                color: gold, fontSize: 12, textDecoration: 'none', fontWeight: 500,
              }}>
                Sett opp automatiseringer →
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {automationsList.map((a) => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                  borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: a.status === 'active' ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {a.status === 'active'
                        ? <CheckCircle size={14} color="#4ade80" />
                        : <AlertCircle size={14} color="#facc15" />
                      }
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>
                        {a.name}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                        {a.type || 'Automatisering'}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: a.status === 'active' ? 'rgba(74,222,128,0.12)' : 'rgba(250,204,21,0.12)',
                    color: a.status === 'active' ? '#4ade80' : '#facc15',
                  }}>
                    {a.status === 'active' ? 'Aktiv' : 'Oppsett'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1.5fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
