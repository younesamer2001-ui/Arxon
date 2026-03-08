'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Check, ChevronDown, Zap, Clock, AlertTriangle, Package,
  CalendarDays, ShoppingCart, Shield, Phone, Sparkles, X, Info,
  Bot, BarChart3, CheckCircle2, TrendingUp, Users,
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import {
  pricingAutomations, pricingIndustries, PricingAutomation,
  PRICING, getDiscountRate, formatKr,
} from '@/lib/pricing'
import { useCalBooking } from '@/lib/useCalBooking'

const gold = '#efc07b'
const goldRgb = '239,192,123'
const bgDark = '#050510'
const cardBg = 'rgba(255,255,255,0.03)'

const complexityColor: Record<string, string> = {
  'Lav': '#4ade80', 'Middels': '#fbbf24', 'Høy': '#f87171',
}
const complexityIcon: Record<string, any> = {
  'Lav': Zap, 'Middels': Clock, 'Høy': AlertTriangle,
}

type BillingMode = 'monthly' | 'annual'

function AutomationRow({
  auto, selected, onToggle,
}: {
  auto: PricingAutomation; selected: boolean; onToggle: () => void
}) {
  const [showInfo, setShowInfo] = useState(false)
  const CIcon = complexityIcon[auto.complexity] || Zap
  const cColor = complexityColor[auto.complexity] || '#fbbf24'

  return (
    <div style={{
      background: selected ? `rgba(${goldRgb},0.06)` : cardBg,
      borderRadius: 12,
      border: `1px solid ${selected ? `rgba(${goldRgb},0.25)` : 'rgba(255,255,255,0.06)'}`,
      transition: 'all 0.2s',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', cursor: 'pointer',
      }} onClick={onToggle}>
        {/* Checkbox */}
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: selected ? gold : 'transparent',
          border: `2px solid ${selected ? gold : 'rgba(255,255,255,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {selected && <Check size={14} color={bgDark} strokeWidth={3} />}
        </div>

        {/* Name + category */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f4f1eb' }}>
            {auto.name}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            {auto.category}
          </div>
        </div>

        {/* Complexity badge */}
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: cColor, fontWeight: 500,
          background: `${cColor}12`, borderRadius: 16, padding: '2px 8px',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          <CIcon size={11} /> {auto.complexity}
        </span>

        {/* Price */}
        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: gold }}>
            {formatKr(auto.monthlyPrice)}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>/mnd</div>
        </div>

        {/* Info toggle */}
        <button
          onClick={e => { e.stopPropagation(); setShowInfo(!showInfo) }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, flexShrink: 0,
          }}
        >
          <Info size={16} />
        </button>
      </div>

      {/* Expandable info */}
      <div style={{
        maxHeight: showInfo ? 200 : 0, overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{ padding: '0 16px 14px', borderTop: `1px solid rgba(255,255,255,0.04)` }}>
          {auto.desc && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '10px 0 0', lineHeight: 1.5 }}>
              {auto.desc}
            </p>
          )}
          {auto.benefit && (
            <p style={{
              fontSize: 12, color: `rgba(${goldRgb},0.75)`, margin: '8px 0 0',
              lineHeight: 1.4, fontStyle: 'italic',
            }}>
              {auto.benefit}
            </p>
          )}
          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            <span>Oppsett: {formatKr(auto.setupPrice)}</span>
            <span>Implementering: {auto.implTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PakkebyggerPage() {
  const { lang } = useLanguage()
  const no = lang === 'no'
  const openBooking = useCalBooking()
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [billing, setBilling] = useState<BillingMode>('monthly')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const router = useRouter()

  const industryAutomations = useMemo(() =>
    selectedIndustry
      ? pricingAutomations.filter(a => a.industry === selectedIndustry)
      : [],
    [selectedIndustry]
  )

  const selectedAutomations = useMemo(() =>
    industryAutomations.filter(a => selectedIds.has(a.name)),
    [industryAutomations, selectedIds]
  )

  const count = selectedAutomations.length
  const discountRate = getDiscountRate(count)
  const totalSetup = selectedAutomations.reduce((s, a) => s + a.setupPrice, 0)
  const totalMonthlyRaw = selectedAutomations.reduce((s, a) => s + a.monthlyPrice, 0)
  const monthlyAfterQuantity = totalMonthlyRaw * (1 - discountRate)
  const monthlyFinal = billing === 'annual'
    ? monthlyAfterQuantity * (1 - PRICING.annualDiscount)
    : monthlyAfterQuantity
  const annualTotal = monthlyFinal * 12

  const handleCheckout = useCallback(async () => {
    if (selectedAutomations.length === 0) return
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          automations: selectedAutomations.map(a => ({
            name: a.name,
            setupPrice: a.setupPrice,
            monthlyPrice: a.monthlyPrice,
            complexity: a.complexity,
            industry: a.industry,
          })),
          billingMode: billing,
          setupTotal: totalSetup,
          monthlyTotal: monthlyFinal,
          discountRate,
          industry: selectedIndustry,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Noe gikk galt. Prøv igjen.')
        setCheckoutLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Kunne ikke starte betaling. Sjekk internettforbindelsen og prøv igjen.')
      setCheckoutLoading(false)
    }
  }, [selectedAutomations, billing, totalSetup, monthlyFinal, discountRate, selectedIndustry])

  function toggleAutomation(name: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function selectIndustry(ind: string) {
    setSelectedIndustry(ind)
    setSelectedIds(new Set())
    setShowDropdown(false)
  }

  return (
    <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`,
            borderRadius: 24, padding: '6px 16px', fontSize: 13, color: gold,
            marginBottom: 16, fontWeight: 500,
          }}
        >
          <Package size={14} /> {no ? 'Bygg din egen automatiseringspakke' : 'Build your own automation package'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}
        >
          {no ? 'Velg automatiseringer, ' : 'Choose automations, '}<span style={{ color: gold }}>{no ? 'se prisen live' : 'see pricing live'}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}
        >
          {no ? 'Velg din bransje, kryss av for det du trenger, og se nøyaktig hva det koster. Ingen skjulte kostnader.' : 'Choose your industry, select what you need, and see exactly what it costs. No hidden fees.'}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20,
            background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: 10, padding: '10px 20px', fontSize: 14, color: '#4ade80',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{no ? 'Bedrifter sparer typisk ' : 'Companies typically save '}<strong>{no ? '150 000 – 250 000 kr/år' : '$18,000 – $30,000/year'}</strong>{no ? ' i tid og økt omsetning' : ' in time and increased revenue'}</span>
        </motion.div>
      </section>

      {/* Main builder area */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Left column — automations */}
          <div style={{ flex: 1, minWidth: 300 }}>

            {/* Industry selector */}
            <div style={{ marginBottom: 20, position: 'relative' }}>
              <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }}>
                {no ? '1. Velg din bransje' : '1. Choose your industry'}
              </label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: '100%', background: cardBg,
                  border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 10,
                  padding: '14px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', cursor: 'pointer',
                  color: selectedIndustry ? '#f4f1eb' : 'rgba(255,255,255,0.4)',
                  fontSize: 15, fontFamily: 'inherit',
                }}
              >
                {selectedIndustry || (no ? 'Velg bransje...' : 'Select industry...')}
                <ChevronDown size={16} color="rgba(255,255,255,0.4)"
                  style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                />
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                  background: '#1a2940', border: `1px solid rgba(${goldRgb},0.15)`,
                  borderRadius: 10, marginTop: 4, maxHeight: 300, overflowY: 'auto',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                }}>
                  {pricingIndustries.map(ind => (
                    <button key={ind} onClick={() => selectIndustry(ind)} style={{
                      width: '100%', background: ind === selectedIndustry ? `rgba(${goldRgb},0.1)` : 'transparent',
                      border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                      padding: '12px 16px', textAlign: 'left', cursor: 'pointer',
                      color: '#f4f1eb', fontSize: 14, fontFamily: 'inherit',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `rgba(${goldRgb},0.08)`}
                    onMouseLeave={e => e.currentTarget.style.background = ind === selectedIndustry ? `rgba(${goldRgb},0.1)` : 'transparent'}
                    >
                      {ind}
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>
                        {pricingAutomations.filter(a => a.industry === ind).length} {no ? 'løsninger' : 'solutions'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Automations list */}
            {selectedIndustry && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {no ? '2. Velg automatiseringer (' : '2. Choose automations ('}
                    {industryAutomations.length} {no ? 'tilgjengelig)' : 'available)'}
                  </label>
                  {count > 0 && (
                    <span style={{ fontSize: 12, color: gold, fontWeight: 500 }}>
                      {count} {no ? 'valgt' : 'selected'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {industryAutomations.map(auto => (
                    <AutomationRow
                      key={auto.name}
                      auto={auto}
                      selected={selectedIds.has(auto.name)}
                      onToggle={() => toggleAutomation(auto.name)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {!selectedIndustry && (
              <div style={{
                background: cardBg, borderRadius: 16, padding: '60px 24px', textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.1)',
              }}>
                <Package size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
                  {no ? 'Velg en bransje for å se tilgjengelige automatiseringer' : 'Choose an industry to see available automations'}
                </p>
              </div>
            )}
          </div>

          {/* Right column — price summary (sticky) */}
          <div style={{
            width: 320, flexShrink: 0, position: 'sticky', top: 80,
          }}
          className="price-summary-panel"
          >
            <div style={{
              background: cardBg, borderRadius: 16,
              border: `1px solid rgba(${goldRgb},0.12)`,
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                background: `rgba(${goldRgb},0.06)`,
                padding: '18px 20px', borderBottom: `1px solid rgba(${goldRgb},0.1)`,
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color={gold} />
                  {no ? 'Din pakke' : 'Your package'}
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                {/* Billing toggle */}
                <div style={{
                  display: 'flex', background: 'rgba(255,255,255,0.04)',
                  borderRadius: 8, padding: 3, marginBottom: 20,
                }}>
                  <button onClick={() => setBilling('monthly')} style={{
                    flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none',
                    background: billing === 'monthly' ? `rgba(${goldRgb},0.15)` : 'transparent',
                    color: billing === 'monthly' ? gold : 'rgba(255,255,255,0.5)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}>
                    {no ? 'Månedlig' : 'Monthly'}
                  </button>
                  <button onClick={() => setBilling('annual')} style={{
                    flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none',
                    background: billing === 'annual' ? `rgba(${goldRgb},0.15)` : 'transparent',
                    color: billing === 'annual' ? gold : 'rgba(255,255,255,0.5)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s', position: 'relative',
                  }}>
                    {no ? 'Årlig' : 'Annual'}
                    <span style={{
                      position: 'absolute', top: -8, right: -4,
                      background: '#4ade80', color: bgDark, fontSize: 10, fontWeight: 700,
                      padding: '1px 6px', borderRadius: 10,
                    }}>
                      -20%
                    </span>
                  </button>
                </div>

                {count === 0 ? (
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px 0' }}>
                    {no ? 'Velg automatiseringer for å se prisen' : 'Choose automations to see pricing'}
                  </p>
                ) : (
                  <>
                    {/* Items */}
                    <div style={{ marginBottom: 16 }}>
                      {selectedAutomations.map(a => (
                        <div key={a.name} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 0', fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)', flex: 1, marginRight: 8 }}>
                            {a.name}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', fontSize: 12 }}>
                            {formatKr(a.monthlyPrice)}/mnd
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Subtotals */}
                    <div style={{ borderTop: `1px solid rgba(${goldRgb},0.1)`, paddingTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{no ? 'Engangskostnad oppsett' : 'Setup fee'}</span>
                        <span style={{ color: '#f4f1eb', fontWeight: 500 }}>{formatKr(totalSetup)}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{no ? 'Månedspris (' : 'Monthly price ('}
                          {count} {no ? 'stk)' : 'items)'}</span>
                        <span style={{ color: '#f4f1eb' }}>{formatKr(totalMonthlyRaw)}</span>
                      </div>

                      {discountRate > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ color: '#4ade80' }}>{no ? 'Kvantumsrabatt ' : 'Volume discount '}({Math.round(discountRate * 100)}%)</span>
                          <span style={{ color: '#4ade80' }}>-{formatKr(totalMonthlyRaw * discountRate)}</span>
                        </div>
                      )}

                      {billing === 'annual' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ color: '#4ade80' }}>{no ? 'Årsrabatt ' : 'Annual discount '}(20%)</span>
                          <span style={{ color: '#4ade80' }}>-{formatKr(monthlyAfterQuantity * 0.20)}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div style={{
                      background: `rgba(${goldRgb},0.06)`, borderRadius: 10,
                      padding: '14px', marginTop: 12,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                          {billing === 'annual' ? (no ? 'Per måned (årlig)' : 'Per month (annual)') : (no ? 'Per måned' : 'Per month')}
                        </span>
                        <span style={{ fontSize: 22, fontWeight: 700, color: gold }}>
                          {formatKr(Math.round(monthlyFinal))}
                        </span>
                      </div>
                      {billing === 'annual' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{no ? 'Årlig totalt' : 'Annual total'}</span>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{formatKr(Math.round(annualTotal))}</span>
                        </div>
                      )}
                      {billing === 'monthly' && totalMonthlyRaw !== monthlyFinal && (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, textDecoration: 'line-through' }}>
                          {formatKr(totalMonthlyRaw)}/{no ? 'mnd' : 'mo'} {no ? 'uten rabatt' : 'without discount'}
                        </div>
                      )}
                    </div>

                    {/* CTA buttons */}
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading || count === 0}
                        className="cta-shimmer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '14px 20px', borderRadius: 10, fontWeight: 600,
                          fontSize: 14, color: bgDark, border: 'none', cursor: checkoutLoading ? 'wait' : 'pointer',
                          opacity: checkoutLoading ? 0.7 : 1, width: '100%',
                        }}>
                        {checkoutLoading ? (
                          <>{no ? 'Går til betaling...' : 'Redirecting...'}</>
                        ) : (
                          <><ShoppingCart size={16} /> {no ? 'Bestill denne pakken' : 'Order this package'}</>
                        )}
                      </button>

                      <button onClick={openBooking} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 10, fontWeight: 500,
                fontSize: 13, cursor: 'pointer', background: 'transparent',
                color: gold, border: `1px solid rgba(${goldRgb},0.2)`,
                transition: 'all 0.2s',
              }}
                data-cal-namespace="gratis-ai-konsultasjon"
                data-cal-link="arxon/gratis-ai-konsultasjon"
                data-cal-config='{"layout":"month_view"}'
              >
                <CalendarDays size={15} /> {no ? 'Book et gratis rådgivningsmøte' : 'Book a free consultation'}
              </button>
                    </div>

                    {/* Trust */}
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Shield size={11} /> {no ? 'Ingen binding — kanseller når som helst' : 'No commitment — cancel anytime'}
                      </span>
                      {billing === 'annual' && (
                        <span style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Shield size={11} /> {no ? '14 dagers åpent kjøp ved årlig betaling' : '14-day money back guarantee'}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={11} /> {no ? 'Norsk support inkludert' : 'Support included'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, textAlign: 'center', marginBottom: 32 }}>
          {no ? 'Slik fungerer det' : 'How it works'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {(no ? [
            { step: '1', title: 'Velg', desc: 'Velg bransje og kryss av for automatiseringene du trenger' },
            { step: '2', title: 'Bestill eller book', desc: 'Bestill pakken direkte eller book et gratis rådgivningsmøte' },
            { step: '3', title: 'Vi setter opp', desc: 'Arxon bygger og tester alt — ferdig på ca. 14 dager' },
            { step: '4', title: 'Alt fungerer', desc: '30 dager med full støtte og oppfølging etter lansering' },
          ] : [
            { step: '1', title: 'Choose', desc: 'Select your industry and check the automations you need' },
            { step: '2', title: 'Order or book', desc: 'Order the package directly or book a free consultation' },
            { step: '3', title: 'We set it up', desc: 'Arxon builds and tests everything — ready in about 14 days' },
            { step: '4', title: 'Everything works', desc: '30 days of full support and follow-up after launch' },
          ]).map(s => (
            <div key={s.step} style={{
              background: cardBg, borderRadius: 14, padding: '24px 20px',
              border: `1px solid rgba(${goldRgb},0.06)`, textAlign: 'center',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `rgba(${goldRgb},0.1)`, color: gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, margin: '0 auto 12px',
              }}>
                {s.step}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Employee cost comparison */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 700, textAlign: 'center', marginBottom: 8,
        }}>
          {no ? 'Slipp å ansette — ' : 'Skip hiring — '}<span style={{ color: gold }}>{no ? 'automatiser i stedet' : 'automate instead'}</span>
        </h2>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center',
          maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.6,
        }}>
          {no ? 'Mange bedrifter vurderer å ansette for å håndtere telefoner, booking eller oppfølging. Med Arxon løser du det samme — til en brøkdel av prisen. Alle tall er verifisert mot SSB og Altinn, og inkluderer lønn, 14.1% arbeidsgiveravgift, 12% feriepenger og 2% OTP.' : 'Many companies consider hiring to handle calls, bookings, or follow-ups. With Arxon, you solve the same problem — for a fraction of the cost. All figures are verified against official labor statistics and include salary, employer taxes, vacation pay, and pension contributions.'}
        </p>

        <div style={{
          background: cardBg, borderRadius: 14, overflow: 'hidden',
          border: `1px solid rgba(${goldRgb},0.08)`,
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            padding: '14px 20px', background: `rgba(${goldRgb},0.04)`,
            borderBottom: `1px solid rgba(${goldRgb},0.08)`,
            fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
            gap: 8,
          }}>
            <span>{no ? 'Oppgave' : 'Task'}</span>
            <span style={{ textAlign: 'right' }}>{no ? 'Verdi (timer/mnd)' : 'Value (hours/month)'}</span>
            <span style={{ textAlign: 'right' }}>Arxon ({no ? 'årlig' : 'yearly'})</span>
            <span style={{ textAlign: 'right', color: '#4ade80' }}>{no ? 'Estimert gevinst' : 'Estimated savings'}</span>
          </div>

          {/* Rows — realistic estimates for small businesses */}
          {(no ? [
            { role: 'Telefon & mottak', detail: 'AI-telefonsvarer + booking', timeSaved: '20–30 t/mnd', arxonRange: '24 000 – 36 000', savingRange: '60 000 – 90 000' },
            { role: 'Kundeservice & support', detail: 'Chatbot + auto-svar + FAQ', timeSaved: '15–25 t/mnd', arxonRange: '36 000 – 51 000', savingRange: '40 000 – 60 000' },
            { role: 'Booking & kalender', detail: 'Auto-booking + påminnelser', timeSaved: '10–15 t/mnd', arxonRange: '24 000 – 36 000', savingRange: '30 000 – 50 000' },
            { role: 'Lead-oppfølging & salg', detail: 'Scoring + CRM + follow-up', timeSaved: '15–20 t/mnd', arxonRange: '36 000 – 51 000', savingRange: '50 000 – 80 000' },
          ] : [
            { role: 'Phone & Reception', detail: 'AI phone assistant + booking', timeSaved: '20–30 h/mo', arxonRange: '$2,900 – $4,400', savingRange: '$7,200 – $10,800' },
            { role: 'Customer Service & Support', detail: 'Chatbot + auto-reply + FAQ', timeSaved: '15–25 h/mo', arxonRange: '$4,400 – $6,200', savingRange: '$4,800 – $7,200' },
            { role: 'Booking & Calendar', detail: 'Auto-booking + reminders', timeSaved: '10–15 h/mo', arxonRange: '$2,900 – $4,400', savingRange: '$3,600 – $6,000' },
            { role: 'Lead Follow-up & Sales', detail: 'Scoring + CRM + follow-up', timeSaved: '15–20 h/mo', arxonRange: '$4,400 – $6,200', savingRange: '$6,000 – $9,600' },
          ]).map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
              padding: '14px 20px', gap: 8,
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              fontSize: 13,
            }}>
              <div>
                <span style={{ color: '#f4f1eb', fontWeight: 500 }}>{row.role}</span>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{row.detail}</div>
              </div>
              <span style={{ textAlign: 'right', color: 'rgba(255,255,255,0.5)' }}>{row.timeSaved}</span>
              <span style={{ textAlign: 'right', color: gold, fontWeight: 500 }}>kr {row.arxonRange}</span>
              <span style={{ textAlign: 'right', color: '#4ade80', fontWeight: 600 }}>kr {row.savingRange}</span>
            </div>
          ))}

          {/* Summary row */}
          <div style={{
            padding: '16px 20px', background: `rgba(74,222,128,0.04)`,
            borderTop: `1px solid rgba(74,222,128,0.1)`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f4f1eb' }}>
                {no ? 'Typisk totalverdi for en liten bedrift' : 'Typical total value for a small business'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {no ? 'Spart tid + økt omsetning fra færre tapte kunder. Varierer etter bransje og volum.' : 'Saved time + increased revenue from fewer lost customers. Varies by industry and volume.'}
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>
              {no ? '150 000 – 250 000 kr/år' : '$18,000 – $30,000/year'}
            </div>
          </div>
        </div>
      </section>

      {/* Why setup fee */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 700, textAlign: 'center', marginBottom: 8,
        }}>
          {no ? 'Hvorfor engangs ' : 'Why a '}
          <span style={{ color: gold }}>{no ? 'setup-fee?' : 'setup fee?'}</span>
        </h2>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center',
          maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6,
        }}>
          {no ? 'Du investerer i en skreddersydd AI-løsning — ikke et ferdigprodukt fra hylla. Setup-fee dekker alt det arbeidet som gjør at AI-en faktisk leverer resultater.' : 'You\'re investing in a custom AI solution — not a off-the-shelf product. The setup fee covers all the work that makes your AI actually deliver results.'}
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14,
        }}>
          {(no ? [
            { Icon: Bot, title: 'Skreddersydd AI-opplæring', desc: 'Vi trener AI-en på din bedrift, dine tjenester, priser og vanlige spørsmål — så den svarer som en av dine egne.' },
            { Icon: Zap, title: 'Integrasjon med dine systemer', desc: 'Vi kobler AI til kalender, CRM, regnskap og de verktøyene du allerede bruker — alt satt opp for deg.' },
            { Icon: Shield, title: 'Testing og kvalitetssikring', desc: 'Vi tester alt grundig før lansering og justerer til du er 100% fornøyd med hvordan AI-en representerer bedriften din.' },
            { Icon: BarChart3, title: 'Lavere løpende kostnader', desc: 'Høyere setup-fee = lavere månedskostnad. Du investerer i en skikkelig løsning, og sparer mer over tid.' },
          ] : [
            { Icon: Bot, title: 'Custom AI Training', desc: 'We train the AI on your business, services, pricing, and common questions — so it responds like one of your team.' },
            { Icon: Zap, title: 'System Integration', desc: 'We connect the AI to your calendar, CRM, accounting, and tools you already use — all set up for you.' },
            { Icon: Shield, title: 'Testing & Quality Assurance', desc: 'We thoroughly test everything before launch and adjust until you\'re 100% happy with how the AI represents your business.' },
            { Icon: BarChart3, title: 'Lower Ongoing Costs', desc: 'Higher setup fee = lower monthly cost. You invest in a proper solution and save more over time.' },
          ]).map((card, i) => (
            <div key={i} style={{
              background: cardBg, borderRadius: 14, padding: '24px 20px',
              border: `1px solid rgba(${goldRgb},0.06)`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `rgba(${goldRgb},0.08)`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                <card.Icon size={20} color={gold} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: `rgba(${goldRgb},0.03)`, borderRadius: 16,
          border: `1px solid rgba(${goldRgb},0.1)`, padding: '36px 28px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `rgba(${goldRgb},0.08)`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Shield size={26} color={gold} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
            Fornøyd-garanti
          </h3>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
            maxWidth: 520, margin: '0 auto 20px',
          }}>
            Vi justerer og optimaliserer til du er 100% fornøyd med løsningen.
            Ved årsbetaling får du 30 dagers pengene-tilbake-garanti.
            Månedlig drift har ingen bindingstid — du kan avslutte når som helst.
          </p>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
          }}>
            {['30 dagers garanti ved årsbetaling', 'Ingen bindingstid på månedlig', 'GDPR-sikret', 'Norsk datasenter'].map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.1)`,
                borderRadius: 20, padding: '6px 14px', fontSize: 12,
                color: gold, fontWeight: 500,
              }}>
                <Check size={13} /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile sticky bar */}
      {count > 0 && (
        <div className="mobile-price-bar" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: cardBg, borderTop: `1px solid rgba(${goldRgb},0.15)`,
          padding: '12px 20px', display: 'none',
          alignItems: 'center', justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{count} valgt</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: gold }}>{formatKr(Math.round(monthlyFinal))}/mnd</div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || count === 0}
            className="cta-shimmer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10, fontWeight: 600,
              fontSize: 13, color: bgDark, border: 'none', cursor: checkoutLoading ? 'wait' : 'pointer',
              opacity: checkoutLoading ? 0.7 : 1,
            }}>
            {checkoutLoading ? 'Venter...' : 'Bestill'} <ArrowRight size={14} />
          </button>
        </div>
      )}

      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          .price-summary-panel {
            width: 100% !important;
            position: static !important;
            order: -1;
            display: ${count > 0 ? 'block' : 'none'};
          }
          .mobile-price-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}
