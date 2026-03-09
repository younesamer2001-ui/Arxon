'use client'

import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Clock, PiggyBank, Bot, Phone, Users, CalendarCheck, ArrowRight, Zap } from 'lucide-react'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'

// === ANIMATED COUNTER HOOK ===
function useAnimatedCounter(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(parseFloat((eased * end).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, decimals])

  return { count, ref }
}

// === DEMO DATA ===
const monthlyData = [
  { month: 'Okt', saved: 12400, calls: 340 },
  { month: 'Nov', saved: 18200, calls: 490 },
  { month: 'Des', saved: 15800, calls: 420 },
  { month: 'Jan', saved: 22100, calls: 580 },
  { month: 'Feb', saved: 26500, calls: 710 },
  { month: 'Mar', saved: 19800, calls: 520 },
]

const maxSaved = Math.max(...monthlyData.map(d => d.saved))

const beforeAfter = [
  { label: 'Kostnad per samtale', before: '17,50 kr', after: '2,00 kr', savings: '89%' },
  { label: 'Tid per samtale', before: '5 min', after: '0 min', savings: '100%' },
  { label: 'Tapte anrop', before: '35%', after: '0%', savings: '100%' },
  { label: 'Responstid', before: '2-4 timer', after: 'Umiddelbart', savings: '∞' },
]

const categories = [
  { name: 'Telefonhåndtering', percent: 58, amount: 67340, icon: Phone, color: '#22c55e' },
  { name: 'Lead-kvalifisering', percent: 28, amount: 32480, icon: Users, color: '#3b82f6' },
  { name: 'Booking-automatisering', percent: 14, amount: 16240, icon: CalendarCheck, color: '#a855f7' },
]

