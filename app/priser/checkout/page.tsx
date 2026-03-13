'use client'

import { useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Check, ArrowLeft, ShoppingCart, Shield, CalendarDays,
  Phone, Sparkles, Clock, Zap, ArrowRight,
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { PRICING, TIER_PACKAGES, TierKey, formatKr } from '@/lib/pricing'
import { useLanguage } from '@/lib/language-context'
import { useCalBooking } from '@/lib/useCalBooking'

const gold = '#efc07b'
const goldRgb = '239,192,123'
const bgDark = '#050510'
const cardBg = 'rgba(255,255,255,0.03)'

type BillingMode = 'monthly' | 'annual'

const tierIcons: Record<TierKey, any> = {
  basis: Clock,
  pro: Zap,
  premium: Shield,
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguage()
  const no = lang === 'no'
  const openBooking = useCalBooking()

  const tierKey = (searchParams.get('tier') || '') as TierKey
  const initialBilling = (searchParams.get('billing') as BillingMode) || 'annual'
  const [billing, setBilling] = useState<BillingMode>(initialBilling)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const pkg = TIER_PACKAGES[tierKey]

  // Invalid tier → redirect back
  if (!pkg) {
    return (
      <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
        <Nav />
        <section style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            {no ? 'Ukjent pakke' : 'Unknown package'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            {no ? 'Vi fant ikke pakken du leter etter.' : 'We couldn\'t find the package you\'re looking for.'}
          </p>
          <Link href="/priser" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 12, background: gold, color: bgDark,
            fontWeight: 600, textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> {no ? 'Tilbake til priser' : 'Back to pricing'}
          </Link>
        </section>
        <Footer />
      </div>
    )
  }

  const tier = PRICING.tiers[pkg.pricingTier]
  const monthlyPrice = billing === 'annual'
    ? Math.round(tier.monthly * (1 - PRICING.annualDiscount))
    : tier.monthly
  const annualTotal = monthlyPrice * 12
  const annualSavings = Math.round(tier.monthly * 12 * PRICING.annualDiscount)
  const TierIcon = tierIcons[tierKey]
  const features = no ? pkg.features.no : pkg.features.en

  const handleCheckout = useCallback(async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          automations: [{
            name: `${no ? pkg.name.no : pkg.name.en} — ${pkg.automationCount} ${no ? 'automasjon(er)' : 'automation(s)'}`,
            setupPrice: tier.setup,
            monthlyPrice: monthlyPrice,
            complexity: pkg.pricingTier,
            industry: 'Generell',
          }],
          billingMode: billing,
          setupTotal: tier.setup,
          monthlyTotal: monthlyPrice,
          discountRate: 0,
          industry: 'Generell',
          cancelUrl: `${window.location.origin}/priser`,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || (no ? 'Noe gikk galt. Prøv igjen.' : 'Something went wrong. Try again.'))
        setCheckoutLoading(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert(no ? 'Kunne ikke starte betaling.' : 'Could not start payment.')
      setCheckoutLoading(false)
    }
  }, [billing, monthlyPrice, tier, pkg, no])

  return (
    <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
      <Nav />

      <section style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px 40px' }}>
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/priser" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14,
            marginBottom: 32,
          }}>
            <ArrowLeft size={14} /> {no ? 'Tilbake til priser' : 'Back to pricing'}
          </Link>
        </motion.div>

        {/* Package card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: cardBg, borderRadius: 20, overflow: 'hidden',
            border: `1px solid rgba(${goldRgb},0.15)`,
          }}
        >
          {/* Header */}
          <div style={{
            background: `rgba(${goldRgb},0.06)`, padding: '28px 28px 24px',
            borderBottom: `1px solid rgba(${goldRgb},0.1)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `rgba(${goldRgb},0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TierIcon size={24} color={gold} />
              </div>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                  {no ? pkg.name.no : pkg.name.en}
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
                  {no ? pkg.desc.no : pkg.desc.en}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '28px' }}>
            {/* Billing toggle */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.04)',
              borderRadius: 10, padding: 4, marginBottom: 28,
            }}>
              <button onClick={() => setBilling('monthly')} style={{
                flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                background: billing === 'monthly' ? `rgba(${goldRgb},0.15)` : 'transparent',
                color: billing === 'monthly' ? gold : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}>
                {no ? 'Månedlig' : 'Monthly'}
              </button>
              <button onClick={() => setBilling('annual')} style={{
                flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                background: billing === 'annual' ? `rgba(${goldRgb},0.15)` : 'transparent',
                color: billing === 'annual' ? gold : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
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

            {/* Price display */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: gold }}>
                  {formatKr(monthlyPrice)}
                </span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>/{no ? 'mnd' : 'mo'}</span>
              </div>
              {billing === 'annual' && (
                <div style={{ fontSize: 14, color: '#4ade80', fontWeight: 500, marginTop: 4 }}>
                  {no ? `Spar ${formatKr(annualSavings)} i året` : `Save ${formatKr(annualSavings)} a year`}
                </div>
              )}
              {billing === 'annual' && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {no ? `Faktureres ${formatKr(annualTotal)} årlig` : `Billed ${formatKr(annualTotal)} annually`}
                </div>
              )}
            </div>

            {/* Setup fee */}
            <div style={{
              background: `rgba(${goldRgb},0.04)`, borderRadius: 12, padding: '14px 18px',
              marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: `1px solid rgba(${goldRgb},0.08)`,
            }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                {no ? 'Engangskostnad oppsett' : 'One-time setup fee'}
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#f4f1eb' }}>
                {formatKr(tier.setup)}
              </span>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
                {no ? 'Inkludert i pakken:' : 'Included in package:'}
              </h3>
              {features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                  <Check size={16} color={gold} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '16px', borderRadius: 12,
                background: gold, color: bgDark,
                fontWeight: 700, fontSize: 16, border: 'none',
                cursor: checkoutLoading ? 'wait' : 'pointer',
                opacity: checkoutLoading ? 0.7 : 1,
                transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              {checkoutLoading ? (
                <>{no ? 'Går til betaling...' : 'Redirecting to payment...'}</>
              ) : (
                <><ShoppingCart size={18} /> {no ? 'Gå til betaling' : 'Proceed to payment'}</>
              )}
            </button>

            {/* Book meeting alternative */}
            <button
              onClick={openBooking}
              data-cal-namespace="gratis-ai-konsultasjon"
              data-cal-link="arxon/gratis-ai-konsultasjon"
              data-cal-config='{"layout":"month_view"}'
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '14px', borderRadius: 12, marginTop: 12,
                background: 'transparent', color: gold,
                fontWeight: 500, fontSize: 14,
                border: `1px solid rgba(${goldRgb},0.2)`,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
              }}
            >
              <CalendarDays size={16} /> {no ? 'Snakk med oss først' : 'Talk to us first'}
            </button>

            {/* Trust badges */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={12} /> {no ? 'Ingen binding — kanseller når som helst' : 'No commitment — cancel anytime'}
              </span>
              {billing === 'annual' && (
                <span style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={12} /> {no ? '14 dagers åpent kjøp ved årlig betaling' : '14-day money back guarantee'}
                </span>
              )}
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={12} /> {no ? 'Norsk support inkludert' : 'Support included'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Compare link */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 32 }}
        >
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            {no ? 'Ikke sikker? ' : 'Not sure? '}
            <Link href="/priser" style={{ color: gold, textDecoration: 'underline' }}>
              {no ? 'Sammenlign alle pakkene' : 'Compare all packages'}
            </Link>
            {no ? ' eller ' : ' or '}
            <Link href="/pakkebygger" style={{ color: gold, textDecoration: 'underline' }}>
              {no ? 'bygg din egen' : 'build your own'}
            </Link>
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default function TierCheckoutPage() {
  return (
    <Suspense fallback={<div style={{ background: bgDark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold }}>Laster...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
