'use client'

import { useState, useEffect, useRef } from 'react'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { TrendingUp, Clock, Phone, PiggyBank, BarChart3, ArrowDown, ArrowUp, Loader2 } from 'lucide-react'

interface SavingsData {
  totalMoneySaved: number
  timeSavedHours: number
  roi: number
  totalCallsHandled: number
  monthsActive: number
  activeAutomations: string[]
  isEstimate: boolean
  orderDate: string
  categoryBreakdown: { category: string; saved: number; label: string }[]
  monthlyData: { month: string; saved: number; calls: number }[]
  beforeAfter: { label: string; before: number; after: number; unit: string }[]
}

function useAnimatedCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!startOnView || hasAnimated.current) return
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
            setCount(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, startOnView])

  return { count, ref }
}

export default function BesparelserPage() {
  const [data, setData] = useState<SavingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSavings() {
      try {
        const orderRes = await fetch('/api/customer/order')
        if (!orderRes.ok) { setError('Kunne ikke hente kundedata'); setLoading(false); return }
        const orderData = await orderRes.json()
        const customerId = orderData.order?.id
        if (!customerId) { setError('Ingen aktiv bestilling funnet'); setLoading(false); return }
        
        const savingsRes = await fetch(`/api/savings?customer_id=${customerId}`)
        if (!savingsRes.ok) { setError('Kunne ikke hente besparelsesdata'); setLoading(false); return }
        const savingsData = await savingsRes.json()
        setData(savingsData)
      } catch (e) {
        setError('Noe gikk galt ved lasting av data')
      } finally {
        setLoading(false)
      }
    }
    fetchSavings()
  }, [])

  const moneySaved = useAnimatedCounter(data?.totalMoneySaved || 0)
  const timeSaved = useAnimatedCounter(data?.timeSavedHours || 0)
  const roiCounter = useAnimatedCounter(data?.roi || 0)
  const callsCounter = useAnimatedCounter(data?.totalCallsHandled || 0)

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <Loader2 size={40} style={{ color: gold, animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: fonts.body }}>Laster besparelsesdata...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <PiggyBank size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: fonts.body, textAlign: 'center', maxWidth: 400 }}>
          {error || 'Ingen data tilgjengelig ennå. Besparelser beregnes automatisk når AI-automatiseringene dine er aktive.'}
        </p>
      </div>
    )
  }

  const maxSaved = Math.max(...data.monthlyData.map(d => d.saved), 1)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {data.isEstimate && (
        <div style={{
          background: 'rgba(' + goldRgb + ',0.08)',
          border: '1px solid rgba(' + goldRgb + ',0.2)',
          borderRadius: 12,
          padding: '12px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: fonts.body,
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)'
        }}>
          <BarChart3 size={16} style={{ color: gold, flexShrink: 0 }} />
          <span>Disse tallene er <strong style={{ color: gold }}>estimater</strong> basert på dine aktive automatiseringer. Nøyaktige data vises når AI-en har vært aktiv lenger.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Penger spart', value: moneySaved, suffix: ' kr', icon: PiggyBank, color: '#22c55e' },
          { label: 'Timer spart', value: timeSaved, suffix: ' timer', icon: Clock, color: '#3b82f6' },
          { label: 'Avkastning (ROI)', value: roiCounter, suffix: '%', icon: TrendingUp, color: gold },
          { label: 'Samtaler håndtert', value: callsCounter, suffix: '', icon: Phone, color: '#a855f7' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: stat.color,
                opacity: 0.06,
              }} />
              <Icon size={20} style={{ color: stat.color, marginBottom: 12 }} />
              <div style={{ fontFamily: fonts.heading, fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                <span ref={stat.value.ref}>
                  {stat.value.count.toLocaleString('nb-NO')}
                </span>
                <span style={{ fontSize: 16, color: stat.color, fontWeight: 500 }}>{stat.suffix}</span>
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Monthly Chart */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
      }}>
        <h3 style={{ fontFamily: fonts.heading, fontSize: 18, color: '#fff', marginBottom: 4 }}>Månedlig besparelse</h3>
        <p style={{ fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
          Siste {data.monthlyData.length} måneder — {data.isEstimate ? 'estimert' : 'faktisk'} besparelse i NOK
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
          {data.monthlyData.map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                {(m.saved / 1000).toFixed(0)}k
              </span>
              <div style={{
                width: '100%',
                maxWidth: 48,
                height: `${Math.max((m.saved / maxSaved) * 140, 4)}px`,
                borderRadius: 6,
                background: i === data.monthlyData.length - 1
                  ? `linear-gradient(to top, rgba(${goldRgb},0.6), ${gold})`
                  : `linear-gradient(to top, rgba(${goldRgb},0.15), rgba(${goldRgb},0.35))`,
                transition: 'height 0.6s ease',
              }} />
              <span style={{ fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                {m.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        
        {/* Before / After */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 28,
        }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 18, color: '#fff', marginBottom: 20 }}>Før vs. Etter Arxon</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.beforeAfter.map((item, i) => {
              const reduction = Math.round(((item.before - item.after) / item.before) * 100)
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                    <span style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      color: '#22c55e',
                      background: 'rgba(34,197,94,0.1)',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}>
                      <ArrowDown size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {reduction}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: 8,
                        borderRadius: 4,
                        background: 'rgba(239,68,68,0.25)',
                        width: '100%',
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Før</span>
                        <span style={{ fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{item.before.toLocaleString('nb-NO')} {item.unit}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: 8,
                        borderRadius: 4,
                        background: `linear-gradient(90deg, rgba(${goldRgb},0.4), ${gold})`,
                        width: `${Math.round((item.after / item.before) * 100)}%`,
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Etter</span>
                        <span style={{ fontFamily: fonts.body, fontSize: 11, color: gold }}>{item.after.toLocaleString('nb-NO')} {item.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 28,
        }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 18, color: '#fff', marginBottom: 20 }}>Besparelse per kategori</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.categoryBreakdown.map((cat, i) => {
              const maxCat = Math.max(...data.categoryBreakdown.map(c => c.saved), 1)
              const colors = ['#22c55e', '#3b82f6', '#a855f7']
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{cat.label}</span>
                    <span style={{ fontFamily: fonts.body, fontSize: 13, color: '#fff', fontWeight: 600 }}>
                      {cat.saved.toLocaleString('nb-NO')} kr
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 4,
                      width: `${(cat.saved / maxCat) * 100}%`,
                      background: colors[i % colors.length],
                      opacity: 0.6,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'rgba(' + goldRgb + ',0.06)',
            borderRadius: 12,
            border: '1px solid rgba(' + goldRgb + ',0.12)',
          }}>
            <div style={{ fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
              Total besparelse
            </div>
            <div style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 700, color: gold }}>
              {data.totalMoneySaved.toLocaleString('nb-NO')} kr
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              over {data.monthsActive} {data.monthsActive === 1 ? 'måned' : 'måneder'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
