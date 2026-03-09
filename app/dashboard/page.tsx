'use client'

import { useState, useEffect } from 'react'
import { gold, goldRgb, fonts } from '@/lib/constants'
import {
  Phone, PhoneIncoming, PhoneMissed, Users, CalendarCheck,
  TrendingUp, Clock, ArrowUpRight, ArrowDownRight, BarChart3,
  Activity, Zap, CheckCircle, AlertCircle, Bot, ArrowRight
} from 'lucide-react'

// Demo data
const demoStats = {
  totalCalls: 342,
  answeredCalls: 318,
  missedCalls: 24,
  leadsCaptures: 87,
  bookingsMade: 43,
  avgResponseTime: '1.2s',
  callsChange: 12,
  leadsChange: 8,
  bookingsChange: -3,
}

const todayStats = {
  calls: 14,
  answered: 13,
  leads: 4,
  bookings: 2,
  saved: '1 240 kr',
  timeSaved: '2.5 timer',
}

interface ChartData {
  day: string
  calls: number
  leads: number
  bookings: number
}

const weeklyData: ChartData[] = [
  { day: 'Man', calls: 52, leads: 14, bookings: 7 },
  { day: 'Tir', calls: 48, leads: 12, bookings: 6 },
  { day: 'Ons', calls: 61, leads: 18, bookings: 9 },
  { day: 'Tor', calls: 44, leads: 10, bookings: 5 },
  { day: 'Fre', calls: 55, leads: 15, bookings: 8 },
  { day: 'L\u00f8r', calls: 32, leads: 8, bookings: 3 },
  { day: 'S\u00f8n', calls: 18, leads: 4, bookings: 2 },
]

const hourlyActivity = [
  0,0,0,0,0,0,0,1,4,8,12,9,6,10,14,11,7,5,3,1,0,0,0,0
]

const recentActivity = [
  { type: 'call', text: 'Innkommende anrop fra +47 912 34 567 \u2014 Lead kvalifisert', time: '2 min siden', status: 'answered' },
  { type: 'booking', text: 'M\u00f8te booket: Onsdag 12. mars kl. 14:00', time: '8 min siden', status: 'confirmed' },
  { type: 'lead', text: 'Ny lead: Byggmester Hansen AS \u2014 \u00f8nsker demo', time: '15 min siden', status: 'new' },
  { type: 'call', text: 'Anrop fra +47 456 78 901 \u2014 Eksisterende kunde, fakturasprsm\u00e5l', time: '22 min siden', status: 'answered' },
  { type: 'call', text: 'Ubesvart anrop fra +47 987 65 432', time: '1 time siden', status: 'missed' },
  { type: 'lead', text: 'Lead kvalifisert: Salong Bella \u2014 5 ansatte, timebestilling', time: '2 timer siden', status: 'qualified' },
]

const automations = [
  { name: 'AI-telefonsvarer', status: 'active', uptime: '99.8%', calls: 342 },
  { name: 'Auto-booking', status: 'active', uptime: '99.5%', calls: 43 },
  { name: 'Lead-kvalifisering', status: 'active', uptime: '100%', calls: 87 },
  { name: 'Chatbot', status: 'setup', uptime: '\u2014', calls: 0 },
]

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
        {change !== undefined && (
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

function MiniBarChart({ data, dataKey, color }: {
  data: ChartData[], dataKey: keyof Omit<ChartData, 'day'>, color: string
}) {
  const maxVal = Math.max(...data.map(d => d[dataKey]))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
      {data.map((d, i) => {
        const val = d[dataKey]
        const height = maxVal > 0 ? (val / maxVal) * 100 : 0
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{val}</div>
            <div style={{
              width: '100%', height: `${height}%`, minHeight: 4,
              background: color, borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease',
            }} />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{d.day}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function DashboardOverview() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [currentTime, setCurrentTime] = useState('')
  const [greeting, setGreeting] = useState('')

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

  const maxHourly = Math.max(...hourlyActivity)

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
            {greeting} \ud83d\udc4b
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>
            Her er en oppsummering av AI-assistenten din i dag.
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
            { label: 'Anrop', value: todayStats.calls, icon: Phone },
            { label: 'Besvart', value: todayStats.answered, icon: PhoneIncoming },
            { label: 'Leads', value: todayStats.leads, icon: Users },
            { label: 'Bookinger', value: todayStats.bookings, icon: CalendarCheck },
            { label: 'Spart', value: todayStats.saved, icon: TrendingUp },
            { label: 'Tid spart', value: todayStats.timeSaved, icon: Clock },
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

      {/* Period toggle + Stats */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
      }}>
        <h2 style={{ color: '#f0f0f0', fontSize: 16, fontWeight: 600, margin: 0 }}>
          Ukeoversikt
        </h2>
        <div style={{
          display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)',
          borderRadius: 8, padding: 3,
        }}>
          {(['week', 'month'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '6px 14px', borderRadius: 6, border: 'none',
              background: period === p ? `rgba(${goldRgb},0.15)` : 'transparent',
              color: period === p ? gold : 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
            }}>
              {p === 'week' ? 'Uke' : 'M\u00e5ned'}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        <StatCard icon={PhoneIncoming} label="Besvarte anrop" value={demoStats.answeredCalls} change={demoStats.callsChange} />
        <StatCard icon={PhoneMissed} label="Tapte anrop" value={demoStats.missedCalls} iconColor="#f87171" />
        <StatCard icon={Users} label="Leads fanget" value={demoStats.leadsCaptures} change={demoStats.leadsChange} iconColor="#60a5fa" />
        <StatCard icon={CalendarCheck} label="Bookinger" value={demoStats.bookingsMade} change={demoStats.bookingsChange} iconColor="#a78bfa" />
        <StatCard icon={Clock} label="Snitt responstid" value={demoStats.avgResponseTime} />
        <StatCard icon={TrendingUp} label="Svarprosent" value="93" suffix="%" iconColor="#4ade80" />
      </div>

      {/* Charts + Hourly heatmap */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart3 size={16} color={gold} />
            <span style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600 }}>Anrop denne uken</span>
          </div>
          <MiniBarChart data={weeklyData} dataKey="calls" color={`rgba(${goldRgb},0.6)`} />
        </div>

        {/* Hourly activity heatmap */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={16} color="#60a5fa" />
            <span style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600 }}>Aktivitet per time (i dag)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
            {hourlyActivity.map((val, i) => {
              const height = maxHourly > 0 ? (val / maxHourly) * 100 : 0
              const opacity = val === 0 ? 0.1 : 0.3 + (val / maxHourly) * 0.7
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', height: `${Math.max(height, 4)}%`, minHeight: 4,
                    background: `rgba(${goldRgb},${opacity})`,
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease',
                  }} />
                  {i % 4 === 0 && (
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                      {String(i).padStart(2, '0')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
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
                  {a.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automations status */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '20px',
        }}>
          <h3 style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>
            Dine automatiseringer
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {automations.map((a, i) => (
              <div key={i} style={{
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
                    {a.uptime !== '\u2014' && (
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                        Oppetid: {a.uptime} \u00b7 {a.calls} behandlet
                      </div>
                    )}
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
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1.5fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