export default function BesparelserPage() {
  const moneySaved = useAnimatedCounter(114800, 2500, 0)
  const timeSaved = useAnimatedCounter(892, 2000, 0)
  const roiPercent = useAnimatedCounter(340, 2200, 0)
  const aiHandled = useAnimatedCounter(3060, 1800, 0)

  return (
    <div style={{ minHeight: '100vh', color: '#fff' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes progressGrow {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .fade-up { animation: fadeInUp 0.7s ease-out forwards; opacity: 0; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.2s; }
        .fade-up-3 { animation-delay: 0.3s; }
        .fade-up-4 { animation-delay: 0.4s; }
        .fade-up-5 { animation-delay: 0.5s; }
        .fade-up-6 { animation-delay: 0.6s; }
        .shimmer-text {
          background: linear-gradient(90deg, ${gold}, #fff5c0, ${gold}, #fff5c0, ${gold});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(${goldRgb}, 0.3);
        }
        .bar-chart-bar {
          transition: height 1s ease-out;
        }
        .progress-bar {
          animation: progressGrow 1.5s ease-out forwards;
          animation-delay: 0.8s;
          width: 0%;
        }
      `}</style>

      {/* === HEADER === */}
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, rgba(${goldRgb}, 0.2), rgba(${goldRgb}, 0.05))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <PiggyBank size={22} color={gold} />
          </div>
          <h1 style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 700 }}>
            Besparelser
          </h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
          Se hvor mye tid og penger bedriften din sparer med Arxon AI-automatisering
        </p>
      </div>

      {/* === HERO STATS === */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        {/* Money Saved */}
        <div className="stat-card fade-up fade-up-1" ref={moneySaved.ref}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
            borderRadius: '0 16px 0 0'
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(34,197,94,0.12)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <PiggyBank size={24} color="#22c55e" />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            Penger spart
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: fonts.heading, color: '#22c55e' }}>
            {moneySaved.count.toLocaleString('nb-NO')} kr
          </div>
          <div style={{ fontSize: 12, color: 'rgba(34,197,94,0.7)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} /> +23% fra forrige måned
          </div>
        </div>

        {/* Time Saved */}
        <div className="stat-card fade-up fade-up-2" ref={timeSaved.ref}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            borderRadius: '0 16px 0 0'
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(59,130,246,0.12)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Clock size={24} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            Timer spart
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: fonts.heading, color: '#3b82f6' }}>
            {timeSaved.count.toLocaleString('nb-NO')}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(59,130,246,0.7)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} /> +18% fra forrige måned
          </div>
        </div>

        {/* ROI */}
        <div className="stat-card fade-up fade-up-3" ref={roiPercent.ref}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 120, height: 120,
            background: `radial-gradient(circle, rgba(${goldRgb},0.1) 0%, transparent 70%)`,
            borderRadius: '0 16px 0 0'
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `rgba(${goldRgb}, 0.12)`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <TrendingUp size={24} color={gold} />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            Avkastning (ROI)
          </div>
          <div className="shimmer-text" style={{ fontSize: 32, fontWeight: 800, fontFamily: fonts.heading }}>
            {roiPercent.count}%
          </div>
          <div style={{ fontSize: 12, color: `rgba(${goldRgb}, 0.7)`, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={14} /> Investering x3.4
          </div>
        </div>

        {/* AI Handled */}
        <div className="stat-card fade-up fade-up-4" ref={aiHandled.ref}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
            borderRadius: '0 16px 0 0'
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(168,85,247,0.12)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Bot size={24} color="#a855f7" />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            AI-håndtert
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: fonts.heading, color: '#a855f7' }}>
            {aiHandled.count.toLocaleString('nb-NO')}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(168,85,247,0.7)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={14} /> Samtaler, leads og bookinger
          </div>
        </div>
      </div>

      {/* === MONTHLY CHART + BEFORE/AFTER === */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20,
        marginBottom: 32
      }}>
        {/* Monthly Bar Chart */}
        <div className="stat-card fade-up fade-up-5" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 17, fontWeight: 600, marginBottom: 24 }}>
            Månedlige besparelser
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180 }}>
            {monthlyData.map((d, i) => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  {(d.saved / 1000).toFixed(1)}k
                </div>
                <div style={{
                  width: '100%',
                  height: `${(d.saved / maxSaved) * 140}px`,
                  background: `linear-gradient(180deg, rgba(${goldRgb}, 0.8), rgba(${goldRgb}, 0.2))`,
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 1s ease-out',
                  transitionDelay: `${i * 0.1}s`,
                  minHeight: 20
                }} />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{d.month}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: `rgba(${goldRgb}, 0.06)`,
            border: `1px solid rgba(${goldRgb}, 0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Totalt spart (6 mnd)</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: gold }}>
              {monthlyData.reduce((s, d) => s + d.saved, 0).toLocaleString('nb-NO')} kr
            </span>
          </div>
        </div>

        {/* Before / After */}
        <div className="stat-card fade-up fade-up-6" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 17, fontWeight: 600, marginBottom: 24 }}>
            Før vs. etter Arxon
          </h3>
          <div style={{ display: 'flex', gap: 0 }}>
            {/* Headers */}
            <div style={{ flex: 1 }} />
            <div style={{
              width: 100, textAlign: 'center', padding: '6px 0', borderRadius: '8px 0 0 0',
              background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 12, fontWeight: 600
            }}>
              FØR
            </div>
            <div style={{ width: 16 }} />
            <div style={{
              width: 100, textAlign: 'center', padding: '6px 0', borderRadius: '0 8px 0 0',
              background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontSize: 12, fontWeight: 600
            }}>
              ETTER
            </div>
            <div style={{ width: 60, textAlign: 'center', padding: '6px 0', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Spart
            </div>
          </div>
          {beforeAfter.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 0,
              padding: '12px 0',
              borderBottom: i < beforeAfter.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {item.label}
              </div>
              <div style={{
                width: 100, textAlign: 'center', fontSize: 14, fontWeight: 500,
                color: '#ef4444', padding: '4px 8px', borderRadius: 6,
                background: 'rgba(239,68,68,0.06)'
              }}>
                {item.before}
              </div>
              <div style={{ width: 16, display: 'flex', justifyContent: 'center' }}>
                <ArrowRight size={12} color="rgba(255,255,255,0.2)" />
              </div>
              <div style={{
                width: 100, textAlign: 'center', fontSize: 14, fontWeight: 600,
                color: '#22c55e', padding: '4px 8px', borderRadius: 6,
                background: 'rgba(34,197,94,0.06)'
              }}>
                {item.after}
              </div>
              <div style={{
                width: 60, textAlign: 'center', fontSize: 13, fontWeight: 700,
                color: gold
              }}>
                {item.savings}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === SAVINGS BREAKDOWN === */}
      <div className="stat-card fade-up fade-up-5" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: fonts.heading, fontSize: 17, fontWeight: 600, marginBottom: 24 }}>
          Besparelser etter kategori
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${cat.color}18`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={16} color={cat.color} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      {cat.amount.toLocaleString('nb-NO')} kr
                    </span>
                    <span style={{ fontSize: 13, color: cat.color, fontWeight: 600 }}>
                      {cat.percent}%
                    </span>
                  </div>
                </div>
                <div style={{
                  height: 8, borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)',
                  overflow: 'hidden'
                }}>
                  <div
                    className="progress-bar"
                    style={{
                      height: '100%',
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`,
                      '--target-width': `${cat.percent}%`
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          marginTop: 24, padding: '16px 20px', borderRadius: 12,
          background: `linear-gradient(135deg, rgba(${goldRgb}, 0.08), rgba(${goldRgb}, 0.02))`,
          border: `1px solid rgba(${goldRgb}, 0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
              Total besparelse hittil i år
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: fonts.heading, color: gold }}>
              {categories.reduce((s, c) => s + c.amount, 0).toLocaleString('nb-NO')} kr
            </div>
          </div>
          <div style={{
            padding: '8px 16px', borderRadius: 10,
            background: `rgba(${goldRgb}, 0.15)`,
            color: gold, fontSize: 13, fontWeight: 600
          }}>
            Basert på demodata
          </div>
        </div>
      </div>
    </div>
  )
}
